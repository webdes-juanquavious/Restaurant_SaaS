'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { createClient } from '@/lib/supabase';

/* ---- Types ---- */
interface StaffMember {
    id: string;
    nome: string;
    email: string;
    ruolo: string;
    status: 'attivo' | 'sospeso' | 'malattia';
    telefono?: string;
    oreSettimanali: number;
    vacanzeAnnuali: number;
    created_at?: string;
    password?: string; // temp field for UI only
}

const ruoliDisponibili = ['admin', 'cameriere', 'cuoco', 'cassiere', 'barman', 'pizzaiolo'];

/* ---- Label style for form ---- */

/* ---- Label style for form ---- */
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' };

export default function AdminPersonalePage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [newStaff, setNewStaff] = useState({
        nome: '',
        email: '',
        password: '',
        ruolo: 'cameriere',
        oreSettimanali: 40,
        vacanzeAnnuali: 20
    });
    const [lavoraConNoiAttivo, setLavoraConNoiAttivo] = useState(true);

    const supabase = createClient();

    const fetchStaff = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('personale')
            .select('*')
            .order('nome');

        if (data) {
            const mappedData: StaffMember[] = data.map(item => ({
                id: item.id,
                nome: item.nome,
                email: item.email,
                ruolo: item.ruolo,
                status: item.status,
                telefono: item.telefono,
                oreSettimanali: item.ore_settimanali || 40,
                vacanzeAnnuali: item.vacanze_annuali || 20,
                created_at: item.created_at
            }));
            setStaff(mappedData);
        } else {
            setStaff([]);
        }
        if (error) console.error('Error fetching staff:', error);
        setLoading(false);
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('ristorante_info').select('extra_settings').single();
            if (data?.extra_settings) {
                setLavoraConNoiAttivo(data.extra_settings.lavoraConNoi !== false);
            }
        };
        fetchSettings();
        fetchStaff();
    }, [supabase]);

    // Modals
    const [editModal, setEditModal] = useState<StaffMember | null>(null);
    const [passwordModal, setPasswordModal] = useState<StaffMember | null>(null);
    const [newPassword, setNewPassword] = useState({ pw1: '', pw2: '' });
    const [pwError, setPwError] = useState('');
    const [activeTab, setActiveTab] = useState<'personale' | 'offerte' | 'registro'>('personale');
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    const fetchAttendance = async () => {
        setAttendanceLoading(true);
        // Per semplicità carichiamo gli ultimi 30 giorni
        const { data, error } = await supabase
            .from('registro_presenze')
            .select('*, personale(nome)')
            .order('ingresso', { ascending: false });
        if (data) setAttendanceData(data);
        if (error) console.error('Error fetching attendance:', error);
        setAttendanceLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'registro') fetchAttendance();
    }, [activeTab]);

    /* ---- Add staff ---- */
    const handleAddStaff = async () => {
        if (!newStaff.nome || !newStaff.email || !newStaff.password) return;
        if (newStaff.password.length < 8) { alert('La password deve essere di almeno 8 caratteri.'); return; }

        // Chiamata API route server-side per creare utente autenticato
        try {
            const res = await fetch('/api/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newStaff.email,
                    password: newStaff.password,
                    nome: newStaff.nome,
                    ruolo: newStaff.ruolo,
                    ore_settimanali: newStaff.oreSettimanali,
                    vacanze_annuali: newStaff.vacanzeAnnuali
                })
            });
            const result = await res.json();
            if (!res.ok) {
                alert('Errore autenticazione: ' + (result.error || 'Errore generico'));
                return;
            }
            setNewStaff({
                nome: '',
                email: '',
                password: '',
                ruolo: 'cameriere',
                oreSettimanali: 40,
                vacanzeAnnuali: 20
            });
            fetchStaff();
        } catch (err: any) {
            alert('Errore di rete o server: ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questo utente in modo permanente?')) {
            try {
                const res = await fetch('/api/delete-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: id })
                });
                const result = await res.json();
                if (!res.ok) {
                    alert('Errore eliminazione utente: ' + (result.error || 'Errore generico'));
                    return;
                }
                fetchStaff();
            } catch (err: any) {
                alert('Errore di rete o server durante eliminazione: ' + err.message);
            }
        }
    };

    const cycleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'attivo' ? 'sospeso' : currentStatus === 'sospeso' ? 'malattia' : 'attivo';
        const { error } = await supabase.from('personale').update({ status: nextStatus }).eq('id', id);
        if (error) alert('Errore aggiornamento status: ' + error.message);
        else fetchStaff();
    };

    /* ---- Edit modal save ---- */
    const handleEditSave = async () => {
        if (!editModal) return;
        try {
            const res = await fetch('/api/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: editModal.id,
                    nome: editModal.nome,
                    email: editModal.email,
                    ruolo: editModal.ruolo,
                    oreSettimanali: editModal.oreSettimanali,
                    vacanzeAnnuali: editModal.vacanzeAnnuali,
                    newPassword: (editModal as any).password || undefined
                })
            });
            const result = await res.json();
            if (!res.ok) {
                alert('Errore salvataggio: ' + (result.error || 'Errore generico'));
                return;
            }
            setEditModal(null);
            fetchStaff();
        } catch (err: any) {
            alert('Errore di rete o server: ' + err.message);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword.pw1 !== newPassword.pw2) { setPwError('Le password non coincidono'); return; }
        if (newPassword.pw1.length < 8) { setPwError('Minimo 8 caratteri'); return; }
        if (!passwordModal) return;

        try {
            const res = await fetch('/api/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: passwordModal.id,
                    nome: passwordModal.nome,
                    ruolo: passwordModal.ruolo,
                    newPassword: newPassword.pw1
                })
            });
            const result = await res.json();
            if (!res.ok) { setPwError(result.error || 'Errore aggiornamento password'); return; }
            alert('✅ Password aggiornata con successo!');
            setPasswordModal(null);
        } catch (err: any) {
            setPwError('Errore di rete: ' + err.message);
        }
    };

    /* ---- Status label/style helper ---- */
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'attivo': return { label: '● Attivo', className: styles.statusActive };
            case 'sospeso': return { label: '● Sospeso', className: styles.statusSuspended };
            case 'malattia': return { label: '● Malattia', className: styles.statusSick };
            default: return { label: status, className: '' };
        }
    };

    return (
        <>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div
                    className={`${styles.tabHeaderBox} ${activeTab === 'personale' ? styles.tabHeaderBoxActive : ''}`}
                    onClick={() => setActiveTab('personale')}
                    style={{ flex: 1, cursor: 'pointer', transition: 'all var(--transition-normal)' }}
                >
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Gestione Personale</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aggiungi, modifica o rimuovi i dipendenti del ristorante.</p>
                </div>
                {lavoraConNoiAttivo && (
                    <div
                        className={`${styles.tabHeaderBox} ${activeTab === 'offerte' ? styles.tabHeaderBoxActive : ''}`}
                        onClick={() => setActiveTab('offerte')}
                        style={{ flex: 1, cursor: 'pointer', transition: 'all var(--transition-normal)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}
                    >
                        <h2 style={{ fontSize: '1.4rem' }}>Offerte Lavoro</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Gestione recruiting.</p>
                    </div>
                )}
                <div
                    className={`${styles.tabHeaderBox} ${activeTab === 'registro' ? styles.tabHeaderBoxActive : ''}`}
                    onClick={() => setActiveTab('registro')}
                    style={{ flex: 1, cursor: 'pointer', transition: 'all var(--transition-normal)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}
                >
                    <h2 style={{ fontSize: '1.4rem' }}>Registro Orari</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Registro presenze e bilancio ore.</p>
                </div>
            </div>

            {activeTab === 'personale' ? (
                <>
                    {/* ============ ADD STAFF FORM ============ */}
                    <div className={styles.formPanel}>
                        <h3 className={styles.formPanelTitle}>Aggiungi Dipendente</h3>
                        {/* ... existing form ... */}
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Nome</label>
                                <input type="text" placeholder="Nome completo" value={newStaff.nome}
                                    onChange={(e) => setNewStaff({ ...newStaff, nome: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" placeholder="email@ristorante.it" value={newStaff.email}
                                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Password</label>
                                <input type="password" placeholder="Min. 8 caratteri" value={newStaff.password}
                                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Ruolo</label>
                                <select value={newStaff.ruolo} onChange={(e) => setNewStaff({ ...newStaff, ruolo: e.target.value })} style={{ width: '100%' }}>
                                    {ruoliDisponibili.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Ore/Sett</label>
                                <input type="number" value={newStaff.oreSettimanali}
                                    onChange={(e) => setNewStaff({ ...newStaff, oreSettimanali: parseInt(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Vacanze/Anno</label>
                                <input type="number" value={newStaff.vacanzeAnnuali}
                                    onChange={(e) => setNewStaff({ ...newStaff, vacanzeAnnuali: parseInt(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddStaff} style={{ marginTop: '8px' }}>Crea Account</button>
                    </div>

                    {/* ============ STAFF TABLE ============ */}
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Ruolo</th>
                                <th>Orario</th>
                                <th>Status</th>
                                <th>Vacanze</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Caricamento...</td></tr>
                            ) : staff.map((s) => {
                                const statusInfo = getStatusInfo(s.status);
                                return (
                                    <tr key={s.id}>
                                        <td>{s.nome}</td>
                                        <td>{s.email}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{s.ruolo}</td>
                                        <td style={{ fontSize: '0.82rem' }}>
                                            {s.oreSettimanali}h sett.
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${statusInfo.className}`}>{statusInfo.label}</span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                            <span style={{ color: 'var(--color-primary)' }}>{s.vacanzeAnnuali}gg</span>
                                        </td>
                                        <td>
                                            <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                                                onClick={() => setEditModal({ ...s })}>Modifica</button>
                                            <button className={`${styles.actionBtn} ${styles.actionBtnPassword}`}
                                                onClick={() => { setPasswordModal(s); setNewPassword({ pw1: '', pw2: '' }); setPwError(''); }}>Password</button>
                                            <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`}
                                                onClick={() => cycleStatus(s.id, s.status)}>
                                                {s.status === 'attivo' ? 'Sospendi' : s.status === 'sospeso' ? 'Malattia' : 'Riattiva'}
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                                onClick={() => handleDelete(s.id)}>Elimina</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            ) : activeTab === 'offerte' ? (
                <JobOffersManager />
            ) : (
                <AttendanceRegistry staff={staff} attendance={attendanceData} loading={attendanceLoading} />
            )}

            {/* ============ EDIT MODAL ============ */}
            {editModal && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setEditModal(null)} />
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setEditModal(null)}>✕</button>
                        <h3 className={styles.modalTitle}>Modifica Dipendente</h3>
                        <p className={styles.modalSubtitle}>Modifica i dati di {editModal.nome}</p>

                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Nome</label>
                                <input type="text" value={editModal.nome}
                                    onChange={(e) => setEditModal({ ...editModal, nome: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" value={editModal.email}
                                    onChange={(e) => setEditModal({ ...editModal, email: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Nuova Password</label>
                                <input type="password" placeholder="Min. 8 caratteri" value={editModal.password || ''}
                                    onChange={(e) => setEditModal({ ...editModal, password: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Ruolo</label>
                                <select value={editModal.ruolo}
                                    onChange={(e) => setEditModal({ ...editModal, ruolo: e.target.value })} style={{ width: '100%' }}>
                                    {ruoliDisponibili.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select value={editModal.status}
                                    onChange={(e) => setEditModal({ ...editModal, status: e.target.value as StaffMember['status'] })} style={{ width: '100%' }}>
                                    <option value="attivo">Attivo</option>
                                    <option value="sospeso">Sospeso</option>
                                    <option value="malattia">Malattia</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Ore Settimanali</label>
                                <input type="number" value={editModal.oreSettimanali}
                                    onChange={(e) => setEditModal({ ...editModal, oreSettimanali: parseInt(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Vacanze Annuali</label>
                                <input type="number" value={editModal.vacanzeAnnuali}
                                    onChange={(e) => setEditModal({ ...editModal, vacanzeAnnuali: parseInt(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleEditSave}>Salva Modifiche</button>
                        </div>
                    </div>
                </div>
            )}


            {/* ============ PASSWORD MODAL ============ */}
            {passwordModal && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setPasswordModal(null)} />
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setPasswordModal(null)}>✕</button>
                        <h3 className={styles.modalTitle}>Cambia Password</h3>
                        <p className={styles.modalSubtitle}>Cambia la password per {passwordModal.nome}</p>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Nuova Password</label>
                            <input type="password" placeholder="Min. 8 caratteri" value={newPassword.pw1}
                                onChange={(e) => setNewPassword({ ...newPassword, pw1: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Conferma Password</label>
                            <input type="password" placeholder="Ripeti la password" value={newPassword.pw2}
                                onChange={(e) => setNewPassword({ ...newPassword, pw2: e.target.value })} style={{ width: '100%' }} />
                        </div>

                        {pwError && (
                            <div style={{ padding: '10px 14px', background: 'rgba(239,83,80,0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: '16px' }}>
                                {pwError}
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button className="btn btn-ghost" onClick={() => setPasswordModal(null)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handlePasswordChange}>Cambia Password</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function JobOffersManager() {
    const supabase = createClient();
    const [offerte, setOfferte] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newOfferta, setNewOfferta] = useState({
        titolo: '',
        mansione: '',
        tipo_contratto: 'Full-Time',
        stipendio: '',
        tipo_stipendio: 'annuo',
        descrizione: ''
    });

    const fetchOfferte = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('offerte_lavoro').select('*').order('created_at', { ascending: false });
        if (data) setOfferte(data);
        if (error) console.error('Error fetching job offers:', error);
        setLoading(false);
    };

    useEffect(() => {
        fetchOfferte();
    }, []);

    const handleCreateOfferta = async () => {
        if (!newOfferta.titolo || !newOfferta.mansione) {
            alert('Titolo e Mansione sono obbligatori.');
            return;
        }
        const { error } = await supabase.from('offerte_lavoro').insert([{
            titolo: newOfferta.titolo,
            mansione: newOfferta.mansione,
            tipo_contratto: newOfferta.tipo_contratto,
            stipendio: parseFloat(newOfferta.stipendio) || 0,
            tipo_stipendio: newOfferta.tipo_stipendio,
            descrizione: newOfferta.descrizione
        }]);

        if (error) alert('Errore creazione offerta (Tabella creata?): ' + error.message);
        else {
            setNewOfferta({ titolo: '', mansione: '', tipo_contratto: 'Full-Time', stipendio: '', tipo_stipendio: 'annuo', descrizione: '' });
            fetchOfferte();
        }
    };

    const handleDeleteOfferta = async (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questa offerta?')) {
            const { error } = await supabase.from('offerte_lavoro').delete().eq('id', id);
            if (error) alert('Errore eliminazione: ' + error.message);
            else fetchOfferte();
        }
    };

    return (
        <div style={{ marginTop: '24px' }}>
            <div className={styles.formPanel}>
                <h3 className={styles.formPanelTitle}>Pubblica Nuova Offerta</h3>
                <div className={styles.formRow}>
                    <div style={{ flex: 2 }}>
                        <label style={labelStyle}>Titolo Offerta</label>
                        <input type="text" placeholder="Esempio: Pizzaiolo esperto" value={newOfferta.titolo} onChange={(e) => setNewOfferta({ ...newOfferta, titolo: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Mansione</label>
                        <input type="text" placeholder="Sala, Cucina..." value={newOfferta.mansione} onChange={(e) => setNewOfferta({ ...newOfferta, mansione: e.target.value })} style={{ width: '100%' }} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Tipo Contratto</label>
                        <select value={newOfferta.tipo_contratto} onChange={(e) => setNewOfferta({ ...newOfferta, tipo_contratto: e.target.value })} style={{ width: '100%' }}>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="stagionale">Stagionale</option>
                            <option value="Remoto">Remoto</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Stipendio (€)</label>
                        <input type="number" placeholder="25000" value={newOfferta.stipendio} onChange={(e) => setNewOfferta({ ...newOfferta, stipendio: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Tipo Stipendio</label>
                        <select value={newOfferta.tipo_stipendio} onChange={(e) => setNewOfferta({ ...newOfferta, tipo_stipendio: e.target.value })} style={{ width: '100%' }}>
                            <option value="annuo">Annuo</option>
                            <option value="mensile">Mensile</option>
                            <option value="settimanale">Settimanale</option>
                            <option value="ad ora">Ad ora</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Descrizione</label>
                    <textarea rows={3} placeholder="Breve descrizione..." value={newOfferta.descrizione} onChange={(e) => setNewOfferta({ ...newOfferta, descrizione: e.target.value })} style={{ width: '100%' }} />
                </div>
                <button className="btn btn-primary" onClick={handleCreateOfferta}>Pubblica Offerta</button>
            </div>

            <h3 className={styles.formPanelTitle} style={{ marginTop: '32px' }}>Offerte Pubblicate</h3>
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Titolo</th>
                        <th>Mansione</th>
                        <th>Contratto</th>
                        <th>Stipendio</th>
                        <th>Data</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Caricamento...</td></tr>
                    ) : offerte.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Nessuna offerta pubblicata.</td></tr>
                    ) : offerte.map((o) => (
                        <tr key={o.id}>
                            <td style={{ fontWeight: 600 }}>{o.titolo}</td>
                            <td>{o.mansione}</td>
                            <td style={{ textTransform: 'capitalize' }}>{o.tipo_contratto}</td>
                            <td>€{o.stipendio} / {o.tipo_stipendio}</td>
                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                            <td>
                                <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleDeleteOfferta(o.id)}>Elimina</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AttendanceRegistry({ staff, attendance, loading }: { staff: StaffMember[], attendance: any[], loading: boolean }) {
    // Calcoliamo il bilancio ore (molto semplificato: ore totali nel registro vs ore settimanali)
    const calculateBalance = (employeeId: string, weeklyHours: number) => {
        const empAttendance = attendance.filter(a => a.dipendente_id === employeeId && a.uscita);
        let totalMinutes = 0;
        empAttendance.forEach(a => {
            const start = new Date(a.ingresso).getTime();
            const end = new Date(a.uscita).getTime();
            totalMinutes += (end - start) / (1000 * 60);
        });

        const workedHours = totalMinutes / 60;
        // Supponiamo che il registro mostri l'ultima settimana per il calcolo del bilancio
        const balance = workedHours - weeklyHours;
        return { workedHours, balance };
    };

    return (
        <div style={{ marginTop: '24px' }}>
            <h3 className={styles.formPanelTitle}>Registro Presenze Recenti</h3>
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Dipendente</th>
                        <th>Data</th>
                        <th>Ingresso</th>
                        <th>Uscita</th>
                        <th>Ore Lavorate</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Caricamento...</td></tr>
                    ) : attendance.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Nessun record di presenza trovato.</td></tr>
                    ) : attendance.map((a) => {
                        const start = new Date(a.ingresso);
                        const end = a.uscita ? new Date(a.uscita) : null;
                        const duration = end ? ((end.getTime() - start.getTime()) / (1000 * 3600)).toFixed(2) : '--';
                        return (
                            <tr key={a.id}>
                                <td>{a.personale?.nome || 'Sconosciuto'}</td>
                                <td>{new Date(a.data).toLocaleDateString()}</td>
                                <td>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{end ? end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In corso...'}</td>
                                <td>{duration} h</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <h3 className={styles.formPanelTitle} style={{ marginTop: '40px' }}>Bilancio Ore Settimanali</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {staff.map(member => {
                    const { workedHours, balance } = calculateBalance(member.id, member.oreSettimanali);
                    const isPositive = balance >= 0;
                    return (
                        <div key={member.id} className={styles.formPanel} style={{ margin: 0, padding: '16px', borderLeft: `4px solid ${isPositive ? 'var(--color-success)' : 'var(--color-error)'}` }}>
                            <h4 style={{ margin: '0 0 8px 0' }}>{member.nome}</h4>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <p style={{ margin: '4px 0' }}>Ore contrattuali: <strong>{member.oreSettimanali}h</strong></p>
                                <p style={{ margin: '4px 0' }}>Ore lavorate (registrate): <strong>{workedHours.toFixed(1)}h</strong></p>
                            </div>
                            <div style={{
                                marginTop: '12px',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: isPositive ? 'var(--color-success)' : 'var(--color-error)'
                            }}>
                                Bilancio: {isPositive ? '+' : ''}{balance.toFixed(1)}h
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


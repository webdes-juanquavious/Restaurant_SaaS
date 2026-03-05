'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { createClient } from '@/lib/supabase';
import TableHeatmap from '@/components/admin/TableHeatmap';
import SeasonalInsights from '@/components/admin/SeasonalInsights';

/* ---- Types ---- */
interface StaffMember {
    id: string;
    nome: string;
    email: string;
    ruolo: string;
    status: 'attivo' | 'sospeso' | 'malattia';
    telefono?: string;
    oreSettimanali: number;
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
    const [newStaff, setNewStaff] = useState({ nome: '', email: '', password: '', ruolo: 'cameriere' });

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
                oreSettimanali: item.ore_settimanali,
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
        fetchStaff();
    }, []);

    // Modals
    const [editModal, setEditModal] = useState<StaffMember | null>(null);
    const [passwordModal, setPasswordModal] = useState<StaffMember | null>(null);
    const [newPassword, setNewPassword] = useState({ pw1: '', pw2: '' });
    const [pwError, setPwError] = useState('');
    const [activeTab, setActiveTab] = useState<'personale' | 'offerte' | 'analitiche'>('personale');

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
                    ruolo: newStaff.ruolo
                })
            });
            const result = await res.json();
            if (!res.ok) {
                alert('Errore autenticazione: ' + (result.error || 'Errore generico'));
                return;
            }
            setNewStaff({ nome: '', email: '', password: '', ruolo: 'cameriere' });
            fetchStaff();
        } catch (err: any) {
            alert('Errore di rete o server: ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questo dipendente?')) {
            const { error } = await supabase.from('personale').delete().eq('id', id);
            if (error) alert('Errore eliminazione: ' + error.message);
            else fetchStaff();
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
                    ruolo: editModal.ruolo,
                    oreSettimanali: editModal.oreSettimanali,
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
                <div
                    className={`${styles.tabHeaderBox} ${activeTab === 'offerte' ? styles.tabHeaderBoxActive : ''}`}
                    onClick={() => setActiveTab('offerte')}
                    style={{ flex: 1, cursor: 'pointer', transition: 'all var(--transition-normal)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}
                >
                    <h2 style={{ fontSize: '1.4rem' }}>Offerte Lavoro</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Gestione recruiting.</p>
                </div>
                <div
                    className={`${styles.tabHeaderBox} ${activeTab === 'analitiche' ? styles.tabHeaderBoxActive : ''}`}
                    onClick={() => setActiveTab('analitiche')}
                    style={{ flex: 1, cursor: 'pointer', transition: 'all var(--transition-normal)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}
                >
                    <h2 style={{ fontSize: '1.4rem' }}>Analitiche</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Heatmap e Trend.</p>
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
                                            <span style={{ color: 'var(--color-primary)' }}>N/A</span>
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
                <div className={styles.formPanel} style={{ textAlign: 'center', padding: '60px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Modulo Offerte di Lavoro</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Prossimamente: In questa sezione potrai gestire gli annunci di lavoro per il ristorante.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <TableHeatmap />
                    <SeasonalInsights />
                </div>
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

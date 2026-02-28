'use client';

import { useState } from 'react';
import styles from './admin.module.css';

/* ---- Types ---- */
interface StaffMember {
    id: number;
    nome: string;
    email: string;
    ruolo: string;
    status: 'active' | 'suspended' | 'malattia';
    orarioEntrata: string;
    orarioUscita: string;
    vacanzePrese: number;
    vacanzeTotali: number;
    storico: { giorno: string; label: string; entrata: string; uscita: string; tipo: 'lavoro' | 'malattia' | 'riposo' }[];
}

const ruoliDisponibili = ['Cameriere', 'Cuoco', 'Cassiere', 'Barman', 'Pizzaiolo'];

const initialStaff: StaffMember[] = [
    {
        id: 1, nome: 'Luca Bianchi', email: 'luca@mare.it', ruolo: 'Cameriere', status: 'active',
        orarioEntrata: '10:00', orarioUscita: '18:00', vacanzePrese: 7, vacanzeTotali: 30,
        storico: [
            { giorno: '2026-02-20', label: 'Ven', entrata: '10:00', uscita: '18:00', tipo: 'lavoro' },
            { giorno: '2026-02-21', label: 'Sab', entrata: '11:00', uscita: '22:00', tipo: 'lavoro' },
            { giorno: '2026-02-22', label: 'Dom', entrata: '', uscita: '', tipo: 'riposo' },
            { giorno: '2026-02-23', label: 'Lun', entrata: '10:00', uscita: '18:00', tipo: 'lavoro' },
            { giorno: '2026-02-24', label: 'Mar', entrata: '', uscita: '', tipo: 'malattia' },
            { giorno: '2026-02-25', label: 'Mer', entrata: '09:30', uscita: '17:30', tipo: 'lavoro' },
            { giorno: '2026-02-26', label: 'Gio', entrata: '10:00', uscita: '18:00', tipo: 'lavoro' },
        ],
    },
    {
        id: 2, nome: 'Anna Verde', email: 'anna@mare.it', ruolo: 'Cuoco', status: 'active',
        orarioEntrata: '09:00', orarioUscita: '17:00', vacanzePrese: 3, vacanzeTotali: 30,
        storico: [
            { giorno: '2026-02-20', label: 'Ven', entrata: '09:00', uscita: '17:00', tipo: 'lavoro' },
            { giorno: '2026-02-21', label: 'Sab', entrata: '09:00', uscita: '21:00', tipo: 'lavoro' },
            { giorno: '2026-02-22', label: 'Dom', entrata: '10:00', uscita: '20:00', tipo: 'lavoro' },
            { giorno: '2026-02-23', label: 'Lun', entrata: '09:00', uscita: '17:00', tipo: 'lavoro' },
            { giorno: '2026-02-24', label: 'Mar', entrata: '09:00', uscita: '17:00', tipo: 'lavoro' },
            { giorno: '2026-02-25', label: 'Mer', entrata: '', uscita: '', tipo: 'riposo' },
            { giorno: '2026-02-26', label: 'Gio', entrata: '09:00', uscita: '17:00', tipo: 'lavoro' },
        ],
    },
    {
        id: 3, nome: 'Paolo Neri', email: 'paolo@mare.it', ruolo: 'Barman', status: 'malattia',
        orarioEntrata: '', orarioUscita: '', vacanzePrese: 12, vacanzeTotali: 30,
        storico: [
            { giorno: '2026-02-20', label: 'Ven', entrata: '17:00', uscita: '01:00', tipo: 'lavoro' },
            { giorno: '2026-02-21', label: 'Sab', entrata: '17:00', uscita: '02:00', tipo: 'lavoro' },
            { giorno: '2026-02-22', label: 'Dom', entrata: '', uscita: '', tipo: 'riposo' },
            { giorno: '2026-02-23', label: 'Lun', entrata: '', uscita: '', tipo: 'malattia' },
            { giorno: '2026-02-24', label: 'Mar', entrata: '', uscita: '', tipo: 'malattia' },
            { giorno: '2026-02-25', label: 'Mer', entrata: '', uscita: '', tipo: 'malattia' },
            { giorno: '2026-02-26', label: 'Gio', entrata: '', uscita: '', tipo: 'malattia' },
        ],
    },
];

/* ---- Helper: time string to hours ---- */
function timeToHours(t: string): number {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
}

function calcHours(entrata: string, uscita: string): number {
    if (!entrata || !uscita) return 0;
    let e = timeToHours(entrata);
    let u = timeToHours(uscita);
    if (u < e) u += 24; // overnight
    return Math.round((u - e) * 10) / 10;
}

/* ---- Label style for form ---- */
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' };

export default function AdminPersonalePage() {
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const [newStaff, setNewStaff] = useState({ nome: '', email: '', password: '', ruolo: 'Cameriere' });

    // Modals
    const [editModal, setEditModal] = useState<StaffMember | null>(null);
    const [historyModal, setHistoryModal] = useState<StaffMember | null>(null);
    const [passwordModal, setPasswordModal] = useState<StaffMember | null>(null);
    const [newPassword, setNewPassword] = useState({ pw1: '', pw2: '' });
    const [pwError, setPwError] = useState('');

    /* ---- Add staff ---- */
    const handleAddStaff = () => {
        if (!newStaff.nome || !newStaff.email || !newStaff.password) return;
        if (newStaff.password.length < 8) { alert('La password deve essere di almeno 8 caratteri.'); return; }
        const entry: StaffMember = {
            id: Date.now(), nome: newStaff.nome, email: newStaff.email, ruolo: newStaff.ruolo,
            status: 'active', orarioEntrata: '10:00', orarioUscita: '18:00',
            vacanzePrese: 0, vacanzeTotali: 30, storico: [],
        };
        setStaff([...staff, entry]);
        setNewStaff({ nome: '', email: '', password: '', ruolo: 'Cameriere' });
    };

    const handleDelete = (id: number) => {
        if (confirm('Sei sicuro di voler eliminare questo dipendente?')) {
            setStaff(staff.filter((s) => s.id !== id));
        }
    };

    const cycleStatus = (id: number) => {
        setStaff(staff.map((s) => {
            if (s.id !== id) return s;
            const nextStatus = s.status === 'active' ? 'suspended' : s.status === 'suspended' ? 'malattia' : 'active';
            return { ...s, status: nextStatus };
        }));
    };

    /* ---- Edit modal save ---- */
    const handleEditSave = () => {
        if (!editModal) return;
        setStaff(staff.map((s) => s.id === editModal.id ? editModal : s));
        setEditModal(null);
    };

    /* ---- Password change ---- */
    const handlePasswordChange = () => {
        setPwError('');
        if (newPassword.pw1.length < 8) { setPwError('La password deve essere di almeno 8 caratteri.'); return; }
        if (newPassword.pw1 !== newPassword.pw2) { setPwError('Le password non coincidono.'); return; }
        // In production: update on Supabase
        alert(`Password aggiornata per ${passwordModal?.nome}`);
        setPasswordModal(null);
        setNewPassword({ pw1: '', pw2: '' });
    };

    /* ---- Tab state ---- */
    const [activeTab, setActiveTab] = useState<'personale' | 'offerte'>('personale');

    /* ---- Status label/style helper ---- */
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'active': return { label: '● Attivo', className: styles.statusActive };
            case 'suspended': return { label: '● Sospeso', className: styles.statusSuspended };
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
                    style={{ flex: 1, cursor: 'pointer', transition: 'all var(--transition-normal)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}
                >
                    <h2 style={{ fontSize: '1.5rem', color: activeTab === 'offerte' ? 'var(--color-primary)' : 'var(--color-error)', textAlign: 'center' }}>
                        Gestione Offerte di lavoro
                    </h2>
                </div>
            </div>

            {activeTab === 'personale' ? (
                <>
                    {/* ============ ADD STAFF FORM ============ */}
                    <div className={styles.formPanel}>
                        <h3 className={styles.formPanelTitle}>Aggiungi Dipendente</h3>
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
                </>
            ) : (
                <div className={styles.formPanel} style={{ textAlign: 'center', padding: '60px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Modulo Offerte di Lavoro</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Prossimamente: In questa sezione potrai gestire gli annunci di lavoro per il ristorante.</p>
                </div>
            )}

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
                    {staff.map((s) => {
                        const statusInfo = getStatusInfo(s.status);
                        return (
                            <tr key={s.id}>
                                <td>{s.nome}</td>
                                <td>{s.email}</td>
                                <td>{s.ruolo}</td>
                                <td style={{ fontSize: '0.82rem' }}>
                                    {s.orarioEntrata && s.orarioUscita
                                        ? `${s.orarioEntrata} – ${s.orarioUscita}`
                                        : '—'}
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${statusInfo.className}`}>{statusInfo.label}</span>
                                </td>
                                <td style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                    <span style={{ color: 'var(--color-primary)' }}>{s.vacanzePrese}</span>
                                    <span style={{ color: 'var(--text-muted)' }}> su {s.vacanzeTotali}</span>
                                </td>
                                <td>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                                        onClick={() => setEditModal({ ...s })}>Modifica</button>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnHistory}`}
                                        onClick={() => setHistoryModal(s)}>Storico</button>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnPassword}`}
                                        onClick={() => { setPasswordModal(s); setNewPassword({ pw1: '', pw2: '' }); setPwError(''); }}>Password</button>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`}
                                        onClick={() => cycleStatus(s.id)}>
                                        {s.status === 'active' ? 'Sospendi' : s.status === 'suspended' ? 'Malattia' : 'Riattiva'}
                                    </button>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                        onClick={() => handleDelete(s.id)}>Elimina</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

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
                                    <option value="active">Attivo</option>
                                    <option value="suspended">Sospeso</option>
                                    <option value="malattia">Malattia</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Orario Entrata</label>
                                <input type="time" value={editModal.orarioEntrata}
                                    onChange={(e) => setEditModal({ ...editModal, orarioEntrata: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Orario Uscita</label>
                                <input type="time" value={editModal.orarioUscita}
                                    onChange={(e) => setEditModal({ ...editModal, orarioUscita: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Vacanze Prese</label>
                                <input type="number" min={0} max={editModal.vacanzeTotali} value={editModal.vacanzePrese}
                                    onChange={(e) => setEditModal({ ...editModal, vacanzePrese: parseInt(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Vacanze Totali</label>
                                <input type="number" min={0} value={editModal.vacanzeTotali}
                                    onChange={(e) => setEditModal({ ...editModal, vacanzeTotali: parseInt(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleEditSave}>Salva Modifiche</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ HISTORY MODAL (Bar Chart) ============ */}
            {historyModal && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setHistoryModal(null)} />
                    <div className={`${styles.modalContent} ${styles.modalWide}`}>
                        <button className={styles.modalClose} onClick={() => setHistoryModal(null)}>✕</button>
                        <h3 className={styles.modalTitle}>Storico Presenze</h3>
                        <p className={styles.modalSubtitle}>{historyModal.nome} — Ultimi 7 giorni</p>

                        {/* Bar Chart */}
                        <div className={styles.barChart}>
                            {historyModal.storico.map((day, i) => {
                                const hours = calcHours(day.entrata, day.uscita);
                                const maxH = 12;
                                const heightPct = day.tipo === 'malattia' ? 100 : day.tipo === 'riposo' ? 0 : Math.min((hours / maxH) * 100, 100);
                                const bgColor = day.tipo === 'malattia' ? 'var(--color-error)' : day.tipo === 'riposo' ? 'var(--border-color)' : 'var(--color-primary)';

                                return (
                                    <div key={i} className={styles.barGroup}>
                                        <div className={styles.barStack}>
                                            <div
                                                className={styles.bar}
                                                style={{
                                                    height: `${heightPct}%`,
                                                    background: bgColor,
                                                    opacity: day.tipo === 'riposo' ? 0.3 : 1,
                                                }}
                                                title={
                                                    day.tipo === 'malattia' ? 'Malattia'
                                                        : day.tipo === 'riposo' ? 'Giorno di riposo'
                                                            : `${day.entrata} - ${day.uscita} (${hours}h)`
                                                }
                                            />
                                        </div>
                                        <span className={styles.barLabel}>{day.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className={styles.barLegend}>
                            <div className={styles.barLegendItem}>
                                <div className={styles.barLegendColor} style={{ background: 'var(--color-primary)' }} />
                                Lavoro
                            </div>
                            <div className={styles.barLegendItem}>
                                <div className={styles.barLegendColor} style={{ background: 'var(--color-error)' }} />
                                Malattia
                            </div>
                            <div className={styles.barLegendItem}>
                                <div className={styles.barLegendColor} style={{ background: 'var(--border-color)' }} />
                                Riposo
                            </div>
                        </div>

                        {/* Detail Table */}
                        <table className={styles.dataTable} style={{ marginTop: '24px' }}>
                            <thead>
                                <tr>
                                    <th>Giorno</th>
                                    <th>Tipo</th>
                                    <th>Entrata</th>
                                    <th>Uscita</th>
                                    <th>Ore</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyModal.storico.map((day, i) => (
                                    <tr key={i}>
                                        <td>{day.label} {day.giorno}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${day.tipo === 'lavoro' ? styles.statusActive : day.tipo === 'malattia' ? styles.statusSick : styles.statusSuspended
                                                }`}>
                                                {day.tipo === 'lavoro' ? '● Lavoro' : day.tipo === 'malattia' ? '● Malattia' : '● Riposo'}
                                            </span>
                                        </td>
                                        <td>{day.entrata || '—'}</td>
                                        <td>{day.uscita || '—'}</td>
                                        <td style={{ fontWeight: 600 }}>{day.tipo === 'lavoro' ? `${calcHours(day.entrata, day.uscita)}h` : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.modalActions}>
                            <button className="btn btn-primary" onClick={() => setHistoryModal(null)}>Chiudi</button>
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

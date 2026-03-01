'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase';

/* ---- Types ---- */
interface Tavolo {
    id: string; // Changed to string for UUID
    numero: number;
    nome: string;
    posti: number;
    status: 'attivo' | 'sospeso' | 'occupato';
}

interface Prenotazione {
    id: string; // UUID
    tavoloId: string; // UUID
    data: string;
    orario: string;
    cliente: string;
    telefono: string;
    persone: number;
    totale: number;
    status: 'confermata' | 'annullata' | 'no-show';
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' };

// Mock data removed in favor of Supabase

/* Helpers */
const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }
function formatDate(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }

const colors = ['#e67e22', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#f39c12', '#e84393'];

export default function AdminTavoliPage() {
    const today = new Date().toISOString().split('T')[0];
    const [activeMainTab, setActiveMainTab] = useState<'prenotazioni' | 'gestione'>('prenotazioni');
    
    const [tavoli, setTavoli] = useState<Tavolo[]>([]);
    const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTavolo, setNewTavolo] = useState({ nome: '', posti: '4', numero: '' });

    const supabase = createClient();

    const fetchAllData = async () => {
        setLoading(true);
        const { data: tData, error: tError } = await supabase.from('tavoli').select('*').order('numero');
        const { data: pData, error: pError } = await supabase.from('prenotazioni').select('*').order('data', { ascending: false });

        if (tData) {
            setTavoli(tData.map(t => ({
                id: t.id,
                numero: t.numero,
                nome: t.nome || `Tavolo #${t.numero}`,
                posti: t.posti,
                status: t.status
            })));
        }
        if (pData) {
            setPrenotazioni(pData.map(p => ({
                id: p.id,
                tavoloId: p.tavolo_id,
                data: p.data,
                orario: p.orario,
                cliente: p.cliente_nome,
                telefono: p.cliente_telefono,
                persone: p.persone,
                totale: 0, // Not in schema, fallback to 0 or calculate if needed
                status: p.stato
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Calendar state
    const [calendarMode, setCalendarMode] = useState<'giorno' | 'range'>('giorno');
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<string>(today);
    const [rangeStart, setRangeStart] = useState<string>('');
    const [rangeEnd, setRangeEnd] = useState<string>('');

    // Modals
    const [editModal, setEditModal] = useState<Tavolo | null>(null);

    const isToday = (dateStr: string) => dateStr === today;
    const isPast = (dateStr: string) => dateStr < today;

    /* ---- Gestione Tavoli ---- */
    const handleAddTavolo = async () => {
        if (!newTavolo.numero) return;
        const { error } = await supabase.from('tavoli').insert([{
            numero: parseInt(newTavolo.numero),
            nome: newTavolo.nome,
            posti: parseInt(newTavolo.posti),
            status: 'attivo'
        }]);
        if (error) alert('Errore creazione tavolo: ' + error.message);
        else {
            setNewTavolo({ nome: '', posti: '4', numero: '' });
            fetchAllData();
        }
    };

    const toggleSuspend = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'attivo' ? 'sospeso' : 'attivo';
        const { error } = await supabase.from('tavoli').update({ status: nextStatus }).eq('id', id);
        if (error) alert('Errore aggiornamento: ' + error.message);
        else fetchAllData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questo tavolo?')) {
            const { error } = await supabase.from('tavoli').delete().eq('id', id);
            if (error) alert('Errore eliminazione: ' + error.message);
            else fetchAllData();
        }
    };

    const handleEditSave = async () => {
        if (!editModal) return;
        const { error } = await supabase.from('tavoli').update({
            nome: editModal.nome,
            numero: editModal.numero,
            posti: editModal.posti,
            status: editModal.status
        }).eq('id', editModal.id);
        if (error) alert('Errore salvataggio: ' + error.message);
        else {
            setEditModal(null);
            fetchAllData();
        }
    };

    /* ---- Gestione Prenotazioni ---- */
    const handleStatusChange = async (id: string, status: Prenotazione['status']) => {
        if (confirm(`Confermi di voler modificare lo stato in "${status}"?`)) {
            const { error } = await supabase.from('prenotazioni').update({ stato: status }).eq('id', id);
            if (error) alert('Errore aggiornamento: ' + error.message);
            else fetchAllData();
        }
    };

    const getPrenotazioniForDate = (date: string) => prenotazioni.filter(p => p.data === date);
    const getPrenotazioniForTavolo = (tavoloId: number, date: string) => prenotazioni.filter(p => p.tavoloId === tavoloId && p.data === date);
    const getTotaleForTavolo = (tavoloId: number, date: string) => getPrenotazioniForTavolo(tavoloId, date).filter(p => p.status === 'confermata').reduce((sum, p) => sum + p.totale, 0);

    /* ---- Calendar logic ---- */
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(calYear, calMonth);
        const firstDay = getFirstDayOfMonth(calYear, calMonth);
        const days: { day: number; month: number; year: number; dateStr: string; currentMonth: boolean }[] = [];

        const prevMonth = calMonth === 0 ? 11 : calMonth - 1;
        const prevYear = calMonth === 0 ? calYear - 1 : calYear;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            days.push({ day: d, month: prevMonth, year: prevYear, dateStr: formatDate(prevYear, prevMonth, d), currentMonth: false });
        }

        for (let d = 1; d <= daysInMonth; d++) {
            days.push({ day: d, month: calMonth, year: calYear, dateStr: formatDate(calYear, calMonth, d), currentMonth: true });
        }

        const remaining = 42 - days.length;
        const nextMonth = calMonth === 11 ? 0 : calMonth + 1;
        const nextYear = calMonth === 11 ? calYear + 1 : calYear;
        for (let d = 1; d <= remaining; d++) {
            days.push({ day: d, month: nextMonth, year: nextYear, dateStr: formatDate(nextYear, nextMonth, d), currentMonth: false });
        }

        return days;
    }, [calMonth, calYear]);

    const handleCalendarClick = (dateStr: string) => {
        if (calendarMode === 'giorno') {
            setSelectedDay(dateStr);
        } else {
            if (!rangeStart || (rangeStart && rangeEnd)) {
                setRangeStart(dateStr);
                setRangeEnd('');
            } else {
                if (dateStr < rangeStart) { setRangeEnd(rangeStart); setRangeStart(dateStr); }
                else { setRangeEnd(dateStr); }
            }
        }
    };

    const isInRange = (dateStr: string) => (calendarMode === 'range' && rangeStart && rangeEnd && dateStr >= rangeStart && dateStr <= rangeEnd);
    const isSelected = (dateStr: string) => (calendarMode === 'giorno' ? dateStr === selectedDay : dateStr === rangeStart || dateStr === rangeEnd);

    const rangePrenotazioni = useMemo(() => {
        if (calendarMode !== 'range' || !rangeStart || !rangeEnd) return [];
        return prenotazioni.filter(p => p.data >= rangeStart && p.data <= rangeEnd);
    }, [calendarMode, rangeStart, rangeEnd, prenotazioni]);

    const dayPrenotazioni = getPrenotazioniForDate(selectedDay);
    const viewDate = calendarMode === 'giorno' ? selectedDay : '';

    return (
        <>
            {/* BIG CARDS NAVIGATION - PREMIUM STYLE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div 
                    className={`${styles.tabHeaderBox} ${activeMainTab === 'prenotazioni' ? styles.tabHeaderBoxActive : ''}`}
                    onClick={() => setActiveMainTab('prenotazioni')}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Gestione Prenotazioni</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>Visualizza lo stato giornaliero, conferma o annulla le prenotazioni.</p>
                </div>
                
                <div 
                    className={`${styles.tabHeaderBox} ${activeMainTab === 'gestione' ? styles.tabHeaderBoxActive : ''}`}
                    onClick={() => setActiveMainTab('gestione')}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Gestione Tavoli</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>Configura la sala, aggiungi nuovi tavoli o modifica le impostazioni.</p>
                </div>
            </div>

            {/* =========================================
                TAB 1: GESTISCI PRENOTAZIONI 
            ========================================= */}
            {activeMainTab === 'prenotazioni' && (
                <>
                    {/* CALENDAR */}
                    <div className={styles.calendarContainer}>
                        <div className={styles.calendarHeader}>
                            <div className={styles.calendarNav}>
                                <button className={styles.calendarNavBtn} onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); } }}>←</button>
                                <span className={styles.calendarMonthLabel}>{MONTHS[calMonth]} {calYear}</span>
                                <button className={styles.calendarNavBtn} onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); } }}>→</button>
                            </div>
                            <div className={styles.calendarModeTabs}>
                                <button className={`${styles.calendarModeTab} ${calendarMode === 'giorno' ? styles.calendarModeTabActive : ''}`} onClick={() => setCalendarMode('giorno')}>Giorno</button>
                                <button className={`${styles.calendarModeTab} ${calendarMode === 'range' ? styles.calendarModeTabActive : ''}`} onClick={() => { setCalendarMode('range'); setRangeStart(''); setRangeEnd(''); }}>Da — A</button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className={styles.calendarGrid}>
                            {DAYS.map(d => <div key={d} className={styles.calendarDayHeader}>{d}</div>)}
                            {calendarDays.map((day, i) => {
                                const dayBooks = prenotazioni.filter(p => p.data === day.dateStr && p.status === 'confermata');
                                return (
                                    <div
                                        key={i}
                                        className={`${styles.calendarDay} ${!day.currentMonth ? styles.calendarDayOtherMonth : ''} ${day.dateStr === today ? styles.calendarDayToday : ''} ${isSelected(day.dateStr) ? styles.calendarDaySelected : ''} ${isInRange(day.dateStr) ? styles.calendarDayInRange : ''}`}
                                        onClick={() => handleCalendarClick(day.dateStr)}
                                    >
                                        {day.day}
                                        {dayBooks.length > 0 && day.currentMonth && <div className={styles.calendarDayDot} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DAY VIEW */}
                    {calendarMode === 'giorno' && viewDate && (
                        <div className={styles.formPanel}>
                            <h3 className={styles.formPanelTitle}>
                                {isToday(viewDate) ? '📅 Prenotazioni di Oggi' : isPast(viewDate) ? `📖 Storico — ${viewDate}` : `📋 Prenotazioni Future — ${viewDate}`}
                            </h3>

                            {dayPrenotazioni.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>Nessuna prenotazione per questa data.</p>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.88rem' }}>🪑 <strong>{new Set(dayPrenotazioni.filter(p=>p.status==='confermata').map(p => p.tavoloId)).size}</strong> tavoli attivi</span>
                                        <span style={{ fontSize: '0.88rem' }}>👥 <strong>{dayPrenotazioni.filter(p=>p.status==='confermata').reduce((s, p) => s + p.persone, 0)}</strong> persone confermate</span>
                                        <span style={{ fontSize: '0.88rem', color: 'var(--color-primary)', fontWeight: 600 }}>💰 €{dayPrenotazioni.filter(p=>p.status==='confermata').reduce((s, p) => s + p.totale, 0).toFixed(0)}</span>
                                    </div>

                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>Tavolo</th>
                                                <th>Orario</th>
                                                <th>Cliente & Recapito</th>
                                                <th>Persone</th>
                                                <th>Status</th>
                                                <th>Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dayPrenotazioni.sort((a,b)=>a.orario.localeCompare(b.orario)).map(p => {
                                                const tavolo = tavoli.find(t => t.id === p.tavoloId);
                                                return (
                                                    <tr key={p.id} style={{ opacity: p.status !== 'confermata' ? 0.6 : 1 }}>
                                                        <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{tavolo?.nome || '?'}</td>
                                                        <td style={{ fontWeight: 600 }}>{p.orario}</td>
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{p.cliente}</div>
                                                            {p.telefono && (
                                                                <a href={`tel:${p.telefono}`} style={{ fontSize: '0.8rem', color: 'var(--color-info)' }}>{p.telefono}</a>
                                                            )}
                                                        </td>
                                                        <td>{p.persone}</td>
                                                        <td>
                                                            {p.status === 'confermata' && <span className={`${styles.statusBadge} ${styles.statusActive}`}>Confermata</span>}
                                                            {p.status === 'no-show' && <span className={`${styles.statusBadge} ${styles.statusSuspended}`}>No-Show</span>}
                                                            {p.status === 'annullata' && <span className={`${styles.statusBadge} ${styles.statusSuspended}`}>Annullata</span>}
                                                        </td>
                                                        <td>
                                                            {p.status === 'confermata' && (
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                     <button className={styles.actionBtn} style={{ background: 'var(--bg-surface-elevated)' }} onClick={() => handleStatusChange(p.id, 'annullata')}>
                                                                         Annulla
                                                                    </button>
                                                                    <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleStatusChange(p.id, 'no-show')}>
                                                                        No-Show
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {p.status !== 'confermata' && (
                                                                <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() => handleStatusChange(p.id, 'confermata')}>
                                                                    Ripristina
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    )}

                    {/* RANGE VIEW */}
                    {calendarMode === 'range' && rangeStart && rangeEnd && (
                        <div className={styles.formPanel}>
                            <h3 className={styles.formPanelTitle}>📊 Prenotazioni Confermate dal {rangeStart} al {rangeEnd}</h3>
                            {rangePrenotazioni.filter(p=>p.status==='confermata').length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center' }}>Nessuna prenotazione confermata nel periodo.</p>
                            ) : (
                                <>
                                    <div className={styles.bookingTimeline}>
                                        {tavoli.map((tavolo, ti) => {
                                            const tavoloBookings = rangePrenotazioni.filter(p => p.tavoloId === tavolo.id && p.status==='confermata');
                                            const tavoloTotale = tavoloBookings.reduce((s, p) => s + p.totale, 0);
                                            if (tavoloBookings.length === 0) return null;
                                            return (
                                                <div key={tavolo.id} className={styles.bookingRow}>
                                                    <span className={styles.bookingRowLabel}>{tavolo.nome}</span>
                                                    <div className={styles.bookingRowBar}>
                                                        {tavoloBookings.map((b, bi) => {
                                                            const totalDays = Math.max(1, Math.ceil((new Date(rangeEnd).getTime() - new Date(rangeStart).getTime()) / 86400000) + 1);
                                                            const dayIndex = Math.ceil((new Date(b.data).getTime() - new Date(rangeStart).getTime()) / 86400000);
                                                            const left = (dayIndex / totalDays) * 100;
                                                            const width = Math.max(100 / totalDays, 4);
                                                            return (
                                                                <div
                                                                    key={bi}
                                                                    className={styles.bookingBlock}
                                                                    style={{ left: `${left}%`, width: `${width}%`, background: colors[ti % colors.length] }}
                                                                    title={`${b.data} ${b.orario} — ${b.cliente} — €${b.totale}`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', minWidth: '60px', textAlign: 'right' }}>
                                                        €{tavoloTotale}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* =========================================
                TAB 2: GESTIONE TAVOLI 
            ========================================= */}
            {activeMainTab === 'gestione' && (
                <>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryIcon}>🪑</span>
                            <div>
                                <div className={styles.summaryValue}>{tavoli.length}</div>
                                <div className={styles.summaryLabel}>Tavoli Totali</div>
                            </div>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryIcon}>✅</span>
                            <div>
                                <div className={styles.summaryValue}>{tavoli.filter(t => t.status === 'active').length}</div>
                                <div className={styles.summaryLabel}>Attivi</div>
                            </div>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryIcon}>👥</span>
                            <div>
                                <div className={styles.summaryValue}>{tavoli.reduce((s, t) => s + t.posti, 0)}</div>
                                <div className={styles.summaryLabel}>Posti Totali</div>
                            </div>
                        </div>
                    </div>

                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Posti</th>
                                <th>Status</th>
                                <th>Prenotazioni di Oggi</th>
                                <th>Incasso Previsto Oggi</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tavoli.map((t) => {
                                const prenOggi = getPrenotazioniForTavolo(t.id, today).filter(p=>p.status==='confermata');
                                const totaleOggi = prenOggi.reduce((sum, p) => sum + p.totale, 0);
                                return (
                                    <tr key={t.id}>
                                        <td style={{ fontWeight: 600 }}>{t.nome}</td>
                                        <td>{t.posti}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${t.status === 'attivo' ? styles.statusActive : t.status === 'occupato' ? styles.statusActive : styles.statusSuspended}`}>
                                                {t.status === 'attivo' ? '● Attivo' : t.status === 'occupato' ? '● Occupato' : '● Sospeso'}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{prenOggi.length}</td>
                                        <td style={{ fontWeight: 600, color: totaleOggi > 0 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                            {totaleOggi > 0 ? `€${totaleOggi.toFixed(0)}` : '€0'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() => setEditModal({ ...t })}>Modifica</button>
                                                <button className={`${styles.actionBtn}`} style={{ background: t.status === 'attivo' ? 'var(--bg-surface-elevated)' : 'var(--color-success)', color: 'var(--text-primary)' }} onClick={() => toggleSuspend(t.id, t.status)}>
                                                    {t.status === 'attivo' ? 'Sospendi' : 'Riattiva'}
                                                </button>
                                                <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleDelete(t.id)}>Elimina</button>
                                                <a href="/admin/contabilita" className={`${styles.actionBtn}`} style={{ background: 'var(--color-primary)', color: 'var(--text-on-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                                    Conto ▸
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className={styles.formPanel} style={{ marginTop: '32px' }}>
                        <h3 className={styles.formPanelTitle}>Aggiungi un nuovo Tavolo</h3>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Numero Tavolo</label>
                                <input type="number" placeholder="1" value={newTavolo.numero} onChange={(e) => setNewTavolo({ ...newTavolo, numero: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Nome Alternativo (Opzionale)</label>
                                <input type="text" placeholder="Es: Terrazza sud" value={newTavolo.nome} onChange={(e) => setNewTavolo({ ...newTavolo, nome: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Numero Posti</label>
                                <input type="number" placeholder="4" min="1" max="20" value={newTavolo.posti} onChange={(e) => setNewTavolo({ ...newTavolo, posti: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddTavolo} style={{ marginTop: '16px' }}>Crea Tavolo</button>
                    </div>

                    {editModal && (
                        <div className={styles.modal}>
                            <div className={styles.modalOverlay} onClick={() => setEditModal(null)} />
                            <div className={styles.modalContent}>
                                <button className={styles.modalClose} onClick={() => setEditModal(null)}>✕</button>
                                <h3 className={styles.modalTitle}>Modifica {editModal.nome}</h3>
                                <p className={styles.modalSubtitle}>Aggiorna i dati del tavolo.</p>
                                <div className={styles.formRow}>
                                    <div>
                                        <label style={labelStyle}>Nome Tavolo</label>
                                        <input type="text" value={editModal.nome} onChange={(e) => setEditModal({ ...editModal, nome: e.target.value })} style={{ width: '100%' }} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Numero Posti</label>
                                        <input type="number" min={1} max={20} value={editModal.posti} onChange={(e) => setEditModal({ ...editModal, posti: parseInt(e.target.value) || 1 })} style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Annulla</button>
                                    <button className="btn btn-primary" onClick={handleEditSave}>Salva Modifiche</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

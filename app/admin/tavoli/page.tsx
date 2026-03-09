'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase';

/* ---- Types ---- */
interface Tavolo {
    id: string;
    numero: number;
    nome: string;
    posti: number;
    status: 'attivo' | 'sospeso' | 'occupato';
}

interface Prenotazione {
    id: string;
    tavoloId: string;
    cliente: string;
    telefono?: string;
    email?: string;
    persone: number;
    data: string;
    orario: string;
    status: 'confermata' | 'annullata';
    totale: number;
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

    // New Booking Modal State
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        cliente: '',
        telefono: '',
        email: '',
        persone: '2',
        data: today,
        orario: '12:00',
        tavoloId: ''
    });
    const [bookingError, setBookingError] = useState('');

    const [detailsModal, setDetailsModal] = useState<Prenotazione | null>(null);

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
                email: p.cliente_email,
                persone: p.numero_persone,
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

    const handleNewBooking = async () => {
        if (!bookingForm.cliente || !bookingForm.tavoloId) {
            setBookingError('Inserisci nome cliente e seleziona un tavolo.');
            return;
        }

        const { error } = await supabase.from('prenotazioni').insert([{
            data: bookingForm.data,
            ora: bookingForm.orario,
            tavolo_id: bookingForm.tavoloId,
            cliente_nome: bookingForm.cliente,
            cliente_email: bookingForm.email,
            cliente_telefono: bookingForm.telefono,
            numero_persone: parseInt(bookingForm.persone),
            stato: 'confermata'
        }]);

        if (error) {
            setBookingError('Errore salvataggio: ' + error.message);
        } else {
            setIsBookingModalOpen(false);
            setBookingForm({
                cliente: '',
                telefono: '',
                email: '',
                persone: '2',
                data: today,
                orario: '12:00',
                tavoloId: ''
            });
            setBookingError('');
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
    const getPrenotazioniForTavolo = (tavoloId: string, date: string) => prenotazioni.filter(p => p.tavoloId === tavoloId && p.data === date);
    const getTotaleForTavolo = (tavoloId: string, date: string) => getPrenotazioniForTavolo(tavoloId, date).filter(p => p.status === 'confermata').reduce((sum, p) => sum + p.totale, 0);

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

                    {/* DAY VIEW - TIMELINE */}
                    {calendarMode === 'giorno' && viewDate && (
                        <div className={styles.formPanel}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 className={styles.formPanelTitle} style={{ margin: 0 }}>
                                    {isToday(viewDate) ? '📅 Prenotazioni di Oggi' : isPast(viewDate) ? `📖 Storico — ${viewDate}` : `📋 Prenotazioni Future — ${viewDate}`}
                                </h3>
                                {(isToday(viewDate) || !isPast(viewDate)) && (
                                    <button
                                        onClick={() => { setBookingForm(prev => ({ ...prev, data: viewDate })); setIsBookingModalOpen(true); }}
                                        style={{
                                            background: 'linear-gradient(135deg, #d4b483, #aa8b56)',
                                            color: '#0a1f1f',
                                            borderRadius: '50px',
                                            padding: '16px 32px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            fontWeight: 700,
                                            border: 'none',
                                            boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Nuova Prenotazione
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.9rem' }}>🪑 <strong>{tavoli.filter(t => t.status === 'attivo').length}</strong> tavoli attivi</span>
                                <span style={{ fontSize: '0.9rem' }}>👥 <strong>{dayPrenotazioni.filter(p => p.status === 'confermata').reduce((s, p) => s + p.persone, 0)}</strong> persone</span>
                            </div>

                            <div style={{ overflowX: 'auto', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-color)' }}>
                                <div style={{ minWidth: '1000px' }}>
                                    {/* Timeline Header */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tavolo</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>
                                            {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'].map(h => <div key={h}>{h}</div>)}
                                        </div>
                                    </div>

                                    {/* Timeline Rows */}
                                    {tavoli.map((t, ti) => {
                                        const tBookings = dayPrenotazioni.filter(p => p.tavoloId === t.id);
                                        return (
                                            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color-light)', padding: '12px 0', minHeight: '60px', position: 'relative' }}>
                                                <div style={{ paddingRight: '12px' }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.nome}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.posti} posti</div>
                                                </div>
                                                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)' }}>
                                                    {/* Vertical Guidelines */}
                                                    {Array.from({ length: 13 }).map((_, i) => (
                                                        <div key={i} style={{ borderLeft: '1px solid rgba(255,255,255,0.03)', height: '100%' }} />
                                                    ))}

                                                    {/* Booking Blocks */}
                                                    {tBookings.map(b => {
                                                        const [hour, min] = b.orario.split(':').map(Number);
                                                        const startMinutes = hour * 60 + min;
                                                        const timelineStart = 12 * 60;
                                                        const timelineEnd = 24 * 60;

                                                        if (startMinutes < timelineStart || startMinutes > timelineEnd) return null;

                                                        const leftPct = ((startMinutes - timelineStart) / (timelineEnd - timelineStart)) * 100;
                                                        const widthPct = (90 / (timelineEnd - timelineStart)) * 100; // 90 min fixed for visual representation

                                                        return (
                                                            <div
                                                                key={b.id}
                                                                onClick={() => setDetailsModal(b)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    left: `${leftPct}%`,
                                                                    width: `${widthPct}%`,
                                                                    minWidth: '100px',
                                                                    height: '42px',
                                                                    background: b.status === 'confermata' ? 'var(--color-primary)' : 'var(--bg-surface)',
                                                                    border: b.status === 'confermata' ? 'none' : '1px dashed var(--border-color)',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    color: b.status === 'confermata' ? 'var(--text-on-primary)' : 'var(--text-muted)',
                                                                    cursor: 'pointer',
                                                                    zIndex: 10,
                                                                    boxShadow: b.status === 'confermata' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                                                                    opacity: b.status === 'confermata' ? 1 : 0.6,
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap',
                                                                    padding: '0 8px',
                                                                    lineHeight: '1.2'
                                                                }}
                                                                title={`${b.cliente} (${b.persone} persone) at ${b.orario}`}
                                                            >
                                                                <div style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{b.cliente}</div>
                                                                <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>👥 {b.persone} persone</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RANGE VIEW */}
                    {calendarMode === 'range' && rangeStart && rangeEnd && (
                        <div className={styles.formPanel}>
                            <h3 className={styles.formPanelTitle}>📊 Prenotazioni Confermate dal {rangeStart} al {rangeEnd}</h3>
                            {rangePrenotazioni.filter(p => p.status === 'confermata').length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center' }}>Nessuna prenotazione confermata nel periodo.</p>
                            ) : (
                                <div className={styles.bookingTimeline}>
                                    {tavoli.map((tavolo, ti) => {
                                        const tavoloBookings = rangePrenotazioni.filter(p => p.tavoloId === tavolo.id && p.status === 'confermata');
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
                                <div className={styles.summaryValue}>{tavoli.filter(t => t.status === 'attivo').length}</div>
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
                                const prenOggi = getPrenotazioniForTavolo(t.id, today).filter(p => p.status === 'confermata');
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
                                                <button className={`${styles.actionBtn} ${t.status === 'attivo' ? styles.actionBtnSuspend : styles.actionBtnPrenotazione}`} onClick={() => toggleSuspend(t.id, t.status)}>
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
                    {/* NEW BOOKING MODAL */}
                    {isBookingModalOpen && (
                        <div className={styles.modal}>
                            <div className={styles.modalOverlay} onClick={() => setIsBookingModalOpen(false)} />
                            <div className={styles.modalContent} style={{ maxWidth: '450px', background: '#0a1f1f', border: 'none', borderRadius: '32px', padding: '40px' }}>
                                <button className={styles.modalClose} onClick={() => setIsBookingModalOpen(false)} style={{ border: 'none', background: 'none' }}>✕</button>
                                <h3 className={styles.modalTitle} style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '24px', fontSize: '1.8rem' }}>Nuova Prenotazione</h3>

                                {bookingError && <div style={{ color: 'var(--color-error)', marginBottom: '16px', fontSize: '0.85rem' }}>{bookingError}</div>}

                                <div style={{ marginBottom: '16px' }}>
                                    <input
                                        type="text"
                                        value={bookingForm.cliente}
                                        onChange={e => setBookingForm({ ...bookingForm, cliente: e.target.value })}
                                        placeholder="Nome Cliente"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <input
                                        type="time"
                                        value={bookingForm.orario}
                                        onChange={e => setBookingForm({ ...bookingForm, orario: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff' }}
                                    />
                                    <input
                                        type="number"
                                        value={bookingForm.persone}
                                        onChange={e => setBookingForm({ ...bookingForm, persone: e.target.value })}
                                        placeholder="Persone"
                                        min="1"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <input
                                        type="email"
                                        value={bookingForm.email}
                                        onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                                        placeholder="Email (Opzionale)"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <input
                                        type="text"
                                        value={bookingForm.telefono}
                                        onChange={e => setBookingForm({ ...bookingForm, telefono: e.target.value })}
                                        placeholder="Telefono (Opzionale)"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <select
                                        value={bookingForm.tavoloId}
                                        onChange={e => setBookingForm({ ...bookingForm, tavoloId: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#fff' }}
                                    >
                                        <option value="" style={{ background: '#0a1f1f' }}>Seleziona Tavolo...</option>
                                        {tavoli.filter(t => t.status === 'attivo').map(t => (
                                            <option key={t.id} value={t.id} style={{ background: '#0a1f1f' }}>{t.nome} ({t.posti} posti)</option>
                                        ))}
                                    </select>
                                </div>

                                <button onClick={handleNewBooking} style={{ width: '100%', background: 'linear-gradient(135deg, #d4b483, #aa8b56)', color: '#0a1f1f', border: 'none', borderRadius: '50px', padding: '18px', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                                    Salva
                                </button>
                            </div>
                        </div>
                    )}

                    {/* BOOKING DETAILS MODAL */}
                    {detailsModal && (
                        <div className={styles.modal}>
                            <div className={styles.modalOverlay} onClick={() => setDetailsModal(null)} />
                            <div className={styles.modalContent} style={{ maxWidth: '400px', background: '#0a1f1f', border: 'none', borderRadius: '32px', padding: '40px' }}>
                                <button className={styles.modalClose} onClick={() => setDetailsModal(null)} style={{ border: 'none', background: 'none' }}>✕</button>
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Dettagli Prenotazione</h4>
                                    <h3 style={{ color: '#fff', fontSize: '2rem', marginBottom: '24px' }}>{detailsModal.cliente}</h3>

                                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', textAlign: 'left', marginBottom: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>👥 Persone</span>
                                            <span style={{ color: '#fff', fontWeight: 600 }}>{detailsModal.persone}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>🕒 Orario</span>
                                            <span style={{ color: '#fff', fontWeight: 600 }}>{detailsModal.orario}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>📅 Data</span>
                                            <span style={{ color: '#fff', fontWeight: 600 }}>{detailsModal.data}</span>
                                        </div>
                                        {detailsModal.telefono && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>📞 Telefono</span>
                                                <span style={{ color: 'var(--color-info)', fontWeight: 600 }}>{detailsModal.telefono}</span>
                                            </div>
                                        )}
                                        {detailsModal.email && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>📧 Email</span>
                                                <span style={{ color: '#fff', fontWeight: 600 }}>{detailsModal.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => { handleStatusChange(detailsModal.id, 'annullata'); setDetailsModal(null); }}
                                            style={{ flex: 1, background: 'rgba(239, 83, 80, 0.1)', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '50px', padding: '12px', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Annulla
                                        </button>
                                        <button
                                            onClick={() => setDetailsModal(null)}
                                            style={{ flex: 1, background: 'var(--color-primary)', color: '#0a1f1f', border: 'none', borderRadius: '50px', padding: '12px', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Chiudi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

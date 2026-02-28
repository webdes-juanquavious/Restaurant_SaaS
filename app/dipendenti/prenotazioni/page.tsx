'use client';

import { useState, useMemo } from 'react';
import styles from '../../admin/admin.module.css';

/* ---- Types ---- */
interface Tavolo {
    id: number;
    nome: string;
    posti: number;
    status: 'active' | 'suspended';
}

interface Prenotazione {
    id: number;
    tavoloId: number;
    data: string;
    orario: string;
    cliente: string;
    telefono: string;
    persone: number;
    totale: number;
    status: 'confermata' | 'annullata_tempo' | 'annullata_manuale';
}

/* ---- Mock Data (Shared with main page) ---- */
const initialTavoli: Tavolo[] = [
    { id: 1, nome: 'Tavolo #1', posti: 4, status: 'active' },
    { id: 2, nome: 'Tavolo #2', posti: 6, status: 'active' },
    { id: 3, nome: 'Tavolo #3', posti: 2, status: 'suspended' },
    { id: 4, nome: 'Tavolo #4', posti: 8, status: 'active' },
    { id: 5, nome: 'Tavolo #5', posti: 4, status: 'active' },
];

const today = new Date().toISOString().split('T')[0];

const mockPrenotazioni: Prenotazione[] = [
    { id: 1, tavoloId: 1, data: today, orario: '12:30', cliente: 'Mario Rossi', persone: 3, totale: 150, status: 'confermata', telefono: '+393331234567' },
    { id: 2, tavoloId: 1, data: today, orario: '20:00', cliente: 'Gianna Blu', persone: 4, totale: 200, status: 'confermata', telefono: '+393339876543' },
    { id: 3, tavoloId: 2, data: today, orario: '13:00', cliente: 'Carlo Neri', persone: 6, totale: 300, status: 'confermata', telefono: '' },
    { id: 4, tavoloId: 4, data: today, orario: '20:30', cliente: 'Sara Bianchi', persone: 4, totale: 120, status: 'annullata_tempo', telefono: '+393334445555' },
    { id: 5, tavoloId: 5, data: today, orario: '21:00', cliente: 'Luca Verdi', persone: 2, totale: 120, status: 'confermata', telefono: '+393332221111' },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }
function formatDate(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }

const colors = ['#e67e22', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#f39c12', '#e84393'];

export default function PrenotazioniPage() {
    const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>(mockPrenotazioni);
    const [tavoli] = useState<Tavolo[]>(initialTavoli);

    // Navigation & View States
    const [calendarMode, setCalendarMode] = useState<'giorno' | 'range'>('giorno');
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<string>(today);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [rangeStart, setRangeStart] = useState<string>('');
    const [rangeEnd, setRangeEnd] = useState<string>('');
    const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
    const [newBooking, setNewBooking] = useState({ tavoloId: 1, cliente: '', telefono: '', persone: 2, orario: '20:00' });

    const isToday = (dateStr: string) => dateStr === today;
    const isPast = (dateStr: string) => dateStr < today;

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
        if (calendarMode === 'giorno') { setSelectedDay(dateStr); }
        else {
            if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(dateStr); setRangeEnd(''); }
            else {
                if (dateStr < rangeStart) { setRangeEnd(rangeStart); setRangeStart(dateStr); }
                else { setRangeEnd(dateStr); }
            }
        }
    };

    const isInRange = (dateStr: string) => (calendarMode === 'range' && rangeStart && rangeEnd && dateStr >= rangeStart && dateStr <= rangeEnd);
    const isSelected = (dateStr: string) => (calendarMode === 'giorno' ? dateStr === selectedDay : dateStr === rangeStart || dateStr === rangeEnd);

    const handleStatusChange = (id: number, status: Prenotazione['status']) => {
        if (confirm(`Modificare stato in "${status}"?`)) {
            setPrenotazioni(prenotazioni.map(p => p.id === id ? { ...p, status } : p));
        }
    };

    const addManualBooking = () => {
        const id = Math.max(...prenotazioni.map(p => p.id)) + 1;
        setPrenotazioni([...prenotazioni, { ...newBooking, id, data: selectedDay, totale: 0, status: 'confermata' } as Prenotazione]);
        setIsReserveModalOpen(false);
        setNewBooking({ tavoloId: 1, cliente: '', telefono: '', persone: 2, orario: '20:00' });
    };

    const dayPrenotazioni = prenotazioni.filter(p => p.data === selectedDay);
    const viewDate = calendarMode === 'giorno' ? selectedDay : '';

    return (
        <div className={styles.adminContent}>
            {/* Header Sezione */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className={styles.pageTitle}>Gestione Prenotazioni</h2>
                    <p className={styles.pageSubtitle}>Visualizza e gestisci il planner del ristorante.</p>
                </div>
            </div>

            {/* Sub-NavBar Specifica */}
            <div className={styles.subNavBar}>
                <div className={`${styles.subNavItem} ${styles.subNavItemActive}`}>Vista Planner</div>
                <div className={styles.subNavItem}>Lista Attesa</div>
                <div className={styles.subNavItem}>Modifica Turni</div>
            </div>

            {/* Popups (Calendar & New Booking) */}
            {isCalendarOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setIsCalendarOpen(false)} />
                    <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
                        <button className={styles.modalClose} onClick={() => setIsCalendarOpen(false)}>×</button>
                        <h3 className={styles.modalTitle}>Seleziona Data</h3>
                        <div style={{ height: '16px' }} />
                        <div className={styles.calendarHeader}>
                            <div className={styles.calendarNav}>
                                <button className={styles.calendarNavBtn} onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); } }}>←</button>
                                <span className={styles.calendarMonthLabel}>{MONTHS[calMonth]} {calYear}</span>
                                <button className={styles.calendarNavBtn} onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); } }}>→</button>
                            </div>
                        </div>
                        <div className={styles.calendarGrid}>
                            {DAYS.map(d => <div key={d} className={styles.calendarDayHeader}>{d}</div>)}
                            {calendarDays.map((day, i) => (
                                <div key={i} className={`${styles.calendarDay} ${!day.currentMonth ? styles.calendarDayOtherMonth : ''} ${day.dateStr === today ? styles.calendarDayToday : ''} ${isSelected(day.dateStr) ? styles.calendarDaySelected : ''} ${isInRange(day.dateStr) ? styles.calendarDayInRange : ''}`} onClick={() => { handleCalendarClick(day.dateStr); if(calendarMode === 'giorno') setIsCalendarOpen(false); }}>
                                    {day.day}
                                    {prenotazioni.some(p => p.data === day.dateStr && p.status === 'confermata') && day.currentMonth && <div className={styles.calendarDayDot} />}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <div className={styles.calendarModeTabs}>
                                <button className={`${styles.calendarModeTab} ${calendarMode === 'giorno' ? styles.calendarModeTabActive : ''}`} onClick={() => setCalendarMode('giorno')}>Giorno</button>
                                <button className={`${styles.calendarModeTab} ${calendarMode === 'range' ? styles.calendarModeTabActive : ''}`} onClick={() => { setCalendarMode('range'); setRangeStart(''); setRangeEnd(''); }}>Da — A</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Day View/Planner */}
            <div className={styles.formPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 className={styles.formPanelTitle} style={{ marginBottom: 0 }}>
                            {isToday(selectedDay) ? '📅 Prenotazioni di Oggi' : isPast(selectedDay) ? `📖 Storico — ${selectedDay}` : `📋 Prenotazioni Future — ${selectedDay}`}
                        </h3>
                        <button className={styles.iconBtn} onClick={() => setIsCalendarOpen(true)}>📅</button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsReserveModalOpen(true)}>+ Nuova Prenotazione</button>
                </div>

                {dayPrenotazioni.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px' }}>Nessuna prenotazione per questa data.</p>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                            <span>🪑 <strong>{new Set(dayPrenotazioni.filter(p=>p.status==='confermata').map(p => p.tavoloId)).size}</strong> tavoli attivi</span>
                            <span>👥 <strong>{dayPrenotazioni.filter(p=>p.status==='confermata').reduce((s, p) => s + p.persone, 0)}</strong> persone</span>
                        </div>

                        {/* Planner Grid (Simplified logic from before) */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                             <div style={{ display: 'flex', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ width: '120px', padding: '10px', fontSize: '0.7rem', fontWeight: 700 }}>TAVOLO</div>
                                <div style={{ flex: 1, display: 'flex' }}>
                                    {Array.from({ length: 13 }).map((_, i) => (
                                        <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', padding: '8px 0' }}>{12+i}:00</div>
                                    ))}
                                </div>
                             </div>
                             {tavoli.filter(t => t.status === 'active').map((tavolo) => (
                                <div key={tavolo.id} style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '60px' }}>
                                    <div style={{ width: '120px', padding: '12px', borderRight: '1px solid var(--border-color)' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{tavolo.nome}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tavolo.posti} posti</div>
                                    </div>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        {dayPrenotazioni.filter(p => p.tavoloId === tavolo.id).map(p => {
                                             const [h, m] = p.orario.split(':').map(Number);
                                             const left = (((h * 60 + m) - (12 * 60)) / (12 * 60)) * 100;
                                             if (left < 0 || left > 100) return null;
                                             return (
                                                <div key={p.id} className={styles.bookingBlock} style={{ position: 'absolute', left: `${left}%`, width: '15%', top: '10px', bottom: '10px', background: p.status === 'confermata' ? colors[p.id % colors.length] : '#444', opacity: p.status === 'confermata' ? 1 : 0.5, padding: '4px', borderRadius: '4px', fontSize: '0.65rem' }}>
                                                    {p.cliente}
                                                </div>
                                             );
                                        })}
                                    </div>
                                </div>
                             ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal Prenotazione (simplified) */}
            {isReserveModalOpen && (
                 <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setIsReserveModalOpen(false)} />
                    <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
                        <h3 className={styles.modalTitle}>Nuova Prenotazione</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <input type="text" placeholder="Nome Cliente" className="form-control" onChange={e => setNewBooking({...newBooking, cliente: e.target.value})} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="time" className="form-control" onChange={e => setNewBooking({...newBooking, orario: e.target.value})} />
                                <input type="number" placeholder="Persone" className="form-control" onChange={e => setNewBooking({...newBooking, persone: parseInt(e.target.value)})} />
                            </div>
                            <button className="btn btn-primary" onClick={addManualBooking}>Salva</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

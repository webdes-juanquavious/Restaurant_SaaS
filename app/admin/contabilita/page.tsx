'use client';

import { useState, useMemo } from 'react';
import styles from '../admin.module.css';

interface OrderItem {
    piatto: string;
    qty: number;
    prezzo: number;
}

interface TavoloData {
    nome: string;
    prenotazioni: number;
    persone: number;
    totale: number;
    ordini: OrderItem[];
}

interface DailyReport {
    data: string;
    totaleGuadagno: number;
    numeroTavoli: number;
    numeroPersone: number;
    tavoli: TavoloData[];
}

/* Mock data — will come from Supabase contabilita table */
const mockReports: DailyReport[] = [
    {
        data: '2026-02-26', totaleGuadagno: 1250.50, numeroTavoli: 8, numeroPersone: 32,
        tavoli: [
            {
                nome: 'Tavolo #1', prenotazioni: 2, persone: 6, totale: 245, ordini: [
                    { piatto: 'Crudo di Mare', qty: 2, prezzo: 36 }, { piatto: 'Spaghetti allo Scoglio', qty: 2, prezzo: 44 },
                    { piatto: 'Branzino al Sale', qty: 1, prezzo: 28 }, { piatto: 'Vino Bianco', qty: 3, prezzo: 15 },
                ]
            },
            {
                nome: 'Tavolo #2', prenotazioni: 1, persone: 4, totale: 180, ordini: [
                    { piatto: 'Risotto ai Frutti di Mare', qty: 2, prezzo: 40 }, { piatto: 'Frittura di Paranza', qty: 2, prezzo: 32 },
                    { piatto: 'Tiramisù Marinaro', qty: 4, prezzo: 32 },
                ]
            },
            {
                nome: 'Tavolo #3', prenotazioni: 1, persone: 2, totale: 92, ordini: [
                    { piatto: 'Linguine all\'Astice', qty: 2, prezzo: 56 }, { piatto: 'Sorbetto al Limone', qty: 2, prezzo: 12 },
                ]
            },
        ],
    },
    {
        data: '2026-02-25', totaleGuadagno: 980, numeroTavoli: 6, numeroPersone: 24,
        tavoli: [
            {
                nome: 'Tavolo #1', prenotazioni: 1, persone: 4, totale: 180, ordini: [
                    { piatto: 'Spaghetti allo Scoglio', qty: 4, prezzo: 88 }, { piatto: 'Vino Bianco', qty: 4, prezzo: 20 },
                ]
            },
            {
                nome: 'Tavolo #4', prenotazioni: 2, persone: 8, totale: 320, ordini: [
                    { piatto: 'Grigliata Mista', qty: 2, prezzo: 64 }, { piatto: 'Branzino al Sale', qty: 2, prezzo: 56 },
                ]
            },
        ],
    },
    {
        data: '2026-02-24', totaleGuadagno: 750, numeroTavoli: 5, numeroPersone: 18,
        tavoli: [
            {
                nome: 'Tavolo #2', prenotazioni: 1, persone: 6, totale: 280, ordini: [
                    { piatto: 'Risotto ai Frutti di Mare', qty: 3, prezzo: 60 }, { piatto: 'Crudo di Mare', qty: 3, prezzo: 54 },
                ]
            },
        ],
    },
];

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px' };

export default function AdminContabilitaPage() {
    const [dateMode, setDateMode] = useState<'giorno' | 'range'>('giorno');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [expandedTavolo, setExpandedTavolo] = useState<string | null>(null);

    const currentReport = mockReports.find(r => r.data === selectedDate);

    /* Range aggregation */
    const rangeData = useMemo(() => {
        if (dateMode !== 'range' || !dateFrom || !dateTo) return null;
        const reports = mockReports.filter(r => r.data >= dateFrom && r.data <= dateTo);
        const totale = reports.reduce((s, r) => s + r.totaleGuadagno, 0);
        const persone = reports.reduce((s, r) => s + r.numeroPersone, 0);
        const tavoli = reports.reduce((s, r) => s + r.numeroTavoli, 0);
        return { reports, totale, persone, tavoli, giorni: reports.length };
    }, [dateMode, dateFrom, dateTo]);

    return (
        <>
            <h2 className={styles.pageTitle}>Contabilità</h2>
            <p className={styles.pageSubtitle}>Report giornaliero o per periodo delle entrate e dettagli per tavolo.</p>

            {/* Date Mode Selector */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div>
                    <div className={styles.calendarModeTabs}>
                        <button className={`${styles.calendarModeTab} ${dateMode === 'giorno' ? styles.calendarModeTabActive : ''}`}
                            onClick={() => setDateMode('giorno')}>Giorno</button>
                        <button className={`${styles.calendarModeTab} ${dateMode === 'range' ? styles.calendarModeTabActive : ''}`}
                            onClick={() => setDateMode('range')}>Da — A</button>
                    </div>
                </div>

                {dateMode === 'giorno' ? (
                    <div>
                        <label style={labelStyle}>Seleziona Data</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ maxWidth: '220px' }} />
                    </div>
                ) : (
                    <>
                        <div>
                            <label style={labelStyle}>Da</label>
                            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                                style={{ maxWidth: '200px' }} />
                        </div>
                        <div>
                            <label style={labelStyle}>A</label>
                            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                                min={dateFrom} style={{ maxWidth: '200px' }} />
                        </div>
                    </>
                )}
            </div>

            {/* ============ SINGLE DAY VIEW ============ */}
            {dateMode === 'giorno' && (
                <>
                    <div className={styles.dashboardGrid}>
                        <div className={styles.statsSquare}>
                            <div className={styles.statsSquareItem}>
                                <div className={styles.statsSquareValue}>€{(currentReport?.totaleGuadagno || 0).toFixed(2)} <span className={styles.statsSquareIcon}>💰</span></div>
                                <div className={styles.statsSquareLabel}>Totale Guadagnato</div>
                            </div>
                            <div className={styles.statsSquareItem}>
                                <div className={styles.statsSquareValue}>{currentReport?.numeroTavoli || 0} <span className={styles.statsSquareIcon}>🪑</span></div>
                                <div className={styles.statsSquareLabel}>Tavoli Serviti</div>
                            </div>
                            <div className={styles.statsSquareItem}>
                                <div className={styles.statsSquareValue}>{currentReport?.numeroPersone || 0} <span className={styles.statsSquareIcon}>👥</span></div>
                                <div className={styles.statsSquareLabel}>Persone Totali</div>
                            </div>
                        </div>

                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            {currentReport ? (
                                <>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Dettaglio per Tavolo</h3>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>Tavolo</th>
                                                <th>Prenotazioni</th>
                                                <th>Persone</th>
                                                <th>Totale</th>
                                                <th>Dettagli</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentReport.tavoli.map((t) => (
                                                <tbody key={t.nome}>
                                                    <tr>
                                                        <td>{t.nome}</td>
                                                        <td>{t.prenotazioni}</td>
                                                        <td>{t.persone}</td>
                                                        <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>€{t.totale.toFixed(2)}</td>
                                                        <td>
                                                            <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                                                                onClick={() => setExpandedTavolo(expandedTavolo === t.nome ? null : t.nome)}>
                                                                {expandedTavolo === t.nome ? 'Chiudi' : 'Vedi Ordini'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedTavolo === t.nome && (
                                                        <tr>
                                                            <td colSpan={5} style={{ background: 'var(--bg-surface-elevated)', padding: '16px 24px' }}>
                                                                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)' }}>Piatto</th>
                                                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)' }}>Quantità</th>
                                                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)' }}>Prezzo</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {t.ordini.map((o, i) => (
                                                                            <tr key={i}>
                                                                                <td style={{ padding: '8px 12px' }}>{o.piatto}</td>
                                                                                <td style={{ padding: '8px 12px' }}>{o.qty}</td>
                                                                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>€{o.prezzo.toFixed(2)}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <div className={styles.formPanel} style={{ textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.95rem' }}>
                                        📊 Nessun dato di contabilità disponibile per il {selectedDate}.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ============ RANGE VIEW ============ */}
            {dateMode === 'range' && (
                <>
                    {rangeData && rangeData.giorni > 0 ? (
                        <div className={styles.dashboardGrid}>
                            <div className={styles.statsSquare}>
                                <div className={styles.statsSquareItem}>
                                    <div className={styles.statsSquareValue}>€{rangeData.totale.toFixed(2)} <span className={styles.statsSquareIcon}>💰</span></div>
                                    <div className={styles.statsSquareLabel}>Totale Periodo</div>
                                </div>
                                <div className={styles.statsSquareItem}>
                                    <div className={styles.statsSquareValue}>{rangeData.giorni} <span className={styles.statsSquareIcon}>📅</span></div>
                                    <div className={styles.statsSquareLabel}>Giorni con Dati</div>
                                </div>
                                <div className={styles.statsSquareItem}>
                                    <div className={styles.statsSquareValue}>{rangeData.persone} <span className={styles.statsSquareIcon}>👥</span></div>
                                    <div className={styles.statsSquareLabel}>Persone Totali</div>
                                </div>
                                <div className={styles.statsSquareItem}>
                                    <div className={styles.statsSquareValue}>€{(rangeData.totale / rangeData.giorni).toFixed(0)} <span className={styles.statsSquareIcon}>📈</span></div>
                                    <div className={styles.statsSquareLabel}>Media Giornaliera</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', overflowX: 'auto' }}>
                                {/* Bar chart: daily revenue */}
                                <div className={styles.formPanel} style={{ margin: 0 }}>
                                    <h3 className={styles.formPanelTitle}>📊 Andamento Giornaliero</h3>
                                    <div className={styles.barChart}>
                                        {rangeData.reports.map((report, i) => {
                                            const maxRevenue = Math.max(...rangeData.reports.map(r => r.totaleGuadagno));
                                            const heightPct = maxRevenue > 0 ? (report.totaleGuadagno / maxRevenue) * 100 : 0;
                                            return (
                                                <div key={i} className={styles.barGroup}>
                                                    <div className={styles.barStack}>
                                                        <div
                                                            className={styles.bar}
                                                            style={{ height: `${heightPct}%`, background: 'var(--color-primary)' }}
                                                            title={`${report.data}: €${report.totaleGuadagno.toFixed(2)}`}
                                                        />
                                                    </div>
                                                    <span className={styles.barLabel}>{report.data.slice(-5)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Per-day breakdown */}
                                {rangeData.reports.map((report) => (
                                    <div key={report.data} className={styles.formPanel} style={{ margin: 0 }}>
                                        <h3 className={styles.formPanelTitle}>
                                            📅 {report.data} — <span style={{ color: 'var(--color-primary)' }}>€{report.totaleGuadagno.toFixed(2)}</span>
                                        </h3>
                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                                            <span>🪑 {report.numeroTavoli} tavoli</span>
                                            <span>👥 {report.numeroPersone} persone</span>
                                        </div>
                                        <table className={styles.dataTable}>
                                            <thead>
                                                <tr>
                                                    <th>Tavolo</th>
                                                    <th>Prenotazioni</th>
                                                    <th>Persone</th>
                                                    <th>Totale</th>
                                                    <th>Dettagli</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {report.tavoli.map((t) => (
                                                    <tbody key={`${report.data}-${t.nome}`}>
                                                        <tr>
                                                            <td>{t.nome}</td>
                                                            <td>{t.prenotazioni}</td>
                                                            <td>{t.persone}</td>
                                                            <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>€{t.totale.toFixed(2)}</td>
                                                            <td>
                                                                <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                                                                    onClick={() => setExpandedTavolo(expandedTavolo === `${report.data}-${t.nome}` ? null : `${report.data}-${t.nome}`)}>
                                                                    {expandedTavolo === `${report.data}-${t.nome}` ? 'Chiudi' : 'Vedi Ordini'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {expandedTavolo === `${report.data}-${t.nome}` && (
                                                            <tr>
                                                                <td colSpan={5} style={{ background: 'var(--bg-surface-elevated)', padding: '16px 24px' }}>
                                                                    <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)' }}>Piatto</th>
                                                                                <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)' }}>Quantità</th>
                                                                                <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)' }}>Prezzo</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {t.ordini.map((o, j) => (
                                                                                <tr key={j}>
                                                                                    <td style={{ padding: '8px 12px' }}>{o.piatto}</td>
                                                                                    <td style={{ padding: '8px 12px' }}>{o.qty}</td>
                                                                                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>€{o.prezzo.toFixed(2)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.formPanel} style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', padding: '24px 0' }}>
                                {!dateFrom || !dateTo
                                    ? '📅 Seleziona un intervallo di date "Da" e "A" per visualizzare i dati.'
                                    : '📊 Nessun dato disponibile per il periodo selezionato.'
                                }
                            </p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

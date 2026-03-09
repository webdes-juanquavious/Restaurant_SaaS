'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase';
import TableHeatmap from '@/components/admin/TableHeatmap';
import SeasonalInsights from '@/components/admin/SeasonalInsights';

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

// Mock data removed in favor of Supabase ordini table

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px' };

export default function AdminContabilitaPage() {
    const [dateMode, setDateMode] = useState<'giorno' | 'range'>('giorno');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [expandedTavolo, setExpandedTavolo] = useState<string | null>(null);
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSubTab, setActiveSubTab] = useState<'contabilita' | 'heatmap'>('contabilita');

    const supabase = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('ordini')
                .select(`
                    *,
                    tavoli (nome)
                `)
                .eq('stato', 'completato');

            if (data) {
                // Group by date
                const grouped: { [key: string]: DailyReport } = {};
                data.forEach(order => {
                    const date = order.created_at.split('T')[0];
                    if (!grouped[date]) {
                        grouped[date] = {
                            data: date,
                            totaleGuadagno: 0,
                            numeroTavoli: 0,
                            numeroPersone: 0,
                            tavoli: []
                        };
                    }
                    grouped[date].totaleGuadagno += order.totale;

                    // Group by table in that day
                    let tavoloEntry = grouped[date].tavoli.find(t => t.nome === order.tavoli.nome);
                    if (!tavoloEntry) {
                        tavoloEntry = {
                            nome: order.tavoli.nome,
                            prenotazioni: 0,
                            persone: 0,
                            totale: 0,
                            ordini: []
                        };
                        grouped[date].tavoli.push(tavoloEntry);
                        grouped[date].numeroTavoli++;
                    }
                    tavoloEntry.prenotazioni++;
                    tavoloEntry.totale += order.totale;

                    // Map items from JSONB
                    const items = (order.piatti as any[]) || [];
                    items.forEach(item => {
                        tavoloEntry!.ordini.push({
                            piatto: item.nome,
                            qty: item.qty || 1,
                            prezzo: item.prezzo
                        });
                    });
                });
                setReports(Object.values(grouped).sort((a, b) => b.data.localeCompare(a.data)));
            }
            if (error) console.error('Error fetching orders:', error);
            setLoading(false);
        };

        fetchOrders();
    }, [supabase]);

    const currentReport = reports.find(r => r.data === selectedDate);

    /* Range aggregation */
    const rangeData = useMemo(() => {
        if (dateMode !== 'range' || !dateFrom || !dateTo) return null;
        const filtered = reports.filter(r => r.data >= dateFrom && r.data <= dateTo);
        const totale = filtered.reduce((s, r) => s + r.totaleGuadagno, 0);
        const persone = filtered.reduce((s, r) => s + r.numeroPersone, 0);
        const tavoli = filtered.reduce((s, r) => s + r.numeroTavoli, 0);
        return { reports: filtered, totale, persone, tavoli, giorni: filtered.length };
    }, [dateMode, dateFrom, dateTo, reports]);

    return (
        <>
            <h2 className={styles.pageTitle}>Contabilità & Analytics</h2>
            <p className={styles.pageSubtitle}>Monitora l'andamento economico e l'occupazione dei tavoli.</p>

            {/* Sub-Tabs Navigation */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                {[
                    { id: 'contabilita', label: 'Contabilità', desc: 'Report giornaliero o per periodo delle entrate e dettagli per tavolo.' },
                    { id: 'heatmap', label: 'Heatmap e Trend', desc: 'Heatmap occupazione tavoli e menu trend' }
                ].map((tab) => (
                    <div
                        key={tab.id}
                        className={`${styles.tabHeaderBox} ${activeSubTab === tab.id ? styles.tabHeaderBoxActive : ''}`}
                        onClick={() => setActiveSubTab(tab.id as any)}
                        style={{
                            flex: 1,
                            cursor: 'pointer',
                            padding: '24px',
                            borderRadius: 'var(--radius-lg)',
                            background: activeSubTab === tab.id ? 'rgba(var(--color-primary-rgb), 0.1)' : 'rgba(255,255,255,0.02)',
                            border: activeSubTab === tab.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <h4 style={{ fontSize: '1.2rem', margin: 0, color: activeSubTab === tab.id ? 'var(--color-primary)' : 'inherit' }}>{tab.label}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{tab.desc}</p>
                    </div>
                ))}
            </div>

            {activeSubTab === 'contabilita' && (
                <>
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
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '100px' }}>
                                        <div className="shimmer" style={{ width: '100%', height: '200px' }} />
                                        <p style={{ marginTop: '20px' }}>Caricamento dati fiscali...</p>
                                    </div>
                                ) : currentReport ? (
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
                                                    <React.Fragment key={t.nome}>
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
                                                    </React.Fragment>
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
                                                            <React.Fragment key={`${report.data}-${t.nome}`}>
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
                                                            </React.Fragment>
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
            )}

            {activeSubTab === 'heatmap' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <TableHeatmap />
                    <SeasonalInsights />
                </div>
            )}
        </>
    );
}

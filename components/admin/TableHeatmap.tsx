'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import styles from './TableHeatmap.module.css';

interface TableOccupancy {
    tavolo_id: string;
    totale_prenotazioni: number;
    percentuale_occupazione: number;
}

export default function TableHeatmap() {
    const [stats, setStats] = useState<TableOccupancy[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('v_occupazione_tavoli')
                .select('*');

            if (data) {
                setStats(data);
            }
            if (error) console.error('Error fetching occupancy stats:', error);
            setLoading(false);
        };

        fetchStats();
    }, [supabase]);

    const getHeatColor = (percentage: number) => {
        // Da verde (0%) a rosso (100%)
        // HSL: 120 (verde) -> 0 (rosso)
        const hue = Math.max(0, 120 - (percentage * 1.2));
        return `hsla(${hue}, 70%, 50%, 0.8)`;
    };

    if (loading) return <div className={styles.loading}>Analisi dati in corso...</div>;

    return (
        <div className={styles.heatmapContainer}>
            <div className={styles.heatmapHeader}>
                <h3 className={styles.heatmapTitle}>Heatmap Occupazione Tavoli</h3>
                <p className={styles.heatmapSubtitle}>Basato sulle prenotazioni degli ultimi 30 giorni</p>
            </div>

            <div className={styles.tableGrid}>
                {stats.map((table) => (
                    <div
                        key={table.tavolo_id}
                        className={styles.tableCard}
                        style={{
                            backgroundColor: getHeatColor(table.percentuale_occupazione),
                            boxShadow: `0 8px 24px -10px ${getHeatColor(table.percentuale_occupazione)}`
                        }}
                    >
                        <span className={styles.tableId}>{table.tavolo_id}</span>
                        <div className={styles.tableInfo}>
                            <span className={styles.percentage}>{table.percentuale_occupazione}%</span>
                            <span className={styles.total}>{table.totale_prenotazioni} prenotazioni</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={styles.colorBox} style={{ backgroundColor: 'hsla(120, 70%, 50%, 0.8)' }} />
                    <span>Bassa (0-30%)</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.colorBox} style={{ backgroundColor: 'hsla(60, 70%, 50%, 0.8)' }} />
                    <span>Media (31-70%)</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.colorBox} style={{ backgroundColor: 'hsla(0, 70%, 50%, 0.8)' }} />
                    <span>Alta (71-100%)</span>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import styles from './SeasonalInsights.module.css';
import Image from 'next/image';

interface DishTrend {
    id: number;
    nome: string;
    categoria: string;
    image_url: string;
    feedback_count: number;
    media_voto: number;
}

export default function SeasonalInsights() {
    const [trends, setTrends] = useState<DishTrend[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchTrends = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('v_trend_piatti')
                .select('*')
                .limit(5);

            if (data) {
                setTrends(data);
            }
            if (error) console.error('Error fetching dish trends:', error);
            setLoading(false);
        };

        fetchTrends();
    }, [supabase]);

    if (loading) return <div className={styles.loading}>Analisi trend in corso...</div>;

    return (
        <div className={styles.insightsContainer}>
            <div className={styles.insightsHeader}>
                <h3 className={styles.insightsTitle}>Insights Stagionali & Trend</h3>
                <p className={styles.insightsSubtitle}>Piatti più amati nell'ultimo mese (basato sui feedback)</p>
            </div>

            <div className={styles.trendsList}>
                {trends.map((item, idx) => (
                    <div key={item.id} className={styles.trendItem}>
                        <div className={styles.rankBadge}>#{idx + 1}</div>
                        <div className={styles.dishImage}>
                            {item.image_url ? (
                                <Image
                                    src={item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`}
                                    alt={item.nome}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className={styles.placeholder}>🍴</div>
                            )}
                        </div>
                        <div className={styles.dishInfo}>
                            <h4 className={styles.dishName}>{item.nome}</h4>
                            <p className={styles.dishCategory}>{item.categoria}</p>
                            <div className={styles.stats}>
                                <span className={styles.rating}>⭐ {item.media_voto.toFixed(1)}</span>
                                <span className={styles.feedback}>{item.feedback_count} recensioni</span>
                            </div>
                        </div>
                        <div className={styles.suggestion}>
                            {item.media_voto > 4.5 ? (
                                <span className={styles.tagHigh}>🔥 Altissima Richiesta</span>
                            ) : (
                                <span className={styles.tagGrowing}>📈 In Crescita</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.businessTip}>
                <div className={styles.tipIcon}>💡</div>
                <div className={styles.tipContent}>
                    <strong>Consiglio Pro:</strong> Visto l'alto gradimento del {trends[0]?.nome || "menù"}, considera di promuoverlo come "Specialità del Mese" sui social o tramite newsletter.
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from '../admin/admin.module.css';
import { createClient } from '@/lib/supabase';

interface Tavolo {
    id: string;
    posti: number;
    status: string;
}

export default function TavoliOperativoPage() {
    const [tavoli, setTavoli] = useState<Tavolo[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchTavoli = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('tavoli').select('*').order('id');
        if (data) setTavoli(data);
        if (error) console.error('Fetch tavoli error:', error);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchTavoli(); }, [fetchTavoli]);

    const toggleStatus = async (t: Tavolo) => {
        const nextStatus = t.status === 'attivo' ? 'occupato' : 'attivo';
        await supabase.from('tavoli').update({ status: nextStatus }).eq('id', t.id);
        fetchTavoli();
    };

    return (
        <div className={styles.adminContent}>
            <div style={{ marginBottom: '32px' }}>
                <h2 className={styles.pageTitle}>Stato Operativo Tavoli</h2>
                <p className={styles.pageSubtitle}>Monitora e gestisci la disponibilità fisica dei tavoli in sala in tempo reale.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Caricamento tavoli...</div>
            ) : (
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Tavolo</th>
                            <th>Capienza</th>
                            <th>Status Attuale</th>
                            <th>Azioni Operative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tavoli.map((t) => (
                            <tr key={t.id}>
                                <td style={{ fontWeight: 700 }}>Tavolo {t.id}</td>
                                <td>{t.posti} persone</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${t.status === 'attivo' ? styles.statusActive : styles.statusSuspended}`}>
                                        {t.status === 'attivo' ? '● Libero' : '● Occupato'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link href="/dipendenti/comande" className="btn btn-sm" style={{ background: 'var(--color-primary)', color: 'white', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.75rem' }}>
                                            + Comanda
                                        </Link>
                                        <button className="btn btn-sm" style={{ background: t.status === 'attivo' ? 'var(--color-error)' : 'var(--color-success)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem' }} onClick={() => toggleStatus(t)}>
                                            {t.status === 'attivo' ? 'Segna Occupato' : 'Libera'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

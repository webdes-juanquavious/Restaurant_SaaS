'use client';

import { useState } from 'react';
import styles from '../admin/admin.module.css';

/* ---- Types ---- */
interface Tavolo {
    id: number;
    nome: string;
    posti: number;
    status: 'active' | 'suspended';
}

const initialTavoli: Tavolo[] = [
    { id: 1, nome: 'Tavolo #1', posti: 4, status: 'active' },
    { id: 2, nome: 'Tavolo #2', posti: 6, status: 'active' },
    { id: 3, nome: 'Tavolo #3', posti: 2, status: 'suspended' },
    { id: 4, nome: 'Tavolo #4', posti: 8, status: 'active' },
    { id: 5, nome: 'Tavolo #5', posti: 4, status: 'active' },
];

export default function TavoliOperativoPage() {
    const [tavoli, setTavoli] = useState<Tavolo[]>(initialTavoli);

    const toggleSuspend = (id: number) => {
        setTavoli(tavoli.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t));
    };

    return (
        <div className={styles.adminContent}>
            <div style={{ marginBottom: '32px' }}>
                <h2 className={styles.pageTitle}>Stato Operativo Tavoli</h2>
                <p className={styles.pageSubtitle}>Monitora e gestisci la disponibilità fisica dei tavoli in sala.</p>
            </div>

            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Tavolo</th>
                        <th>Capienza</th>
                        <th>Corrente Status</th>
                        <th>Azioni Operative</th>
                    </tr>
                </thead>
                <tbody>
                    {tavoli.map((t) => (
                        <tr key={t.id}>
                            <td style={{ fontWeight: 700 }}>{t.nome}</td>
                            <td>{t.posti} persone</td>
                            <td>
                                <span className={`${styles.statusBadge} ${t.status === 'active' ? styles.statusActive : styles.statusSuspended}`}>
                                    {t.status === 'active' ? '● Libero/Attivo' : '● Occupato/Sospeso'}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href="/dipendenti/comande" className="btn btn-sm" style={{ background: 'var(--color-primary)', color: 'white', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.75rem' }}>
                                        + Comanda
                                    </a>
                                    <button className="btn btn-sm" style={{ background: t.status === 'active' ? 'var(--color-error)' : 'var(--color-success)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem' }} onClick={() => toggleSuspend(t.id)}>
                                        {t.status === 'active' ? 'Sospendi' : 'Libera'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

'use client';

import styles from './contatto.module.css';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function ContattoPage() {
    const [info, setInfo] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchInfo = async () => {
            const { data } = await supabase.from('ristorante_info').select('*').single();
            if (data) setInfo(data);
        };
        fetchInfo();
    }, [supabase]);

    // Defaults
    const phoneDisplay = info?.telefono || "+39 06 1234 5678";
    const phoneNum = phoneDisplay.replace(/\D/g, '');
    const address = info?.indirizzo || "Via del Porto 42, 00100 Roma, Italia";

    // Universal maps link
    const mapsLink = info?.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    // WhatsApp direct link
    const waLink = `https://wa.me/${phoneNum}`;

    const renderHours = () => {
        if (!info?.orari) return (
            <>
                Lunedì – Venerdì: 12:00 – 15:00 / 19:00 – 23:00<br />
                Sabato – Domenica: 12:00 – 23:00
            </>
        );
        const o = info.orari;

        const formatDayHours = (dayInfo: any) => {
            if (!dayInfo) return '';
            let str = '';
            if (dayInfo.f1?.ok) str += `${dayInfo.f1.a} - ${dayInfo.f1.c}`;
            if (dayInfo.f2?.ok) {
                if (str) str += ' / ';
                str += `${dayInfo.f2.a} - ${dayInfo.f2.c}`;
            }
            if (!str) return 'Chiuso';
            return str;
        };

        return (
            <>
                Lunedì: {formatDayHours(o.lunedi)}<br />
                Martedì: {formatDayHours(o.martedi)}<br />
                Mercoledì: {formatDayHours(o.mercoledi)}<br />
                Giovedì: {formatDayHours(o.giovedi)}<br />
                Venerdì: {formatDayHours(o.venerdi)}<br />
                Sabato: {formatDayHours(o.sabato)}<br />
                Domenica: {formatDayHours(o.domenica)}
            </>
        );
    };

    return (
        <div className={styles.contattoPage}>
            {/* Header */}
            <div className={styles.contattoHeader}>
                <div className={styles.contattoHeaderIcon}>📬</div>
                <h1 className="section-title">Contattaci</h1>
                <div className="section-divider" />
                <p className="section-subtitle">
                    Hai domande o vuoi saperne di più? Siamo qui per te.
                </p>
            </div>

            <div className={styles.contattoContent}>
                {/* Info Column */}
                <div className={styles.infoColumn}>
                    {/* Restaurant Name */}
                    <div className={`${styles.infoItem} glass-panel`} style={{ padding: '20px', marginBottom: '16px' }}>
                        <div className={styles.infoIcon}>🐟</div>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>{info?.nome || 'Mare Nostrum'}</div>
                            <div className={styles.infoValue}>Ristorante di Pesce</div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className={`${styles.infoItem} glass-panel`} style={{ padding: '20px', marginBottom: '16px', transition: 'transform 0.3s', cursor: 'pointer' }}>
                        <div className={styles.infoIcon}>📍</div>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>Indirizzo (Apri Navigatore)</div>
                            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className={styles.infoLink} style={{ fontWeight: 600 }}>
                                {address}
                            </a>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className={`${styles.infoItem} glass-panel`} style={{ padding: '20px', marginBottom: '16px' }}>
                        <div className={styles.infoIcon}>🕐</div>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>Orari di Apertura</div>
                            <div className={styles.infoValue}>
                                {renderHours()}
                            </div>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className={`${styles.infoItem} glass-panel`} style={{ padding: '20px', marginBottom: '16px' }}>
                        <div className={styles.infoIcon}>📞</div>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>Telefono</div>
                            <a href={`tel:+${phoneNum}`} className={styles.infoLink} style={{ fontWeight: 600, fontSize: '1.2rem' }}>
                                {phoneDisplay}
                            </a>
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className={`${styles.infoItem} glass-panel`} style={{ padding: '20px', marginBottom: '16px', borderLeft: '3px solid #25D366' }}>
                        <div className={styles.infoIcon} style={{ color: '#25D366' }}>💬</div>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>WhatsApp</div>
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.infoLink} style={{ color: '#25D366', fontWeight: 600 }}>
                                Scrivici un messaggio su WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className={`${styles.infoItem} glass-panel`} style={{ padding: '20px' }}>
                        <div className={styles.infoIcon}>🌐</div>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>Seguici sui Social</div>
                            <div className={styles.socialRow}>
                                <a href={info?.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Facebook">f</a>
                                <a href={info?.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">📷</a>
                                <a href={info?.tiktok || "https://tiktok.com"} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="TikTok">🎵</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Column */}
                <div className={styles.mapColumn}>
                    <div className="glass-panel" style={{ padding: '8px', height: '100%' }}>
                        {info?.maps_embed ? (
                            <div dangerouslySetInnerHTML={{ __html: info.maps_embed.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }} style={{ height: '100%' }} />
                        ) : (
                            <iframe
                                className={styles.mapIframe}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.123456789!2d12.4963655!3d41.9027835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDU0JzEwLjAiTiAxMsKwMjknNDYuOSJF!5e0!3m2!1sit!2sit!4v1234567890"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Posizione Mare Nostrum Ristorante"
                                style={{ borderRadius: 'var(--radius-md)' }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

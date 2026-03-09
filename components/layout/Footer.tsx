'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const [info, setInfo] = useState<any>(null);
    const supabase = createClient();
    const pathname = usePathname();

    useEffect(() => {
        const fetchInfo = async () => {
            const { data } = await supabase.from('ristorante_info').select('*').single();
            if (data) setInfo(data);
        };
        fetchInfo();
    }, [supabase, pathname]);

    // Defaults
    const phoneDisplay = info?.telefono || "+39 06 1234 5678";
    const phoneNum = phoneDisplay.replace(/\D/g, '');
    const address = info?.indirizzo || "Via del Porto 42, 00100 Roma, Italia";
    const email = info?.email || "info@marenostrum.it";

    // Universal maps link
    const mapsLink = info?.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    // WhatsApp direct link
    const waLink = `https://wa.me/${phoneNum}`;

    const renderHours = () => {
        if (!info?.orari) return (
            <>
                Lun - Ven: 12:00 - 15:00 / 19:00 - 23:30<br />
                Sab - Dom: 12:00 - 23:30
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
                Lun: {formatDayHours(o.lunedi)}<br />
                Mar: {formatDayHours(o.martedi)}<br />
                Mer: {formatDayHours(o.mercoledi)}<br />
                Gio: {formatDayHours(o.giovedi)}<br />
                Ven: {formatDayHours(o.venerdi)}<br />
                Sab: {formatDayHours(o.sabato)}<br />
                Dom: {formatDayHours(o.domenica)}
            </>
        );
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                {/* Column 1: Restaurant Name & Description */}
                <div className={styles.footerCol}>
                    <div className={styles.restaurantName}>{info?.nome || 'Mare Nostrum'}</div>
                    <div className={styles.restaurantTagline}>Ristorante di Pesce</div>
                    <p className={styles.restaurantDesc}>
                        {info?.descrizione || "La tradizione del mare incontra l'innovazione culinaria."}
                    </p>
                </div>

                {/* Column 2: Address */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Dove Siamo</h4>
                    <a
                        href={mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                        title="Apri nel Navigatore"
                    >
                        <span className={styles.footerLinkIcon} style={{ transition: 'transform 0.3s' }}>📍</span>
                        <span style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>{address}</span>
                    </a>
                </div>

                {/* Column 3: Opening Hours */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Orari</h4>
                    <div className={styles.footerText}>
                        <span className={styles.footerTextIcon}>🕐</span>
                        <div style={{ fontSize: '0.85rem' }}>
                            {renderHours()}
                        </div>
                    </div>
                </div>

                {/* Column 4: Contacts */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Contatti</h4>
                    <a href={`tel:+${phoneNum}`} className={styles.footerLink} title="Chiama Ora">
                        <span className={styles.footerLinkIcon}>📞</span>
                        {phoneDisplay}
                    </a>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                        title="Scrivici su WhatsApp"
                    >
                        <span className={styles.footerLinkIcon} style={{ color: '#25D366' }}>💬</span>
                        WhatsApp
                    </a>
                    <a href={`mailto:${email}`} className={styles.footerLink}>
                        <span className={styles.footerLinkIcon}>✉️</span>
                        {email}
                    </a>
                </div>

                {/* Column 5: Social Media */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Social</h4>
                    <div className={styles.socialLinks}>
                        <a href={info?.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">f</a>
                        <a href={info?.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">📷</a>
                        <a href={info?.tiktok || "https://tiktok.com"} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">🎵</a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className={styles.footerBottom}>
                <span className={styles.footerCopyright}>
                    © {new Date().getFullYear()} {info?.nome || 'Mare Nostrum'} — Tutti i diritti riservati.
                </span>
                <span className={styles.footerCredits}>
                    Made with ❤️ in Italia
                </span>
            </div>
        </footer>
    );
}

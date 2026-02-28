import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    // Intent links
    const phoneNum = "390612345678";
    const address = "Via del Porto 42, 00100 Roma, Italia";
    
    // Universal maps link
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    
    // WhatsApp direct link
    const waLink = `https://wa.me/${phoneNum}`;

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                {/* Column 1: Restaurant Name & Description */}
                <div className={styles.footerCol}>
                    <div className={styles.restaurantName}>Mare Nostrum</div>
                    <div className={styles.restaurantTagline}>Ristorante di Pesce</div>
                    <p className={styles.restaurantDesc}>
                        La tradizione del mare incontra l&apos;innovazione culinaria.
                        Ogni piatto racconta la storia del nostro territorio,
                        con ingredienti freschi selezionati ogni giorno.
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
                        <span style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>Via del Porto 42, 00100 Roma</span>
                    </a>
                    <div className={styles.footerText}>
                        <span className={styles.footerTextIcon}>🚗</span>
                        Parcheggio gratuito disponibile
                    </div>
                </div>

                {/* Column 3: Opening Hours */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Orari</h4>
                    <div className={styles.footerText}>
                        <span className={styles.footerTextIcon}>🕐</span>
                        <div>
                            Lun - Ven: 12:00 - 15:00 / 19:00 - 23:00<br />
                            Sab - Dom: 12:00 - 23:00
                        </div>
                    </div>
                </div>

                {/* Column 4: Contacts */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Contatti</h4>
                    <a href={`tel:+${phoneNum}`} className={styles.footerLink} title="Chiama Ora">
                        <span className={styles.footerLinkIcon}>📞</span>
                        +39 06 1234 5678
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
                    <a href="mailto:info@marenostrum.it" className={styles.footerLink}>
                        <span className={styles.footerLinkIcon}>✉️</span>
                        info@marenostrum.it
                    </a>
                </div>

                {/* Column 5: Social Media */}
                <div className={styles.footerCol}>
                    <h4 className={styles.footerColTitle}>Social</h4>
                    <div className={styles.socialLinks}>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Facebook"
                        >
                            f
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Instagram"
                        >
                            📷
                        </a>
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="TikTok"
                        >
                            🎵
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className={styles.footerBottom}>
                <span className={styles.footerCopyright}>
                    © {new Date().getFullYear()} Mare Nostrum — Tutti i diritti riservati.
                </span>
                <span className={styles.footerCredits}>
                    Made with ❤️ in Italia
                </span>
            </div>
        </footer>
    );
}

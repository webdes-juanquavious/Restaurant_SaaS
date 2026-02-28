'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './menu.module.css';

/* Menu data (will come from Supabase later) */
const menuItems = [
    { id: 1, name: 'Crudo di Mare', category: 'Antipasti', price: 18.00, emojiFallback: '🦐', description: 'Selezione di pesce crudo marinato con agrumi e olio EVO.', descrizioneHome: 'Un antipasto fresco e leggero, ideale per iniziare con il sapore del mare aperto.', allergeni: 'Pesce, Crostacei', mostraInHome: true, tags: ['Gluten-free'] },
    { id: 2, name: 'Carpaccio di Polpo', category: 'Antipasti', price: 14.00, emojiFallback: '🐙', description: 'Polpo cotto a bassa temperatura, con patate e olive.', descrizioneHome: 'Tenerissimo polpo aromatizzato con essenze mediterranee e olio EVO locale.', allergeni: 'Molluschi', mostraInHome: true, tags: ['Gluten-free'] },
    { id: 3, name: 'Bruschetta al Mare', category: 'Antipasti', price: 12.00, emojiFallback: '🍞', description: 'Pane casereccio con tartare di gamberi, avocado e lime.', descrizioneHome: 'Un esplosione di sapori: la croccantezza del pane sposa la dolcezza del gambero.', allergeni: 'Glutine, Crostacei', mostraInHome: true, tags: [] },
    { id: 4, name: 'Spaghetti allo Scoglio', category: 'Primi', price: 22.00, emojiFallback: '🍝', description: 'Spaghetti con cozze, vongole, gamberi e calamari.', descrizioneHome: 'Il classico primo di mare della nostra tradizione locale, con pasta trafilata al bronzo.', allergeni: 'Glutine, Molluschi, Crostacei', mostraInHome: true, tags: [] },
    { id: 5, name: 'Risotto ai Frutti di Mare', category: 'Primi', price: 20.00, emojiFallback: '🍚', description: 'Risotto cremoso con gamberi, cozze e zafferano.', descrizioneHome: 'Dal mare alla tavola, un risotto mantecato a regola d\'arte con un tocco di zafferano.', allergeni: 'Crostacei, Molluschi', mostraInHome: true, tags: ['Gluten-free'] },
    { id: 6, name: 'Linguine all\'Astice', category: 'Primi', price: 28.00, emojiFallback: '🦞', description: 'Linguine fresche con mezzo astice, pomodorini e basilico.', descrizioneHome: 'Piatto d\'eccellenza per gli amanti del vero sapore del mare.', allergeni: 'Glutine, Crostacei', mostraInHome: false, tags: ['Premium'], imageUrl: 'https://images.unsplash.com/photo-1574782092109-17d12f30fc86?auto=format&fit=crop&q=80&w=800' },
    { id: 7, name: 'Branzino al Sale', category: 'Secondi', price: 28.00, emojiFallback: '🐟', description: 'Branzino in crosta di sale marino, con verdure.', descrizioneHome: 'Cotto lentamente nel sale per mantenere intatti tutti i succhi e i sapori delicati.', allergeni: 'Pesce', mostraInHome: false, tags: ['Gluten-free', 'Chef Choice'] },
    { id: 8, name: 'Frittura di Paranza', category: 'Secondi', price: 16.00, emojiFallback: '🦑', description: 'Frittura mista del giorno: calamari, gamberi, alici.', descrizioneHome: 'Croccante, dorata e irresistibile, con pescato freschissimo secondo disponibilità.', allergeni: 'Glutine, Pesce, Molluschi, Crostacei', mostraInHome: false, tags: [] },
    { id: 9, name: 'Grigliata Mista', category: 'Secondi', price: 32.00, emojiFallback: '🔥', description: 'Gamberi, spigola, orate e calamari alla griglia.', descrizioneHome: '', allergeni: 'Pesce, Crostacei, Molluschi', mostraInHome: false, tags: ['Premium'] },
    { id: 10, name: 'Tartare di Tonno', category: 'Secondi', price: 24.00, emojiFallback: '🍣', description: 'Tonno rosso con avocado e salsa teriyaki.', descrizioneHome: '', allergeni: 'Pesce, Soia, Glutine', mostraInHome: false, tags: ['Gluten-free'] },
    { id: 11, name: 'Tiramisù Marinaro', category: 'Dolci', price: 8.00, emojiFallback: '🍰', description: 'Tiramisù con crema al mascarpone e caffè napoletano.', descrizioneHome: '', allergeni: 'Latte, Uova, Glutine', mostraInHome: false, tags: [] },
    { id: 12, name: 'Sorbetto al Limone', category: 'Dolci', price: 6.00, emojiFallback: '🍋', description: 'Sorbetto fresco al limone di Amalfi e menta.', descrizioneHome: '', allergeni: '', mostraInHome: false, tags: ['Vegan', 'Gluten-free'] },
    { id: 13, name: 'Vino Bianco della Casa', category: 'Bevande', price: 5.00, emojiFallback: '🍷', description: 'Vino bianco fresco, ideale con i piatti di pesce.', descrizioneHome: '', allergeni: 'Solfiti', mostraInHome: false, tags: [] },
    { id: 14, name: 'Acqua Naturale / Frizzante', category: 'Bevande', price: 2.50, emojiFallback: '💧', description: 'Acqua minerale in bottiglia da 75cl.', descrizioneHome: '', allergeni: '', mostraInHome: false, tags: [] },
];

const categories = ['Tutti', 'Antipasti', 'Primi', 'Secondi', 'Dolci', 'Bevande'];

/* Ordina online toggle — will come from Supabase impostazioni later */
const ORDINA_ONLINE_ATTIVA = true;

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('Tutti');
    const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);

    const filteredItems = activeCategory === 'Tutti'
        ? menuItems
        : menuItems.filter((item) => item.category === activeCategory);

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const addToCart = (itemId: number) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === itemId);
            if (existing) {
                return prev.map((c) => (c.id === itemId ? { ...c, qty: c.qty + 1 } : c));
            }
            return [...prev, { id: itemId, qty: 1 }];
        });
    };

    return (
        <div className={styles.menuPage}>
            {/* Header */}
            <div className={styles.menuHeader}>
                <div className={styles.menuHeaderIcon}>📜</div>
                <h1 className="section-title">Il Nostro Menu</h1>
                <div className="section-divider" />
                <p className="section-subtitle">
                    Scopri la nostra selezione di piatti preparati con ingredienti freschi del giorno.
                </p>
            </div>

            {/* Category Filter */}
            <div className={styles.categoryFilter}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryBtnActive : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className={styles.menuGrid}>
                {filteredItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>🍽️</div>
                        <p>Nessun piatto trovato in questa categoria.</p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.id} className={styles.menuCard}>
                            <div className={styles.menuCardImageContainer}>
                                {item.imageUrl ? (
                                    <Image 
                                        src={item.imageUrl} 
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 300px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className={styles.menuCardEmojiFallback}>
                                        {item.emojiFallback}
                                    </div>
                                )}
                            </div>
                            <div className={styles.menuCardBody}>
                                <div className={styles.menuCardCategory}>{item.category}</div>
                                <div className={styles.menuCardName}>{item.name}</div>
                                <p className={styles.menuCardDesc}>{item.description}</p>
                                {item.allergeni && <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '4px', fontStyle: 'italic' }}>Allergeni: {item.allergeni}</p>}
                                <div className={styles.menuCardFooter}>
                                    <span className={styles.menuCardPrice}>€{item.price.toFixed(2)}</span>
                                    <div className={styles.menuCardTags}>
                                        {item.tags.map((tag) => (
                                            <span key={tag} className={styles.menuCardTag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                {ORDINA_ONLINE_ATTIVA && (
                                    <button
                                        className={styles.addToCartBtn}
                                        onClick={() => addToCart(item.id)}
                                    >
                                        + Aggiungi al Carrello
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Cart */}
            {ORDINA_ONLINE_ATTIVA && cartCount > 0 && (
                <button className={styles.floatingCart} aria-label="Carrello">
                    🛒
                    <span className={styles.cartBadge}>{cartCount}</span>
                </button>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './menu.module.css';
import { createClient } from '@/lib/supabase';

const categories = ['Tutti', 'Antipasti', 'Primi', 'Secondi', 'Contorni', 'Dolci', 'Bevande'];

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('Tutti');
    const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordinaOnlineAttiva, setOrdinaOnlineAttiva] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('menu')
                .select('*')
                .eq('is_active', true);

            const { data: infoData } = await supabase.from('ristorante_info').select('extra_settings').single();
            if (infoData?.extra_settings) {
                // Ensure we handle both absence of key and explicit false
                const isOnlineActive = infoData.extra_settings.ordinaOnline === true;
                setOrdinaOnlineAttiva(isOnlineActive);
            } else {
                setOrdinaOnlineAttiva(true); // Default to true if no settings found
            }

            if (data) {
                // Map DB snake_case to frontend camelCase
                const mappedData = data.map(item => ({
                    id: item.id,
                    name: item.nome,
                    category: item.categoria,
                    price: item.prezzo,
                    description: item.descrizione,
                    allergeni: item.allergeni,
                    mostraInHome: item.mostra_in_home,
                    tags: item.tags || [],
                    imageUrl: item.image_url,
                    emojiFallback: item.emoji_fallback
                }));
                setMenuItems(mappedData);
            }
            if (error) console.error('Error fetching menu:', error);
            setLoading(false);
        };

        fetchMenu();
    }, [supabase]);

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
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className="shimmer" style={{ height: '300px', borderRadius: '15px' }} />
                        <div className="shimmer" style={{ height: '300px', borderRadius: '15px' }} />
                        <div className="shimmer" style={{ height: '300px', borderRadius: '15px' }} />
                    </div>
                ) : filteredItems.length === 0 ? (
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
                                        src={item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/') ? item.imageUrl : `/${item.imageUrl}`}
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
                                        {item.tags.map((tag: string) => (
                                            <span key={tag} className={styles.menuCardTag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                {ordinaOnlineAttiva && (
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
            {ordinaOnlineAttiva && cartCount > 0 && (
                <button className={styles.floatingCart} aria-label="Carrello">
                    🛒
                    <span className={styles.cartBadge}>{cartCount}</span>
                </button>
            )}
        </div>
    );
}

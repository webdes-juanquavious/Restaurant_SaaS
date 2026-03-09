'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { createClient } from '@/lib/supabase';

export default function HomePage() {
  const [signatureDishes, setSignatureDishes] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSignatureDishes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('mostra_in_home', true)
        .eq('is_active', true)
        .limit(5);

      if (data) {
        const mappedData = data.map(item => ({
          id: item.id,
          name: item.nome,
          badge: item.categoria,
          emoji: item.emoji_fallback,
          imageUrl: item.image_url,
          descrizioneHome: item.descrizione,
          description: item.descrizione,
          allergeni: item.allergeni
        }));
        setSignatureDishes(mappedData);
      }
      if (error) console.error('Error fetching signature dishes:', error);
      setLoading(false);
    };

    fetchSignatureDishes();
  }, [supabase]);

  const activeDish = signatureDishes[activeIndex];

  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    const len = signatureDishes.length;
    if (len === 0) return 0;

    // Normalize diff to be within [-len/2, len/2]
    while (diff > len / 2) diff -= len;
    while (diff <= -len / 2) diff += len;

    return diff;
  };

  // Ref for scroll animations
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // ScrollReveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [loading]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Benvenuti</span>
          <h1 className={styles.heroTitle}>
            Il Sapore del{' '}
            <span className={styles.heroTitleAccent}>Mare</span>
            <br />Sulla Tua Tavola
          </h1>
          <p className={styles.heroSubtitle}>
            Ingredienti freschi, ricette della tradizione e un&apos;atmosfera unica
            dove ogni cena diventa un viaggio attraverso i sapori del Mediterraneo.
          </p>
          <div className={styles.heroActions}>
            <Link href="/prenota" className="btn btn-primary">
              Prenota un Tavolo
            </Link>
            <Link href="/menu" className="btn btn-outline">
              Scopri il Menu
            </Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          Scorri
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ============ PIATTI SIGNATURE ============ */}
      <section className={styles.signatureSection}>
        <div className="container reveal" ref={addToRefs}>
          <h2 className="section-title">In Vetrina</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            I 5 piatti scelti apposta per te dal nostro Chef. Naviga il carosello per scoprire di più.
          </p>
        </div>

        <div className={`${styles.carouselContainer} reveal`} ref={addToRefs}>
          {loading ? (
            <div className={styles.loadingCarousel}>
              <div className="shimmer" style={{ width: '400px', height: '400px', borderRadius: '50%' }} />
            </div>
          ) : signatureDishes.length > 0 && signatureDishes.map((dish, idx) => {
            const offset = getOffset(idx);
            let translateX = 0;
            let scale = 1;
            let zIndex = 0;
            let opacity = 1;
            let blur = '0px';

            if (offset === 0) {
              translateX = 0; scale = 1.15; zIndex = 10; opacity = 1; blur = '0px';
            } else if (Math.abs(offset) === 1) {
              translateX = offset * 140; scale = 0.85; zIndex = 5; opacity = 1; blur = '2px';
            } else if (Math.abs(offset) === 2) {
              translateX = offset * 240; scale = 0.65; zIndex = 1; opacity = 1; blur = '4px';
            }

            return (
              <div
                key={dish.id}
                className={`${styles.carouselItem} ${offset === 0 ? styles.activeCarousel : ''}`}
                style={{
                  '--tx': `${translateX}px`,
                  '--scale': scale,
                  '--zi': zIndex,
                  '--op': opacity,
                  '--blr': blur,
                } as React.CSSProperties}
                onClick={() => setActiveIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(idx)}
              >
                {dish.badge && <span className={styles.carouselBadge}>{dish.badge}</span>}
                {dish.imageUrl ? (
                  <div
                    className={styles.carouselImageWrapper}
                    style={{
                      opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.7 : 0.4,
                      filter: `blur(${blur})`,
                      transition: 'opacity 0.6s ease, filter 0.6s ease'
                    }}
                  >
                    <Image
                      src={dish.imageUrl.startsWith('/') ? dish.imageUrl : `/${dish.imageUrl}`}
                      alt={dish.name}
                      fill
                      sizes="300px"
                      priority={true}
                      className={styles.carouselItemImg}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className={styles.carouselItemEmoji}>{dish.emoji}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Description Panel */}
        <div className={`${styles.dishDescriptionPanel} reveal`} ref={addToRefs}>
          {!loading && activeDish && (
            <div className={`${styles.dishDescriptionInner} glass-panel`} key={activeDish.id}>
              <div className={styles.dishDescriptionContent} style={{ width: '100%', textAlign: 'center' }}>
                <div className={styles.dishDescriptionTitle}>{activeDish.name}</div>
                <p className={styles.dishDescriptionText} style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                  {activeDish.descrizioneHome}
                </p>

                <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
                  <div style={{ flex: 1, minWidth: '200px', textAlign: 'left', background: 'var(--bg-body)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '1px' }}>Ingredienti</h4>
                    <p style={{ fontSize: '0.95rem' }}>{activeDish.description}</p>
                  </div>
                  {activeDish.allergeni && (
                    <div style={{ flex: 1, minWidth: '200px', textAlign: 'left', background: 'var(--bg-body)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                      <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-warning)', marginBottom: '12px', letterSpacing: '1px' }}>Allergeni</h4>
                      <p style={{ fontSize: '0.95rem' }}>{activeDish.allergeni}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ CHEF SECTION ============ */}
      <section className={styles.chefSection}>
        <div className="container reveal" ref={addToRefs}>
          <h2 className="section-title">Lo Chef</h2>
          <div className="section-divider" />
        </div>

        <div className={`${styles.chefGrid} reveal`} ref={addToRefs}>
          <div className={`${styles.chefImageWrapper} animate-float`}>
            <div className={styles.chefImageFrame}>
              <div className={styles.chefImage}>
                <img
                  src="/staff/chef.png"
                  alt="Chef Marco Marinetti"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className={styles.chefDecoration} />
          </div>

          <div className={styles.chefContent}>
            <span className={styles.chefLabel}>Il Nostro Chef</span>
            <h3 className={styles.chefName}>Marco Marinetti</h3>
            <span className={styles.chefTitle}>Chef / Proprietario</span>
            <p className={styles.chefBio}>
              Con oltre 20 anni di esperienza nella cucina di mare, Chef Marco Marinetti
              ha perfezionato l&apos;arte di trasformare il pescato del giorno in esperienze
              gastronomiche indimenticabili. Formatosi nelle migliori cucine del Mediterraneo,
              dal sud della Francia alla Costiera Amalfitana, porta ogni giorno la sua passione
              e creatività in ogni piatto che esce dalla sua cucina.
            </p>
            <p className={styles.chefBio}>
              La sua filosofia è semplice: rispetto assoluto per la materia prima,
              tecniche raffinate e un pizzico di audacia. Ogni piatto è un omaggio al mare
              e al territorio che lo circonda.
            </p>
            <span className={styles.chefSignature}>&ldquo;Il mare non mente mai — la freschezza si sente.&rdquo;</span>
          </div>
        </div>
      </section>


    </>
  );
}

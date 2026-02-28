'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

/* ---- Signature dishes data ---- */
const signatureDishes = [
  {
    id: 1, name: 'Crudo di Mare', badge: 'Signature', emoji: '🦐', imageUrl: '/dishes/crudo.png',
    descrizioneHome: 'Un antipasto fresco e leggero, ideale per iniziare con il sapore del mare aperto.',
    description: 'Selezione di pesce crudo marinato con agrumi e olio EVO.',
    allergeni: 'Pesce, Crostacei',
  },
  {
    id: 2, name: 'Carpaccio di Polpo', badge: 'Antipasti', emoji: '🐙', imageUrl: '/dishes/polpo.png',
    descrizioneHome: 'Tenerissimo polpo aromatizzato con essenze mediterranee e olio EVO locale.',
    description: 'Polpo cotto a bassa temperatura, con patate e olive.',
    allergeni: 'Molluschi',
  },
  {
    id: 3, name: 'Branzino al Sale', badge: 'Novità', emoji: '🐟', imageUrl: '/dishes/branzino.png',
    descrizioneHome: 'Cotto lentamente nel sale marino integrale per mantenere intatti tutti i succhi e i sapori delicati.',
    description: 'Branzino locale pescato all\'alba, servito con verdure al vapore.',
    allergeni: 'Pesce',
  },
  {
    id: 4, name: 'Spaghetti allo Scoglio', badge: 'Best Seller', emoji: '🍝', imageUrl: '/dishes/scoglio.png',
    descrizioneHome: 'Il classico primo di mare della nostra tradizione locale, con pasta trafilata al bronzo.',
    description: 'Spaghetti con cozze, vongole, gamberi e calamari.',
    allergeni: 'Glutine, Molluschi, Crostacei',
  },
  {
    id: 5, name: 'Risotto ai Frutti di Mare', badge: 'Chef Choice', emoji: '🍚', imageUrl: '/dishes/risotto.png',
    descrizioneHome: 'Dal mare alla tavola, un risotto mantecato a regola d\'arte con un tocco di zafferano.',
    description: 'Risotto cremoso con gamberi, cozze e zafferano.',
    allergeni: 'Crostacei, Molluschi',
  },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDish = signatureDishes[activeIndex];

  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > 2) diff -= signatureDishes.length;
    if (diff < -2) diff += signatureDishes.length;
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
  }, []);

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
          {signatureDishes.map((dish, idx) => {
            const offset = getOffset(idx);
            let translateX = 0;
            let scale = 1;
            let zIndex = 0;
            let opacity = 1;
            let blur = '0px';

            if (offset === 0) {
              translateX = 0; scale = 1.15; zIndex = 10; opacity = 1; blur = '0px';
            } else if (offset === -1) {
              translateX = -160; scale = 0.85; zIndex = 5; opacity = 0.6; blur = '2px';
            } else if (offset === 1) {
              translateX = 160; scale = 0.85; zIndex = 5; opacity = 0.6; blur = '2px';
            } else if (offset === -2) {
              translateX = -280; scale = 0.65; zIndex = 1; opacity = 0.3; blur = '4px';
            } else if (offset === 2) {
              translateX = 280; scale = 0.65; zIndex = 1; opacity = 0.3; blur = '4px';
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
                  <div className={styles.carouselImageWrapper}>
                    <Image 
                      src={dish.imageUrl} 
                      alt={dish.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 400px" 
                      priority={offset === 0}
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

      {/* ============ WORK WITH US PREVIEW ============ */}
      <section className={styles.workWithUsPreview}>
        <div className="container reveal" ref={addToRefs} style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="glass-panel" style={{ padding: '60px', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <img 
                src="https://images.unsplash.com/photo-1541532713592-79a0317b628f?auto=format&fit=crop&w=800&q=80" 
                alt="Waiter Service" 
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
              <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem' }}>Lavora con Noi</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Entra a far parte della nostra squadra. Cerchiamo persone appassionate per la sala e la cucina.
                Scopri le posizioni aperte e invia la tua candidatura.
              </p>
              <Link href="/lavora-con-noi" className="btn btn-primary">
                Posizioni Aperte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

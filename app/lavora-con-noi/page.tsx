'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function LavoraConNoiPage() {
  const [offerte, setOfferte] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOfferte = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('offerte_lavoro')
        .select('*')
        .eq('is_attiva', true)
        .order('created_at', { ascending: false });

      if (data) setOfferte(data);
      if (error) console.error('Error fetching job offers:', error);
      setLoading(false);
    };

    fetchOfferte();
  }, [supabase]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Carriere @ Mare Nostrum</span>
          <h1 className="section-title" style={{ marginTop: '16px', fontSize: '3rem' }}>Lavora Con Noi</h1>
          <div className="section-divider" style={{ margin: '24px auto' }} />
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Siamo sempre alla ricerca di talenti appassionati del mare e della buona cucina.
            Entra a far parte di un team dinamico in un ambiente stimolante.
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="shimmer" style={{ width: '100%', height: '200px', borderRadius: '24px', marginBottom: '24px' }} />
            <div className="shimmer" style={{ width: '100%', height: '200px', borderRadius: '24px' }} />
          </div>
        ) : offerte.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '100px 40px', borderRadius: '32px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🌊</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>Al momento non ci sono posizioni aperte</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
              Ma non preoccuparti! Puoi sempre inviarci la tua candidatura spontanea a <a href="mailto:carriere@marenostrum.it" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>carriere@marenostrum.it</a>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {offerte.map((o) => (
              <div
                key={o.id}
                className="glass-panel"
                style={{
                  padding: '32px',
                  borderRadius: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '32px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(233,215,183,0.1)',
                      color: 'var(--color-primary)',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {o.mansione}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {o.tipo_contratto}</span>
                  </div>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#fff' }}>{o.titolo}</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '24px' }}>
                    {o.descrizione}
                  </p>
                  <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span>💰 €{o.stipendio} / {o.tipo_stipendio}</span>
                    <span>📅 Pubblicato il {new Date(o.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <a href={`mailto:carriere@marenostrum.it?subject=Candidatura per ${o.titolo}`} className="btn btn-primary" style={{ padding: '14px 32px' }}>
                    Candidati Ora
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <section style={{ marginTop: '120px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '32px' }}>Perché unirti a noi?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: '🐟', title: 'Materie Prime d\'Eccellenza', desc: 'Lavoriamo solo con il miglior pescato del giorno.' },
              { icon: '👨‍🍳', title: 'Crescita Professionale', desc: 'Investiamo nella formazione continua del nostro staff.' },
              { icon: '🌅', title: 'Location Unica', desc: 'Un ambiente raffinato con vista mozzafiato.' }
            ].map((feature, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--color-primary)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function LavoraConNoiPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#111' }}>
      <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="glass-panel" style={{ padding: '60px', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', background: '#181818', borderRadius: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <img
              src="https://images.unsplash.com/photo-1541532713592-79a0317b628f?auto=format&fit=crop&w=800&q=80"
              alt="Waiter Service"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
            <h1 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', color: '#E9D7B7' }}>Lavora con Noi</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Entra a far parte della nostra squadra. Cerchiamo persone appassionate per la sala e la cucina.
              Scopri le posizioni aperte e invia la tua candidatura.
            </p>
            <Link href="#" className="btn btn-primary">
              Posizioni Aperte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

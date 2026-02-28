-- MARE NOSTRUM INITIAL SCHEMA v7.1

-- 1. PERSONALE
CREATE TABLE IF NOT EXISTS personale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    ruolo TEXT NOT NULL CHECK (ruolo IN ('admin', 'cameriere', 'cuoco', 'cassiere', 'barman', 'pizzaiolo')),
    telefono TEXT,
    status TEXT DEFAULT 'attivo' CHECK (status IN ('attivo', 'malattia', 'ferie')),
    ore_settimanali INTEGER DEFAULT 40
);

-- 2. TAVOLI
CREATE TABLE IF NOT EXISTS tavoli (
    id TEXT PRIMARY KEY, -- es: 'T1', 'T2'
    created_at TIMESTAMPTZ DEFAULT now(),
    posti INTEGER NOT NULL,
    status TEXT DEFAULT 'attivo' CHECK (status IN ('attivo', 'sospeso')),
    posizione_x INTEGER, -- Per mappa 3D
    posizione_y INTEGER
);

-- 3. MENU
CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    prezzo DECIMAL(10,2) NOT NULL,
    descrizione TEXT,
    allergeni TEXT,
    mostra_in_home BOOLEAN DEFAULT false,
    image_url TEXT,
    emoji_fallback TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    menu_type TEXT DEFAULT 'standard' -- 'estate', 'inverno', 'natale', 'happy_hour'
);

-- 4. PRENOTAZIONI
CREATE TABLE IF NOT EXISTS prenotazioni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    data DATE NOT NULL,
    ora TIME NOT NULL,
    tavolo_id TEXT REFERENCES tavoli(id),
    cliente_nome TEXT NOT NULL,
    cliente_email TEXT,
    cliente_telefono TEXT,
    numero_persone INTEGER NOT NULL,
    status TEXT DEFAULT 'confermata' CHECK (status IN ('confermata', 'presente', 'no-show', 'annullata')),
    note TEXT
);

-- 5. OFFERTE (Lavora con noi)
CREATE TABLE IF NOT EXISTS offerte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    titolo TEXT NOT NULL,
    descrizione TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 6. INVENTARIO (Fase 5.3)
CREATE TABLE IF NOT EXISTS inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT UNIQUE NOT NULL,
    quantita DECIMAL(10,2) NOT NULL DEFAULT 0,
    unita_misura TEXT NOT NULL, -- kg, gr, l, unità
    soglia_minima DECIMAL(10,2) NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. RICETTARIO (Fase 5.5)
CREATE TABLE IF NOT EXISTS ricette (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    piatto_id INTEGER REFERENCES menu(id),
    ingrediente_id UUID REFERENCES inventario(id),
    quantita_necessaria DECIMAL(10,2) NOT NULL
);

-- 8. SHOPPING LIST (Fase 5.5)
CREATE TABLE IF NOT EXISTS shopping_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nota TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    author_id UUID REFERENCES personale(id)
);

-- 9. CUSTOMER FEEDBACK (Fase 5.7)
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    tavolo_id TEXT REFERENCES tavoli(id),
    voto INTEGER CHECK (voto >= 1 AND voto <= 5),
    commento TEXT,
    piatto_id INTEGER REFERENCES menu(id)
);

-- 10. ANALYTICS LOGS (Fase 5.1)
CREATE TABLE IF NOT EXISTS analytics_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    evento TEXT NOT NULL, -- 'ordine_piatto', 'occupazione_tavolo'
    target_id TEXT, -- ID del piatto o del tavolo
    metadata JSONB
);

-- Enable RLS
ALTER TABLE personale ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavoli ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE prenotazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerte ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE ricette ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Public Read Menu" ON menu FOR SELECT USING (true);
CREATE POLICY "Public Read Tavoli" ON tavoli FOR SELECT USING (true);
CREATE POLICY "Public Read Offerte" ON offerte FOR SELECT USING (true);

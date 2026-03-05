-- 11. RISTORANTE INFO (Fase 5.4)
CREATE TABLE IF NOT EXISTS ristorante_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nome TEXT NOT NULL DEFAULT 'Mare Nostrum',
    indirizzo TEXT NOT NULL DEFAULT 'Via del Porto 42, 00100 Roma',
    telefono TEXT NOT NULL DEFAULT '+39 06 1234 5678',
    email TEXT NOT NULL DEFAULT 'info@marenostrum.it',
    descrizione TEXT,
    facebook TEXT,
    instagram TEXT,
    tiktok TEXT,
    maps_link TEXT,
    maps_embed TEXT,
    orari JSONB NOT NULL DEFAULT '{
        "lunedi": {"tipo": "pausa-pranzo", "f1": {"a": "12:00", "c": "15:00", "ok": true}, "f2": {"a": "19:00", "c": "23:30", "ok": true}},
        "martedi": {"tipo": "pausa-pranzo", "f1": {"a": "12:00", "c": "15:00", "ok": true}, "f2": {"a": "19:00", "c": "23:30", "ok": true}},
        "mercoledi": {"tipo": "pausa-pranzo", "f1": {"a": "12:00", "c": "15:00", "ok": true}, "f2": {"a": "19:00", "c": "23:30", "ok": true}},
        "giovedi": {"tipo": "pausa-pranzo", "f1": {"a": "12:00", "c": "15:00", "ok": true}, "f2": {"a": "19:00", "c": "23:30", "ok": true}},
        "venerdi": {"tipo": "pausa-pranzo", "f1": {"a": "12:00", "c": "15:00", "ok": true}, "f2": {"a": "19:00", "c": "00:30", "ok": true}},
        "sabato": {"tipo": "pausa-pranzo", "f1": {"a": "12:00", "c": "15:00", "ok": true}, "f2": {"a": "19:00", "c": "01:00", "ok": true}},
        "domenica": {"tipo": "continuato", "f1": {"a": "12:00", "c": "23:00", "ok": true}, "f2": {"a": "", "c": "", "ok": false}}
    }',
    extra_settings JSONB NOT NULL DEFAULT '{
        "durataDefault": 90,
        "penaleNoShow": 15,
        "isPenaleAttiva": true,
        "supplementoExtra": 5,
        "isSupplementoAttivo": true,
        "costoCoperto": 2.50,
        "whatsappPublic": false,
        "lavoraConNoi": true,
        "allowManualDurationOverride": false
    }'
);

-- Enable RLS
ALTER TABLE ristorante_info ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Info" ON ristorante_info FOR SELECT USING (true);
CREATE POLICY "Admin CRUD Info" ON ristorante_info FOR ALL 
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Insert default row if not exists
INSERT INTO ristorante_info (id) VALUES (gen_random_uuid()) 
ON CONFLICT DO NOTHING;

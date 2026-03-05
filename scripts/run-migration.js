const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('ERRORE: Credenziali Supabase mancanti in .env.local')
    process.exit(1)
}

// Extract project ref from URL: https://<ref>.supabase.co
const ref = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1]
if (!ref) {
    console.error('ERRORE: URL Supabase non valido:', supabaseUrl)
    process.exit(1)
}

const sql = `
-- Create ristorante_info table
CREATE TABLE IF NOT EXISTS public.ristorante_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nome TEXT NOT NULL DEFAULT 'Mare Nostrum',
    indirizzo TEXT NOT NULL DEFAULT 'Via del Porto 42, 00100 Roma, Italia',
    telefono TEXT NOT NULL DEFAULT '+39 06 1234 5678',
    email TEXT NOT NULL DEFAULT 'info@marenostrum.it',
    descrizione TEXT DEFAULT 'La tradizione del mare incontra l''innovazione culinaria.',
    facebook TEXT DEFAULT 'https://facebook.com/marenostrum',
    instagram TEXT DEFAULT 'https://instagram.com/marenostrum',
    tiktok TEXT DEFAULT 'https://tiktok.com/@marenostrum',
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
ALTER TABLE public.ristorante_info ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Read Info" ON public.ristorante_info;
DROP POLICY IF EXISTS "Admin CRUD Info" ON public.ristorante_info;

-- Public read (everyone can see restaurant info)
CREATE POLICY "Public Read Info" ON public.ristorante_info
    FOR SELECT USING (true);

-- Service role can do everything (no restriction needed for service_role)
-- Authenticated users with admin role can update
CREATE POLICY "Admin CRUD Info" ON public.ristorante_info
    FOR ALL
    USING (auth.role() = 'service_role' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
    WITH CHECK (auth.role() = 'service_role' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
`

async function runMigration() {
    console.log('🚀 Connessione a Supabase:', supabaseUrl)

    // Use the REST SQL endpoint via fetch
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ sql }),
    })

    // Fallback: use the Supabase management API
    if (!response.ok) {
        console.log('Tentativo con Management API...')
        const mgmtResponse = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({ query: sql }),
        })

        if (!mgmtResponse.ok) {
            const errText = await mgmtResponse.text()
            console.error('Errore Management API:', errText)
            console.log('\n⚠️  NON è possibile eseguire DDL via REST senza Docker o Management token.')
            console.log('👉 Esegui il seguente SQL direttamente nell\'editor SQL di Supabase:')
            console.log('   https://supabase.com/dashboard/project/' + ref + '/sql/new')
            console.log('\n--- INCOLLA QUESTO SQL ---\n')
            console.log(sql)
            return false
        }
        const result = await mgmtResponse.json()
        console.log('✅ Migration eseguita via Management API:', result)
        return true
    }

    const result = await response.json()
    console.log('✅ Migration completata:', result)
    return true
}

async function seedInitialRecord() {
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabase
        .from('ristorante_info')
        .select('id')
        .limit(1)

    if (error) {
        console.error('❌ Errore lettura tabella (esiste?):', error.message)
        return
    }

    if (!data || data.length === 0) {
        const { error: insertError } = await supabase
            .from('ristorante_info')
            .insert([{}])

        if (insertError) {
            console.error('❌ Errore inserimento record iniziale:', insertError.message)
        } else {
            console.log('✅ Record iniziale inserito in ristorante_info!')
        }
    } else {
        console.log('ℹ️  Record già presente, ID:', data[0].id)
    }
}

async function main() {
    const migrated = await runMigration()
    if (migrated) {
        await seedInitialRecord()
    }
}

main().catch(console.error)

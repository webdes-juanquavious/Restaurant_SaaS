const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your-service-role-key') {
  console.error('ERRORE: Devi inserire la SUPABASE_SERVICE_ROLE_KEY nel file .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedDatabase() {
  console.log('🚀 Inizio Seeding Database...')

  // 1. SEED TAVOLI
  const { error: tablesError } = await supabase.from('tavoli').upsert([
    { id: 'T1', posti: 2, status: 'attivo', posizione_x: 10, posizione_y: 10 },
    { id: 'T2', posti: 4, status: 'attivo', posizione_x: 20, posizione_y: 10 },
    { id: 'T3', posti: 4, status: 'attivo', posizione_x: 30, posizione_y: 10 },
    { id: 'T4', posti: 6, status: 'attivo', posizione_x: 10, posizione_y: 20 },
    { id: 'T5', posti: 2, status: 'attivo', posizione_x: 20, posizione_y: 20 },
  ])
  if (tablesError) console.error('Errore Tavoli:', tablesError.message)
  else console.log('✅ Tavoli inseriti.')

  // 2. SEED MENU
  const { error: menuError } = await supabase.from('menu').upsert([
    { nome: 'Crudo di Mare Gourmet', descrizione: 'Selezione del pescato del giorno, ostriche e tartufi di mare.', prezzo: 32.0, categoria: 'Antipasti', image_url: 'crudo_di_mare_gourmet_1772222280602.png', mostra_in_home: true },
    { nome: 'Spaghetti allo Scoglio Premium', descrizione: 'Pasta trafilata al bronzo con frutti di mare freschi e pomodorino ciliegino.', prezzo: 24.0, categoria: 'Primi', image_url: 'spaghetti_allo_scoglio_premium_1772222327442.png', mostra_in_home: true },
    { nome: 'Risotto Zafferano e Frutti di Mare', descrizione: 'Risotto carnaroli mantecato con zafferano puro e crostacei.', prezzo: 26.0, categoria: 'Primi', image_url: 'risotto_zafferano_mare_1772222383502.png', mostra_in_home: true },
    { nome: 'Branzino al Sale', descrizione: 'Cotto in crosta di sale marino, servito con verdure di stagione.', prezzo: 28.0, categoria: 'Secondi', image_url: 'branzino_al_sale_elegant_1772222340786.png', mostra_in_home: true },
    { nome: 'Carpaccio di Polpo Moderno', descrizione: 'Sottili fette di polpo con emulsione al limone e pepe rosa.', prezzo: 20.0, categoria: 'Antipasti', image_url: 'carpaccio_polpo_moderno_1772222415108.png', mostra_in_home: true },
  ])
  if (menuError) console.error('Errore Menu:', menuError.message)
  else console.log('✅ Menu inserito.')

  // 3. SEED PERSONALE (Trigger si occupa del link con Auth, ma qui inseriamo i dettagli extra se necessari)
  // Nota: l'utente admin@mare.it è già stato creato con lo script precedente.
  
  console.log('🏁 Seeding completato!')
}

seedDatabase()

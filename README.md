# Mare Nostrum — Ristorante Gestionale (Next.js + Supabase)

Questo è il repository ufficiale della piattaforma gestionale "Mare Nostrum". Un sistema all-in-one per la gestione di un ristorante di pesce, con area pubblica, dashboard admin e area dipendenti.

## 🚀 Guida Rapida alla Fase 5 (Supabase & Integrazioni)

La Fase 5 segna il passaggio dai dati di test (mock) a un database reale nel cloud. Seguono i passaggi fondamentali per il corretto funzionamento.

### 1. Configurazione Variabili d'Ambiente (.env.local)
Crea un file `.env.local` nella root del progetto e inserisci le tue chiavi di Supabase. **IMPORTANTE**: Questo file non va mai caricato su GitHub!

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-tua-anon-key
SUPABASE_SERVICE_ROLE_KEY=la-tua-service-role-key (usata solo per script di seeding)
```

### 2. Migrazione Database (Supabase SQL)
Prima di avviare l'app, devi creare le tabelle nel tuo database Supabase:
1. Vai su [Supabase Dashboard](https://supabase.com/dashboard) > SQL Editor.
2. Esegui il contenuto di `supabase/migrations/20260228_initial_schema.sql`.
3. Esegui il contenuto di `supabase/migrations/20260228_auth_sync_trigger.sql` per attivare la sincronizzazione automatica degli utenti.
4. **IMPORTANTE**: Esegui il contenuto di `supabase/migrations/20260228_advanced_rls_policies.sql` per sbloccare i permessi di scrittura per lo staff autenticato.

### 3. Creazione Primo Admin
Per creare l'utente iniziale senza passare per le email di conferma, usa lo script di seeding:
```powershell
node scripts/create-admin.js
```
*Le credenziali di default sono: admin@mare.it / PasswordSicura123!*

### 4. Deployment su Vercel (Login Live)
Affinché il login funzioni sul sito online, **devi configurare le Environment Variables su Vercel**:
1. Dashboard Vercel > Settings > Environment Variables.
2. Aggiungi `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Senza queste chiavi, il sito live darà errore "NetworkError" al momento del fetch.

---

## 🛠️ Sviluppo Locale
```bash
npm install
npm run dev
```

## 🏗️ Workflow Git
Seguiamo un approccio local-first:
1. Sviluppa e testa in localhost.
2. Crea un branch per la feature: `git checkout -b feature/nome-feature`.
3. Build di verifica: `npm run build`.
4. Merge in `main` e push finale.

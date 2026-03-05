# SoftwareFunctionality.md

## Sommario
Questo documento descrive in dettaglio tutte le funzionalità implementate e pianificate per la piattaforma gestionale ristorante, come da roadmap e task list aggiornata in `task.md`.

---

## Fase 2 — Core Management (Completata)
### 1. Gestione Personale (/admin)
- Popup Modifica: Modifica di tutti i campi del personale tramite popup.
- Ruoli supportati: Cameriere, Cuoco, Cassiere, Barman, Pizzaiolo.
- Status Malattia: Gestione stato di malattia per ogni dipendente.
- Storico: Visualizzazione grafico a barre CSS e tabella ore lavorate.
- Cambio Password: Popup con doppia verifica per sicurezza.

### 2. Gestione Tavoli (/admin/tavoli)
- Card riepilogativa: Visualizzazione compatta con status indicator (Attivo/Sospeso).
- Popup Modifica: Modifica tavolo e calendario interattivo integrato.

### 3. Gestione Menu (/admin/menu)
- Popup Modifica: Gestione prezzi e varianti dei piatti.

### 4. Contabilità (/admin/contabilita)
- Tabella ordini espandibile.
- Grafico ricavi giornalieri.

---

## Fase 3 — Redesign & Core Infrastructure (Completata)
- Header Smart & Dinamico: RBAC, menu di navigazione dinamico per ruolo.
- Auth UI: Login form premium, gestione sessione mockata.
- Smart Booking & Calendario: Engine di disponibilità tavoli, calendario interattivo.
- Admin Informazioni: Gestione orari apertura, durata pasti, penali no-show, policy overflow.
- Tavoli UX: Vista tabbed tra operativa e configurazione.
- Menu Gourmet: Card piatti con immagini AI, filtri categorie e allergeni.
- Design Uplift: Micro-interazioni GSAP/CSS, glassmorphism.
- Dashboard Dipendenti: Viste dedicate per sala, cucina, cassa.

---

## Fase 4 — UX Arricchita & Funzionalità Operative (Completata)
- Restyling Admin Evoluto: Reportistica avanzata, gestione turni complessi.
- Home Page 3D & AI Assets: Carousel piatti AI, chef portrait AI.
- Lavora con noi: Job portal, toggle annunci, visualizzazione CV.
- Admin Info Evolution: Google Maps embed, staff override.
- Dashboard Dipendenti: Planner prenotazioni, vista Gantt, status real-time, sub-navbar, calendar pop-up.
- Uniformazione & Big Cards: Redesign UI admin, CRUD offerte lavoro.
- Performance Optimization: next/image, asset audit, wrapper immagini performanti.

---

## Fase 5 — Integrations & Supabase Persistence (In Corso)
### Infrastructure Setup
- Progetto Supabase, configurazione `.env.local`, repo GitHub, prima push.

### Database Migration (Supabase/Postgres)
- Creazione schema: personale, tavoli, menu, prenotazioni, offerte.
- Implementazione Row Level Security (RLS) per permessi Admin/Staff.

### Auth Real Life
- Migrazione da login mock a Supabase Auth.
- Middleware di protezione rotte server-side.

### Google Calendar Sync
- Configurazione Google Cloud Console & API Calendars.
- Sincronizzazione automatica prenotazioni confermate.

### Blocco 5.1: Predictive Analytics
- Seasonal Insights: Analisi piatti più richiesti per periodo.
- Heatmap Tavoli: Mappa visiva tavoli più frequentati (ultimi 30 giorni).
- Revenue Trends: Dashboard predittiva ricavi, analisi feedback clienti, suggerimenti business.

### Blocco 5.2: Logica a Menu Multipli
- Time-Based Menus: Cambio automatico menu (pranzo, cena, happy hour).
- Seasonal/Occasion Menus: Gestione menu stagionali/eventi.
- Switch Admin: Pannello attivazione manuale/programmazione menu.

### Blocco 5.3: Stock-Inventory Monitoring
- LowStock Alert!: Notifica automatica in cucina per stock basso.
- Inventory Overview: Vista soglia/rimanenza per rifornimento.

### Blocco 5.4: Mansione Cucina (Role Deep-Dive)
- UI Kitchen Focus: Interfaccia dedicata staff cucina.
- Livelli di Autorità: Permessi specifici Admin/Cuoco/Cameriere.

### Blocco 5.5: Fridge & Stock Inventory (Advanced)
- Virtual Fridge: Pannello real-time giacenza ingredienti.
- Shopping List Digitale: Bacheca spesa su Supabase.
- Ricettario & Food Cost: Database ingredienti, calcolo guadagno/costo piatto.
- Calcola Spesa: Generazione automatica lista spesa da menu.

### Blocco 5.6: Kitchen Performance Analytics
- Monitoring tempi preparazione e bottleneck.

### Blocco 5.7: Immediate Feedback Loop
- Sondaggio anonimo cliente per tavolo/orario su gradimento piatti.

---

## Fase 6 — CI/CD & Deployment su Vercel (Prossima)
- CI/CD Pipeline: GitHub Actions per linting/build/test.
- Vercel Cloud Setup: Collegamento repo, env vars produzione.
- Online Verification: Deployment URL, SSL, performance live.
- Stripe & QR Payments: Pagamenti online, Apple/Google Pay, toggle admin QR.
- Deployment Simulator: Simulazione funzioni reali, demo mode.

---

## Fasi Future (7+)
- Data Analysis & Marketing: SEO, asset CDN, BI dashboard, automazioni n8n, notifiche Telegram/Slack.
- Final Review & Launch: Code review, UAT.
- PWA & Offline: Raspberry Pi server, captive portal, offline resilience.
- Dynamic Client Manager: QR login, smart ordering, order tracking, digital checkout, waiter call.
- Smart Table Interaction: Prenotazione tavoli 3D, IoT light, AR menu, blockchain affiliazione.

---

## Note
- Ogni funzionalità è descritta secondo lo stato di avanzamento e la granularità presente in `task.md`.
- Per dettagli implementativi, consultare anche i file PDR.md e PdP.md.

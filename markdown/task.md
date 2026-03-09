# Task List — v4.1 Roadmap Integrale & Deployment
## Stato Generale: 🚀 Dev server attivo su: http://localhost:3000

## Fase v2 — Core Management (Completata)
### 1. Gestione Personale (/admin)
- [x] Popup Modifica funzionante — tutti i campi editabili
- [x] 5 ruoli: Cameriere, Cuoco, Cassiere, Barman, Pizzaiolo
- [x] Status Malattia aggiunto
- [x] Popup Storico — grafico a barre CSS + tabella ore
- [x] Popup Cambio Password — doppia verifica
### 2. Gestione Tavoli (/admin/tavoli)
- [x] Card riepilogativa compatta e status indicator (Attivo/Sospeso)
- [x] Popup Modifica tavolo e Calendario interattivo integrato
### 3. Gestione Menu (/admin/menu)
- [x] Popup Modifica con gestione prezzi e varianti
### 4. Contabilità (/admin/contabilita)
- [x] Tabella ordini espandibile e Grafico ricavi giornalieri

## Fase 3 — Redesign & Core Infrastructure (Completata)
- [x] **Blocco 1: Header Smart & Dinamico**
 -- RBAC (Role Based Access Control): Menu di navigazione che cambia in base al ruolo (Admin/Staff/Public)
 -- Auth UI: Implementazione login form premium e gestione sessione mockata
- [x] **Blocco 2: Smart Booking & Calendario**
 -- Engine di Disponibilità: Logica per calcolare tavoli liberi in base all'orario
 -- Calendar Widget: Integrazione calendario interattivo per selezione data prenotazione
- [x] **Blocco 3: Admin Informazioni (Setup Parametrico)**
 -- Configurazione Business: Gestione orari apertura, durata media pasti, penali no-show
 -- Policy Management: Toggle per regole di overflow e prenotazioni last-minute
- [x] **Blocco 4: Tavoli UX (Vista Tabbed)**
 -- Interfaccia Duale: Separazione netta tra vista "Operativa" (Prenotazioni oggi) e "Configurazione" (Lista Tavoli)
- [x] **Blocco 5: Menu Gourmet / Public Identity**
 -- Visual Identity: Card piatti con immagini premium AI
 -- Dynamic Filter: Filtri per categorie e icone allergeni
- [x] **Blocco 6: Design Uplift Hero**
 -- Micro-interazioni: Animazioni GSAP/CSS su scroll e hover
 -- Glassmorphism: Header e Card trasparenti con blur evoluto
- [x] **Blocco 7: Dashboard Dipendenti (Semplificazione)**
 -- Focus Operativo: Viste dedicate Sala, Cucina e Cassa con layout ad alta leggibilità

## Fase 4 — UX Arricchita & Funzionalità Operative (Completata)
- [x] **Blocco 8/10: Restyling Admin Evoluto**(Contabilità, Menu, Orari Turni Complessi)
 -- Financial Insight: Reportistica avanzata su scontrino medio e occupazione tavoli
 -- Gestione Turni Complessi: Setup orari differenziati Festivi/Feriali
- [x] **Blocco 11: Home Page 3D & AI Assets**
 -- Carousel Signature Dishes: Slider interattivo con piatti generati via AI (generate_image)
 -- Chef Portrait AI: Immagine dello Chef integrata con biografia dinamica
- [x] **Blocco 12: Funzionalità "Lavora con noi"**
 -- Job Portal: Sezione per la pubblicazione di posizioni aperte
 -- Toggle Gestione: Tab admin per attivare/disattivare gli annunci e visualizzare i CV (placeholder)
- [x] **Blocco 13: Admin Info Evolution (Maps & Override)**
 -- Google Maps Sync: Inserimento Link e Iframe Embed per localizzazione
 -- Staff Override: Toggle per permettere allo staff di forzare parametri (es: durata cena) in fase di inserimento
- [x] **Blocco 14: Dashboard Dipendenti** — Planner Prenotazioni
 -- Vista Gantt (Planner): Visualizzazione orizzontale del tempo (12:00 - 00:00) raggruppata per tavolo
 -- Status Real-time: Blocchi colorati per prenotazioni Confermate, No-show e In corso
 -- Sub-NavBar Prenotazioni: Navigazione dedicata (Planner, Lista Attesa, Modifica Turni)
 -- Calendar Pop-up: Selezione data fluida tramite modale modale, ottimizzando lo spazio verticale
- [x] **Blocco 15: Uniformazione & Big Cards Toggle**
 -- Admin Tables Redesign: Sostituzione tabbed UI con grandi Card cliccabili (Gestione Prenotazioni vs Gestione Tavoli)
 -- Logic CRUD Offerte Full: Implementazione salvataggio ed eliminazione annunci "Lavora con noi"
- [x] **Blocco 16: Performance Optimization & Next-Gen Assets**
 -- Image Optimization: Implementazione `next/image` per caricamento pigro e compressione automatica.
 -- Asset Audit: Conversione logica e CSS per gestire wrapper immagini performanti.

## Fase 5 — Integrations & Supabase Persistence (In Corso)
- [x] **Infrastructure Setup**
    - [x] Creazione Progetto Supabase e Configurazione `.env.local`
    - [x] Inizializzazione Git Repository (GitHub) & Prima Push
- [x] **Database Migration (Supabase/Postgres)**
    - [x] Creazione Schema: `personale`, `tavoli`, `menu`, `prenotazioni`, `offerte`
    - [x] Implementazione Row Level Security (RLS) per permessi Admin/Staff
- [x] **Full Data Sync**: Sincronizzazione Home, Menu, Staff, Tavoli, Prenotazioni e Contabilità.
- [x] **Auth Real Life**
    - [x] Migrazione da Mock Login a Supabase Auth
    - [x] Middleware di protezione rotte server-side
- [x] **Job Offers Management**
    - [x] Creazione schema `offerte_lavoro`
    - [x] Implementazione CRUD completo per offerte di lavoro
    - [x] Integrazione con pagina pubblica `lavora-con-noi`
    - [x] Gestione attivazione/disattivazione offerte
    - [x] Fetch active job offers from Supabase
    - [x] Design a premium UI for potential candidates
- [ ] **Google Calendar Sync**
    - [ ] Configurazione Google Cloud Console & API Calendars
    - [ ] Sincronizzazione automatica prenotazioni confermate su Calendario Ristorante
- [ ] **Full Database-Visualization Sync**
    - [ ] Sincronizzare tutte le informazioni in tutte le pagine in accordo con il database.
- [ ] **Blocco 5.1: Predictive Analytics**
    - [ ] Seasonal Insights: Analisi piatti più richiesti in base al periodo (es. Zuppe vs Crudi).
    - [ ] Heatmap Tavoli: Identificazione tavoli preferiti (luce, posizione, atmosfera). Una mappa visiva della sala che mostra quali tavoli sono più "caldi" (frequentati) in base alle prenotazioni degli ultimi 30 giorni.
    - [ ] Revenue Trends: Dashboard predittiva sui ricavi futuri basata sui trend. Un pannello che analizza i feedback dei clienti per segnalarti i piatti più amati del momento e darti consigli di business.
- [ ] **Blocco 5.2: Logica a Menu Multipli**
    - [ ] Time-Based Menus: Cambio automatico tra Pranzo, Cena e Happy Hour.
    - [ ] Seasonal/Occasion Menus: Gestione menu Estate/Inverno o Eventi Speciali (Natale).
    - [ ] Switch Admin: Pannello per l'attivazione manuale o programmata dei menu.
- [ ] **Blocco 5.3: Stock-Inventory Monitoring**
    - [ ] LowStock alert!: Notifica automatica in cucina quando uno stock scende sotto soglia.
    - [ ] Inventory Overview: Vista dettagliata soglia vs rimanenza per rifornimento.
- [ ] **Blocco 5.4: Mansione Cucina (Role Deep-Dive)**
    - [ ] UI Kitchen Focus: Interfaccia dedicata allo staff di cucina (senza bloat operativo di sala).
    - [ ] Livelli di Autorità: Definizione permessi specifici Admin vs Cuoco vs Cameriere.
- [ ] **Blocco 5.5: Fridge & Stock Inventory (Advanced)**
    - [ ] Virtual Fridge: Pannello real-time per l'inserimento e la visualizzazione della giacenza fisica.
    - [ ] Shopping List Digitale: Bacheca virtuale per note spesa salvata su Supabase.
    - [ ] Ricettario & Food Cost: Database ingredienti con pesi e prezzi. Calcolo automatico guadagno/costo piatto.
    - [ ] Calcola Spesa: Selezione piatti menu per generare la "busta della spesa" raggruppata.
- [ ] **Blocco 5.6: Kitchen Performance Analytics (Monitoring tempi preparazione e bottleneck).**
- [ ] **Blocco 5.7: Immediate Feedback Loop (Sondaggio anonimo cliente per tavolo/ora su gradimento piatti).**

## Fase 6 — CI/CD & Deployment su Vercel (Prossima)
- [ ] **CI/CD Pipeline**
    - [ ] Setup GitHub Actions (Linting, Build test su ogni Push)
- [ ] **Vercel Cloud Setup**
    - [ ] Collegamento Repository a Vercel Dashboard
    - [ ] Configurazione Environment Variables di produzione (Supabase, Google)
- [ ] **Online Verification**
    - [ ] Deployment URL di produzione e SSL Check
    - [ ] Verifica performance Live (Core Web Vitals)
- [ ] **Stripe & QR Payments**
    - [ ] Stripe Integration: Pieno supporto ai pagamenti degli ordini online.
    - [ ] Pagamento QR al Tavolo: Integrazione Apple Pay e Google Pay per chi siede al ristorante.
    - [ ] Admin Control: Toggle switch per abilitare/disabilitare i pagamenti digitali via codice QR al tavolo.
- [ ] **Blocco 6.2: Deployment Simulator (Sales Tool)**
    - [ ] Admin/Cameriere/Cucina Simulator: Accesso a tutte le funzioni reali.
    - [ ] Non-Persistence Logic: Modifiche (prezzi, tavoli) solo locali/temporanee.
    - [ ] Demo Mode Tag: Badge visivo che indica la modalità simulazione.

## Fase 7 — Data Analysis & Marketing Strategy (Pianificata)
- [ ] **Content & SEO Specialist**
    - [ ] Ottimizzazione Meta Tags, OpenGraph e Meta-data SEO specialisti
    - [ ] Asset Optimization: Ottimizzazione immagini su CDN (Supabase Storage)

## Fase 8 — BI & n8n Automation (Pianificata)
- [ ] **BI Dashboard (n8n Integration)**
    - [ ] Flow n8n per export contabilità su Google Sheets ogni notte
    - [ ] Notifiche Telegram/Slack per nuove candidature o prenotazioni over-size

## Fase 9 — Final Review & Launch (Pianificata)
- [ ] **Final Code Review & Refactoring**
- [ ] **User Acceptance Testing (UAT)**: Validazione totale con il cliente

## Fase 10: PWA with Offline Localhost (Local Deployment)
- [ ] **Raspberry Pi Server**: Hosting della webapp su server locale per operatività senza internet.
- [ ] **Private WiFi Captive Portal**: Accesso automatico alla webapp al collegamento WiFi.
- [ ] **Offline Resilience**: Service worker per caching menu e dati critici.

## Fase 11: Dynamic Client Manager (QR Experience)
- [ ] **Auto-Login via QR**: Ogni tavolo ha un codice QR univoco che logga il cliente al suo tavolo.
- [ ] **Smart Ordering**: Aggiunta piatti alla comanda (Policy: Ordered = Done).
- [ ] **Order Tracking**: Visualizzazione stato preparazione (In cucina/In arrivo).
- [ ] **Digital Checkout**: Pagamento autonomo dal tavolo tramite smartphone.
- [ ] **Waiter Call**: Pulsante richiesta assistenza fisica.

## Fase 12: Smart Table Interaction
- [ ] **Blocco 12.1: Prenotazione Tavoli 3D Interattiva**
    - [ ] Three.js Engine: Sviluppo mappa 3D navigabile del ristorante.
    - [ ] Virtual Tour Selection: Selezione del "posto perfetto" (es. Vista mare, Vicino Acquario).
    - [ ] Wow Factor: Integrazione materiali e luci fotorealistiche nel browser.
- [ ] **Blocco 12.2: Smart Table IoT Light**: Feedback visivo al tavolo per ordini/assistenza.
- [ ] **Blocco 12.3: AR Menu**: Visualizzazione piatti in Realtà Aumentata sul tavolo.
- [ ] **Blocco 12.4: Blockchain QR Affiliazione**: Concept di fedeltà digitale
    
## Governance & Strategia (Completata)
- [x] Generazione Bibbia Tecnica (AWGM, PdP, PDR, Project Manager/Planner)
- [x] Mantenimento Standard di Qualità Estetica Alta (Premium Design)
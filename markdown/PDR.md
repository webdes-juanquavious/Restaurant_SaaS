# Product Requirements Document (PDR) - Piattaforma Gestionale Ristorante

## 1. Panoramica del Prodotto
**Nome Progetto**: Piattaforma Gestionale "Mare Nostrum"
**Scopo**: Sviluppare una web application all-in-one per la gestione completa di un ristorante di pesce. Il software deve fornire un'interfaccia pubblica accattivante per i clienti (prenotazioni, menu) e un robusto sistema di back-office diviso per ruoli (Admin e Dipendenti) per gestire tavoli, comande, contabilità, personale e recruiting.

## 2. Architettura e Stack Tecnologico
- **Framework Frontend/Backend**: Next.js 16 (App Router)
- **Linguaggio**: TypeScript
- **Stilizzazione**: CSS Modules (Vanilla CSS) con sistema di Theming (4 temi CSS predefiniti) e utility classes (es. `.glass-panel`).
- **Data Layer (Fase Attuale/Mock)**: Dati salvati in memoria (stato React / costanti).
- **Data Layer (Fase Futura)**: Supabase (PostgreSQL + Auth) per la persistenza dei dati.
- **Integrazioni Future**: Stripe (Pagamenti), n8n (Automazioni Webhook), Google Calendar.

## 3. Gestione Utenti e Ruoli
Il sistema supporta 3 tipologie di utenze:
1. **Utente Pubblico (Non Autenticato)**: Può visualizzare la Home, il Menu testuale/fotografico, le informazioni di Contatto, il modulo "Prenota" (con visualizzazione dinamica dell'occupazione cromatica del locale) e la sezione "Lavora con noi" (se abilitata).
2. **Dipendente (Autenticato)**: Ha accesso limitato alla Dashboard. 
    - **Tavoli/Prenotazioni**: Modifica lo stato delle prenotazioni o dei tavoli ma non può creare o eliminare fisicamente i tavoli dal database.
    - **Comande**: Invia ordini in cucina divisi per stato (in coda, in preparazione, pronta, consegnata).
    - **Contabilità**: Può solo gestire "il conto" locale del tavolo ed emettere pagamenti divisi (conto unico/separato).
3. **Amministratore (Autenticato)**: Accesso root a tutto il sistema.
    - Gestione Personale (Orari, ferie, status) e Job Offers ("Lavora con Noi").
    - Gestione della Piantina (Aggiunta/Rimozione Tavoli fisici).
    - Gestione del Menu (Modifica dei piatti con URL Immagine o Emoji di Fallback).
    - Statistiche avanzate di contabilità.
    - Setup delle impostazioni globali (Orari doppio turno, Tempi di prenotazione, Costi coperto, ecc.).

## 4. Specifiche delle Funzionalità (Feature List)

### 4.1 Frontend Pubblico
- **Home Page**: Hero interattivo, slider piatti signature sincronizzato con il database (solo i piatti scelti dall'admin), e introduzione.
- **Prenota (Smart Booking)**: 
  - L'utente seleziona Data, Orario e num. Persone.
  - Il sistema calcola *live* la percentuale di occupazione del locale interpolando i tavoli disponibili. Presenta orari con colore verde, giallo, rosso o disabilitati se in overbooking.
- **Menu**: Menu diviso a categorie, con possibilità di fallback emoji se l'URL dell'immagine del DB è vuoto.
- **Lavora con Noi**:
  - Visibile solo se abilitato dall'Admin.
  - Presenta Job Offers attive.
  - CTA di candidatura tramite Telefono/WhatsApp intent link o tramite Modale/Form (Nome, numero, email opzionale, link a CV).

### 4.2 Backend (Admin & Dipendenti)
- **Dynamic Header Navbar**: Il menu della NavBar muta contestualmente: menu pubblico, menu `Admin` o menu `Dipendenti`.

#### Modulo: Personale e Lavoro
- **Staff List**: Lista dipendenti (creazione, modifica ruolo, stato di servizio, visualizzazione vacanze 7/30).
- **Storico**: Grafici CSS-based per gli orari lavorati.
- **Gestione Job Offers (Lavora con noi)**: Tab separate per la stesura degli annunci. 
  - **Mansioni supportate**: Sala, Cucina, Cassa, Pizzeria, Entrata, Cabaret.
  - **Tipologie Contratto**: Stagionale, Full-Time, Part-Time, Remoto, Ad Ora.
  - **Dati**: Data Pubblicazione, Titolo, Stipendio e Frequenza (/mese, /settimana, /anno, /ora), Descrizione.

#### Modulo: Tavoli
- **Visualizzazione Tabbed**: "Gestisci Prenotazioni" vs "Gestione Tavoli".
- Stato Prenotazione: attiva, completata, annullata_tempo, annullata_manuale.
- Collegamento rapido alla Comanda del tavolo e al suo flusso di Pagamento.

#### Modulo: Contabilità e Comande
- **Comande Flow**: Selezione piatto dal Menu -> Assegnazione a Tavolo -> Status (`in_coda` -> `in_preparazione` -> `consegnato`).
- **Cassiere/Conto**: Divisione alla romana (Conto Unico) o Divisione specifica per coperto/piatti (Conto separato).

#### Modulo: Impostazioni & Info (Admin Root)
- **Turni Orari**: Configurazione giornaliera dello stato locale con 3 set: *Chiuso, Pausa Pranzo, Continuato*. I giorni "Pausa Pranzo" sbloccano input differenziati per Servizio Pranzo e Servizio Cena, attivabili separatamente.
- **Policy**: Gestione costo extra durata tavolo, tempo tolleranza "No-Show" (default 15 minuti), toggle WhatsApp CTA per il front-end.
- **Lavora con noi Toggle**: Mostra/Nasconde la pagina Job Offers al pubblico.

## 5. Deployment e Infrastruttura
- Il sistema viene gestito via npm e richiede il building a SSG o Server-Rendered tramite Edge/Node (Turbopack in dev).
- Comandi base:
  - `npm run dev`: Ambiente di sviluppo su port 3000.
  - `npm run build`: Pipeline di check sintattico e ottimizzazione.
  - `npm run start`: Esecuzione bundle produzione in locale.

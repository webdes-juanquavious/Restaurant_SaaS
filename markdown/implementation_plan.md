# Implementazione Plan — Bibbia Tecnica v3.8 ("Mare Nostrum")

## Fase 4 — UX/UI e Funzionalità Avanzate [In Corso]

### Blocco 9: Admin Menu — Dettagli e Vetrina
- **Status**: [x] Completato
- **Note**: Aggiunti campi `descrizioneHome`, `allergeni`. Implementato toggle `mostraInHome`.
- **Integrazione**: I piatti flaggati alimentano automaticamente il Carousel 3D della Home Page.

### Blocco 10: Admin Orari — Gestione Doppio Turno
- **Status**: [x] Completato
- **Dettaglio**: Ogni giorno supporta `chiuso` | `pausa-pranzo` | `continuato`. 
- **Logica**: Gestione di `fascia1` (Pranzo) e `fascia2` (Cena) con checkbox di attivazione indipendenti. Opacità 0.6 per UI disabilitata in stato Chiuso.

### Blocco 11: Home Page — Carousel & AI Visuals
- **Status**: [x] Completato
- **Assets**: Generazione via AI di 6 file premium (5 piatti + 1 staff) salvati in `/public/dishes` e `/public/staff`.
- **Sviluppo**: Carousel 3D con calcolo dinamico degli offset via CSS Variables (`--tx`, `--scale`, `--blur`).

### Blocco 12: Recruiting (Lavora con noi)
- **Status**: [/] In Corso
- **Attività**: 
  - [x] Toggle attivazione globale in Informazioni.
  - [x] Tab UI in Admin Personale.
  - [ ] CRUD Annunci (Data, Titolo, Ruolo, Paga).
  - [ ] Form Candidatura Pubblico.

---

## Roadmap Fase 5 — Integrazioni & Persistenza
1. **Supabase**: Migrazione dei dati da mock a database reale (PostgreSQL).
2. **Stripe**: Configurazione checkout per depositi cauzionali prenotazioni.
3. **Automazioni**: Setup n8n per invio notifiche conferma e sincronizzazione Google Calendar.

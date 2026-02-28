# Piano di Progetto (PdP) — Mare Nostrum

Questo documento definisce le milestone, la gestione del rischio e la strategia di esecuzione per la piattaforma gestionale del ristorante Mare Nostrum.

## 1. Obiettivi e Scadenze (Milestones)

| Milestone | Descrizione | Priorità | Stato |
| :--- | :--- | :---: | :---: |
| **Fase 1-3** | Core Dashboard, Prenota Base, Gestione Tavoli/Menu | Alta | ✅ Completata |
| **Fase 4** | UX/UI Premium, Orari Avanzati, Carousel 3D, Recruiting | Alta | ✅ Completata |
| **Fase 5** | Persistenza Supabase, Auth Reale, Data Intelligence | Critica | 🚧 In Corso |

---

## 2. Strategia di Esecuzione Multi-Agente

Il progetto segue una metodologia Agile-Agentic:
- **PM**: Definisce le feature in `PDR.md`.
- **Software Manager**: Struttura i blocchi in `implementation_plan.md`.
- **Review & Propose**: Valida le dipendenze e approva l'inizio di nuovi blocchi.
- **Developer/Graphic AI**: Esegue il codice e affina l'estetica.
- **Test Engineer**: Convalida i risultati e aggiorna il `walkthrough.md`.

> [!NOTE]
> Ogni blocco deve essere validato tecnicamente dal Software Manager con `npm run build` prima della chiusura definitiva.

---

## 3. Roadmap Temporale dei Blocchi (Fase 4 & 5)

### Fase 4 (Corrente)
1. **Blocco 8-9**: Restyling Contabilità e Dettagli Menu. (Pronto per validazione)
2. **Blocco 10**: Gestione Orari Doppio Turno. (In implementazione)
3. **Blocco 11**: Carousel 3D Ring Home Page. (Completato)
4. **Blocco 12**: Sistema "Lavora con noi" completo. (Completato)

### Fase 5 (Pianificata)
1. **Supabase Transition**: Migrazione da Mock Data a PostgreSQL.
2. **Payment Gateway**: Integrazione Stripe per acconti prenotazioni.
3. **Eco-system Integration**: n8n Webhook e Google Calendar Sync.

---

## 4. Gestione dei Rischi e Mitigazione

| Rischio | Impatto | Probabilità | Strategia di Mitigazione |
| :--- | :--- | :---: | :--- |
| **Migrazione Dati** | Alto | Media | Implementazione di un repository pattern per switchare facilmente tra Mock e DB. |
| **Overbooking** | Critico | Bassa | Logica lato server per il calcolo real-time della capienza con lock temporaneo. |
| **Incoerenza Temi** | Medio | Media | Utilizzo rigoroso di variabili CSS nel `globals.css` invece di colori hardcoded. |

> [!WARNING]
> La transizione a Supabase richiede una revisione completa di tutti i componenti che usano `useState` per i dati globali.

---

## 5. Criteri di Successo del Progetto
- Build a 0 errori e 0 warning.
- Responsive design garantito su Mobile, Tablet e Desktop.
- Tempo medio di caricamento della Home < 1.5s.
- Processo di prenotazione completabile in meno di 4 click.

---

> [!NOTE] (Agente: Project_Manager_AI)
> Il Piano di Progetto viene aggiornato settimanalmente o ad ogni cambio di Fase.

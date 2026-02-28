# List of prompt for AI
**Regola base**: Nessun agente può scrivere su un file se non ha il permesso 'W' nella matrice, anche se pensa di avere un suggerimento utile". Questo obbligherà gli agenti a comunicare tra loro tramite l'Orchestratore invece di modificare i file a turno.S

### Promt_AWGM
**Ruolo**: Agisci come un AI Architect. Devo generare un file chiamato AWGM.md (Agentic Workflow & Governance Manual) per il mio progetto 'Mare Nostrum' (Piattaforma Gestionale Ristorante).

**Obiettivo**: Questo file deve servire come 'Regolamento' per un'architettura multi-agente in cui diverse identità AI collaborano leggendo e scrivendo file Markdown. Il documento deve essere strutturato nelle seguenti sezioni, integrando le informazioni dai file di progetto esistenti:

1. Definizione dei Ruoli (Agent Roster)
Descrivi le responsabilità e il 'mindset' dei seguenti agenti basandoti sulle necessità del progetto:
  - Product Manager (PM): Custode della visione e dei requisiti.
  - Software Manager: Traduttore dei requisiti in task tecnici e logica Next.js.
  - Database Manager: Progettista dello schema Supabase/PostgreSQL.
  - Graphic Manager: Responsabile dell'UI, dei 4 temi CSS e delle animazioni.
  - DevOps Manager: Gestore di build, npm e deployment su Vercel.
  - Test Engineer: Verificatore della qualità e della coerenza delle feature realizzate.
  - Review & Propose: Agente supervisore che analizza i file per trovare incongruenze.

2. File Ownership Matrix
Crea una tabella che definisca chi ha i permessi di Lettura (R), Scrittura (W) e Approvazione (A) per i seguenti file:
  - PDR.md
  - PdP.md
  - DB_Schema.md
  - implementation_plan.md
  - task.md
  - walkthrough.md
  - Style_Guide.md

3. Protocolli di Comunicazione e Handoff
Stabilisci le regole per il passaggio di compiti. Esempio:
  - Il Software Manager può aggiornare l'implementation_plan.md solo dopo che il PM ha approvato una modifica nel PDR.md.
  - Il Test Engineer segna un task come completato in task.md solo dopo aver aggiornato il walkthrough.md con i risultati dei test.

4. Regole di Scrittura File
Definisci gli standard di formattazione:
  - Uso obbligatorio dei checkbox [ ] e [x] per i task.
  - Uso di alert block come > [!IMPORTANT] o > [!NOTE] per le note critiche.
  - Mantenimento rigoroso dello storico delle fasi (es. Fase 3 completata vs Fase 4 in corso).

**Output**: Genera il file AWGM.md in modo che sia pronto per essere caricato nella repository e usato come guida per altri agenti AI.

### Promt_Implementation_plan 
**Ruolo**: agisci come un Senior Full-Stack Architect. Il tuo compito è generare da zero il file implementation_plan.md per il progetto 'Mare Nostrum'. Questo file deve sostituire la versione precedente e diventare la 'Bibbia tecnica' per i miei manager AI (Software, Database e Test Manager).
**Fonti di Conoscenza**:
Utilizza esclusivamente le specifiche fornite nei seguenti documenti per garantire coerenza al 100%:

    - PDR.md: Per lo stack (Next.js 16, Supabase) e le logiche di business (Smart Booking, Ruoli).
    - task.md: Per lo storico delle fasi completate (Fasi 1-3) e i task pendenti (Fase 4).
    - walkthrough.md: Per lo stato attuale dell'implementazione e i flussi di test già validati.

**Struttura del file richiesta**:
1. Architettura e Standard di Qualità
    - Definisci lo stack tecnologico e le convenzioni di stile (CSS Modules, TypeScript strict mode).
    - Definition of Done (DoD): Specifica che un blocco è chiuso solo se supera npm run build, viene testato in /prenota o nella dashboard corrispondente e il walkthrough.md viene aggiornato.

2. Storico Implementazione (Fasi 1-3)
    - Riassumi brevemente i blocchi già completati (Header dinamico, Prenota base, Redesign Tavoli, etc.) come contesto per gli agenti.

3. Roadmap Dettagliata Fase 4 (UX/UI & Advanced)
Per ogni blocco (dall'8 al 12), devi espandere le specifiche includendo:
    - Obiettivo tecnico: Cosa deve fare il codice.
    - File da modificare: Percorsi esatti delle pagine e dei componenti.
    - Data Schema & Logic: Se il blocco richiede nuovi campi (es. mostraInHome, allergeni, orari_doppio_turno), definiscine il tipo e il fallback.
    - Criteri di Accettazione (Test): Elenco puntato di cosa deve funzionare per considerare il blocco 'Fatto'.

4. Proiezione Fase 5 (Integrazioni & Persistence)
    - Definisci la strategia per il passaggio dai mock a Supabase.
    - Pianifica l'integrazione di Stripe (pagamenti), n8n (notifiche/webhook) e Google Calendar.

5. Gestione Dipendenze e Rischi
    - Spiega le propedeuticità (es: non puoi fare il Carousel della Home senza aver prima implementato i campi mostraInHome nel Menu).

**Formattazione**:
    - Usa Markdown avanzato con alert blocks > [!IMPORTANT] per i vincoli tecnici e > [!TIP] per i suggerimenti agli agenti.
    - Assicurati che ogni sottosezione sia numerata e referenziabile.

**Output**: Genera ora il file implementation_plan.md completo, eliminando ogni ambiguità e rendendolo pronto per l'esecuzione autonoma da parte di altri agenti AI.

### Prompt_PianoDiProgetto
**Ruolo**: agisci come un Project Manager Senior specializzato in metodologie Agile e architetture multi-agente. Il tuo compito è generare il file PdP.md (Piano di Progetto) per la piattaforma 'Mare Nostrum'.

**Obiettivo**: Il documento deve servire a coordinare il lavoro nel tempo, definendo le milestone e la gestione del rischio, integrando le informazioni dai seguenti file:
  - PDR.md: Per la visione del prodotto e i requisiti core.
  - task.md: Per lo stato attuale dei lavori e la cronologia delle fasi.
  - implementation_plan.md: Per la sequenza tecnica dei blocchi.

**Struttura del file richiesta**:

1. Obiettivi e Scadenze (Milestones)
  - Definisci le 5 fasi del progetto (Fasi 1-3 come 'Completate', Fase 4 'In Corso', Fase 5 'Futura').
  - Assegna una priorità a ogni fase (Alta, Media, Bassa) basandoti sull'impatto per il business descritto nel PDR.

2. Strategia di Esecuzione Multi-Agente
  - Spiega come gli agenti (PM, Software Manager, Graphic Manager, etc.) collaborano nelle diverse fasi.
  - Specifica che il Software Manager deve validare tecnicamente ogni blocco prima che il Test Engineer possa procedere.

3. Roadmap Temporale dei Blocchi (Fase 4 & 5)
  - Organizza cronologicamente i blocchi dall'8 al 12 e proietta i blocchi della Fase 5 (Supabase, Stripe, n8n).
  - Indica le dipendenze critiche (es: il Blocco 11 dipende dal completamento del Blocco 9).

4. Gestione dei Rischi e Mitigazione
  - Identifica almeno 3 rischi specifici per questo progetto, ad esempio:
    - Rischio Tecnico: Complessità della migrazione da Mock a Supabase.
    - Rischio di Business: Gestione dell'overbooking nel sistema Smart Booking.
    - Rischio di Design: Incoerenza tra i 4 temi CSS durante lo sviluppo di nuove pagine.

5. Criteri di Successo del Progetto
  - Definisci cosa rende il progetto un successo (es: Build a 0 errori, responsive 100%, integrazione pagamenti funzionante).

**Formattazione**:
  - Usa tabelle per le milestone e i rischi per una lettura rapida.
  - Utilizza alert blocks > [!WARNING] per i rischi critici e > [!NOTE] per le note di gestione.

**Output**: Genera il file PdP.md in modo che sia la guida strategica definitiva per il monitoraggio del progetto."

### Prompt_Project_Manager
**Ruolo**: Agisci come un Project Manager esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Project_Manager.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Project_Manager.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_ProjectPlanner
**Ruolo**: Agisci come un Project Planner esperto in metodologie Agile e Lean. Il tuo compito è analizzare il file implementation_plan.md e generare un documento di pianificazione strategica chiamato ProjectPlanner.md.

**Obiettivo**: Questo documento deve servire come guida per il Product Manager e il Team di Sviluppo, aiutandoli a prendere decisioni informate su come allocare risorse, gestire le priorità e mitigare i rischi durante le prossime fasi di sviluppo.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le dipendenze e le specifiche di ogni blocco.
- PDR.md: Per comprendere la visione di business e gli obiettivi strategici del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Riepilogo Esecutivo
    - Breve sintesi dello stato attuale del progetto (es. "Fase 3 completata, Fase 4 in corso").
    - Valutazione generale della salute del progetto (rispetto ai tempi, rischi identificati).

2. Analisi delle Dipendenze e Sequenziamento
    - Identifica le dipendenze critiche tra i blocchi della Fase 4 e Fase 5.
    - Suggerisci un ordine di esecuzione ottimale per massimizzare l'efficienza e minimizzare i blocchi.
    - Evidenzia eventuali colli di bottiglia (es. "Il blocco 12 richiede la configurazione di n8n, che dovrebbe essere pianificata in anticipo").

3. Allocazione delle Risorse e Stima dei Tempi
    - Per ogni blocco della roadmap, fornisci una stima approssimativa in "Uomo-Giorno" (o ore) basandoti sulla complessità tecnica.
    - Suggerisci come distribuire il lavoro tra i membri del team (es. "Il blocco 8 può essere lavorato in parallelo al blocco 9").

4. Strategia di Gestione dei Rischi
    - Identifica i 3-5 rischi principali per le prossime fasi (es. complessità dell'integrazione Stripe, sfide UX con il calendario).
    - Per ogni rischio, proponi una strategia di mitigazione e un piano di emergenza (Contingency Plan).

5. Criteri di Successo per la Fase Corrente
    - Definisci cosa significa "successo" per la Fase 4, andando oltre i semplici criteri tecnici.
    - Includi metriche qualitative (es. feedback degli utenti, miglioramento percepito dell'UX).

6. Raccomandazioni Strategiche
    - Suggerimenti specifici per il Product Manager su come ottimizzare la roadmap.
    - Indicazioni su quando considerare una "mini-release" per ottenere feedback anticipato dagli utenti.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per le stime e le matrici di rischio.
    - Utilizza alert blocks > [!IMPORTANT] per le raccomandazioni critiche e > [!TIP] per i suggerimenti strategici.
    - Mantieni un tono professionale, orientato all'azione e basato sui dati estratti dai file di input.

**Output**: Genera il file ProjectPlanner.md completo, fornendo una guida strategica chiara e attuabile per la gestione del progetto 'Mare Nostrum'.

### Prompt_TestEngineer
**Ruolo**: Agisci come un Senior Test Engineer specializzato in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione dei test completo chiamato TestEngineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Quality Assurance Manager, definendo una strategia di test completa che copra sia i test manuali che quelli automatizzati, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Test Complessiva
    - Descrizione della strategia di test adottata (es. Shift-Left Testing, TDD).
    - Definizione dei diversi livelli di test (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Test Manuali
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di test specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Test Automatizzati
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati ai test (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file TestEngineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dei test nel progetto 'Mare Nostrum'.

### Prompt_Software_Manager
**Ruolo**: Agisci come un Software Manager esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del software completo chiamato Software_Manager.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Software Manager, definendo una strategia di sviluppo completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Sviluppo Complessiva
    - Descrizione della strategia di sviluppo adottata (es. Shift-Left Development, TDD).
    - Definizione dei diversi livelli di sviluppo (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Sviluppo Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di sviluppo specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Sviluppo Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati allo sviluppo (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Software_Manager.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_Database_Manager
**Ruolo**: Agisci come un Database Manager esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del database completo chiamato Database_Manager.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Database Manager, definendo una strategia di database completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Database Complessiva
    - Descrizione della strategia di database adottata (es. Schema Evolution, Database-as-Code).
    - Definizione dei diversi livelli di database (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Sviluppo Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di sviluppo specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Sviluppo Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati allo sviluppo (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Database_Manager.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'. 

### Prompt_Product_Owner
**Ruolo**: Agisci come un Product Owner esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del prodotto completo chiamato Product_Owner.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Product Owner, definendo una strategia di prodotto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Prodotto Complessiva
    - Descrizione della strategia di prodotto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di prodotto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Prodotto Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di prodotto specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Prodotto Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati al prodotto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Product_Owner.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_DevOps_Engineer
**Ruolo**: Agisci come un DevOps Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione DevOps completo chiamato DevOps_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il DevOps Engineer, definendo una strategia DevOps completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia DevOps Complessiva
    - Descrizione della strategia DevOps adottata (es. CI/CD, Infrastructure as Code).
    - Definizione dei diversi livelli di DevOps (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Sviluppo Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di sviluppo specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Sviluppo Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati allo sviluppo (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file DevOps_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_Dev_Engineer
**Ruolo**: Agisci come un Developer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione dello sviluppo completo chiamato Dev_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Developer, definendo una strategia di sviluppo completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Sviluppo Complessiva
    - Descrizione della strategia di sviluppo adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di sviluppo (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Sviluppo Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di sviluppo specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Sviluppo Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati allo sviluppo (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Dev_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_UI_UX_Designer
**Ruolo**: Agisci come un UI/UX Designer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione dell'interfaccia utente e dell'esperienza utente completo chiamato UI_UX_Designer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il UI/UX Designer, definendo una strategia di interfaccia utente e esperienza utente completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di UI/UX Complessiva
    - Descrizione della strategia di UI/UX adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di UI/UX (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. UI/UX Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di UI/UX specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. UI/UX Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla UI/UX (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file UI_UX_Designer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_Project_Manager
**Ruolo**: Agisci come un Project Manager esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Project_Manager.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Project_Manager.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.

### Prompt_Senior_Software_Manager
**Ruolo**: Agisci come un Software Manager esperto in architetture multi-agente e metodologie Agile. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Software_Manager.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Software_Manager.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.


### Prompt_Business_Analyst
**Ruolo**: Agisci come un Business Analyst esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Business_Analyst.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Business_Analyst.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'. 

### Prompt_System_Architect
**Ruolo**: Agisci come un System Architect esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato System_Architect.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file System_Architect.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.   

### Prompt_Frontend_Developer
**Ruolo**: Agisci come un Frontend Developer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Frontend_Developer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Frontend_Developer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.   

### Prompt_Backend_Developer
**Ruolo**: Agisci come un Backend Developer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Backend_Developer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Backend_Developer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.   

### Prompt_Fullstack_Developer
**Ruolo**: Agisci come un Fullstack Developer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Fullstack_Developer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Fullstack_Developer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.    

### Prompt_Database_Administrator
**Ruolo**: Agisci come un Database Administrator esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Database_Administrator.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Database_Administrator.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.   

### Prompt_API_Developer
**Ruolo**: Agisci come un API Developer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato API_Developer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file API_Developer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.    

### Prompt_Cloud_Engineer
**Ruolo**: Agisci come un Cloud Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del progetto completo chiamato Cloud_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Project Manager, definendo una strategia di gestione del progetto completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione del Progetto Complessiva
    - Descrizione della strategia di gestione del progetto adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di gestione del progetto (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione del progetto (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Cloud_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.    

### Prompt_Security_Engineer
**Ruolo**: Agisci come un Security Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione della sicurezza completo chiamato Security_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Security Engineer, definendo una strategia di sicurezza completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Sicurezza Complessiva
    - Descrizione della strategia di sicurezza adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di sicurezza (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Sicurezza Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di sicurezza specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Sicurezza Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla sicurezza (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Security_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dello sviluppo nel progetto 'Mare Nostrum'.    

### Prompt_QA_Test_Engineer
**Ruolo**: Agisci come un QA Test Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione dei test completo chiamato QA_Test_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il QA Test Engineer, definendo una strategia di test completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Test Complessiva
    - Descrizione della strategia di test adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di test (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Test Manuali
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di test specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Test Automatizzati
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati ai test (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file QA_Test_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dei test nel progetto 'Mare Nostrum'.     

### PRompt_Code_Reviewer
**Ruolo**: Agisci come un Code Reviewer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione della code review completo chiamato Code_Reviewer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Code Reviewer, definendo una strategia di code review completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Code Review Complessiva
    - Descrizione della strategia di code review adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di code review (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Code Review Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di code review specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Code Review Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla code review (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Code_Reviewer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della code review nel progetto 'Mare Nostrum'.       

### Prompt_Automated_Testing_Engineer
**Ruolo**: Agisci come un Automated Testing Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione dei test automatizzati completo chiamato Automated_Testing_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Automated Testing Engineer, definendo una strategia di test automatizzati completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Test Automatizzati Complessiva
    - Descrizione della strategia di test automatizzati adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di test automatizzati (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Test Automatizzati Manuali
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di test automatizzati specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Test Automatizzati Automatizzati
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati ai test automatizzati (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Automated_Testing_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dei test automatizzati nel progetto 'Mare Nostrum'.         

### Prompt_Performance_Engineer
**Ruolo**: Agisci come un Performance Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione delle performance completo chiamato Performance_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Performance Engineer, definendo una strategia di performance completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Performance Complessiva
    - Descrizione della strategia di performance adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di performance (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Performance Manuali
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di performance specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Performance Automatizzate
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alle performance (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Performance_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione delle performance nel progetto 'Mare Nostrum'.          

### Prompt_Documentation_Engineer
**Ruolo**: Agisci come un Documentation Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione della documentazione completo chiamato Documentation_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Documentation Engineer, definendo una strategia di documentazione completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Documentazione Complessiva
    - Descrizione della strategia di documentazione adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di documentazione (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Documentazione Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di documentazione specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Documentazione Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla documentazione (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Documentation_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della documentazione nel progetto 'Mare Nostrum'.          

### Prompt_Release_Manager
**Ruolo**: Agisci come un Release Manager esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione del rilascio completo chiamato Release_Manager.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Release Manager, definendo una strategia di rilascio completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Rilascio Complessiva
    - Descrizione della strategia di rilascio adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di rilascio (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Rilasci Manuali
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di rilascio specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Rilasci Automatizzati
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati al rilascio (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Release_Manager.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione del rilascio nel progetto 'Mare Nostrum'.            

### Prompt_CI_CD_Engineer
**Ruolo**: Agisci come un CI/CD Engineer esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di pianificazione della pipeline CI/CD completo chiamato CI_CD_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il CI/CD Engineer, definendo una strategia di pipeline CI/CD completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Pipeline CI/CD Complessiva
    - Descrizione della strategia di pipeline CI/CD adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di pipeline CI/CD (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Pipeline CI/CD Manuali
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di pipeline CI/CD specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Pipeline CI/CD Automatizzate
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla pipeline CI/CD (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file CI_CD_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della pipeline CI/CD nel progetto 'Mare Nostrum'.             

### Prompt_Legale_Compliance_Officer
**Ruolo**: Agisci come un Legale e Compliance Officer esperto in normative sulla privacy e protezione dei dati (GDPR, CCPA, ecc.). Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di conformità legale completo chiamato Legale_Compliance_Officer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Legale e Compliance Officer, definendo una strategia di conformità legale completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le normative vigenti.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Conformità Legale Complessiva
    - Descrizione della strategia di conformità legale adottata (es. GDPR, CCPA, ecc.).
    - Definizione dei diversi livelli di conformità legale (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Conformità Legale Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di conformità legale specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Conformità Legale Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla conformità legale (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Legale_Compliance_Officer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della conformità legale nel progetto 'Mare Nostrum'.               

### Prompt_SRE_Site_Reliability_Engineer
**Ruolo**: Agisci come un Site Reliability Engineer (SRE) esperto in metodologie Agile e DevOps. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di affidabilità del sito completo chiamato SRE_Site_Reliability_Engineer.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il SRE, definendo una strategia di affidabilità del sito completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le pratiche DevOps.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Affidabilità del Sito Complessiva
    - Descrizione della strategia di affidabilità del sito adottata (es. Agile, DevOps).
    - Definizione dei diversi livelli di affidabilità del sito (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Affidabilità del Sito Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di affidabilità del sito specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Affidabilità del Sito Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati all'affidabilità del sito (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file SRE_Site_Reliability_Engineer.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dell'affidabilità del sito nel progetto 'Mare Nostrum'.                  

### Prompt_SEO_Specialist
**Ruolo**: Agisci come un SEO Specialist esperto in SEO tecnica e content marketing. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento SEO completo chiamato SEO_Specialist.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il SEO Specialist, definendo una strategia SEO completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice SEO.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia SEO Complessiva
    - Descrizione della strategia SEO adottata (es. SEO tecnica, content marketing).
    - Definizione dei diversi livelli di SEO (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. SEO Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di SEO specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. SEO Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla SEO (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file SEO_Specialist.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della SEO nel progetto 'Mare Nostrum'.                    

### Prompt_Data_Scientist
**Ruolo**: Agisci come un Data Scientist esperto in analisi dei dati e machine learning. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di analisi dei dati completo chiamato Data_Scientist.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e il Data Scientist, definendo una strategia di analisi dei dati completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di data science.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Analisi dei Dati Complessiva
    - Descrizione della strategia di analisi dei dati adottata (es. analisi dei dati, machine learning).
    - Definizione dei diversi livelli di analisi dei dati (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Analisi dei Dati Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di analisi dei dati specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Analisi dei Dati Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati all'analisi dei dati (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Data_Scientist.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dell'analisi dei dati nel progetto 'Mare Nostrum'.                                  

### Prompt_Cache_Optimization_Expert
**Ruolo**: Agisci come un esperto di ottimizzazione della cache e performance tuning. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di ottimizzazione della cache completo chiamato Cache_Optimization_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Ottimizzazione della Cache, definendo una strategia di ottimizzazione della cache completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di ottimizzazione della cache.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Ottimizzazione della Cache Complessiva
    - Descrizione della strategia di ottimizzazione della cache adottata (es. ottimizzazione della cache, performance tuning).
    - Definizione dei diversi livelli di ottimizzazione della cache (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Ottimizzazione della Cache Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di ottimizzazione della cache specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Ottimizzazione della Cache Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati all'ottimizzazione della cache (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Cache_Optimization_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dell'ottimizzazione della cache nel progetto 'Mare Nostrum'.

### Prompt_Log_Monitoring_Expert
**Ruolo**: Agisci come un esperto di log e monitoraggio. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di log e monitoraggio completo chiamato Log_Monitoring_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Log e Monitoraggio, definendo una strategia di log e monitoraggio completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di log e monitoraggio.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Log e Monitoraggio Complessiva
    - Descrizione della strategia di log e monitoraggio adottata (es. log e monitoraggio, performance tuning).
    - Definizione dei diversi livelli di log e monitoraggio (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Log e Monitoraggio Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di log e monitoraggio specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Log e Monitoraggio Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati al log e monitoraggio (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Log_Monitoring_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione del log e monitoraggio nel progetto 'Mare Nostrum'.

### Prompt_Incident_Response_Expert
**Ruolo**: Agisci come un esperto di risposta agli incidenti. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di risposta agli incidenti completo chiamato Incident_Response_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Risposta agli Incidenti, definendo una strategia di risposta agli incidenti completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di risposta agli incidenti.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Risposta agli Incidenti Complessiva
    - Descrizione della strategia di risposta agli incidenti adottata (es. risposta agli incidenti, performance tuning).
    - Definizione dei diversi livelli di risposta agli incidenti (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Risposta agli Incidenti Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di risposta agli incidenti specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Risposta agli Incidenti Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla risposta agli incidenti (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Incident_Response_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della risposta agli incidenti nel progetto 'Mare Nostrum'.

### Prompt_Refactoring_Expert
**Ruolo**: Agisci come un esperto di refactoring. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di refactoring completo chiamato Refactoring_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Refactoring, definendo una strategia di refactoring completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di refactoring.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Refactoring Complessiva
    - Descrizione della strategia di refactoring adottata (es. refactoring, performance tuning).
    - Definizione dei diversi livelli di refactoring (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Refactoring Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di refactoring specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Refactoring Automatizzato
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati al refactoring (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Refactoring_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione del refactoring nel progetto 'Mare Nostrum'.

### Prompt_Dependency_Management_Expert
**Ruolo**: Agisci come un esperto di gestione delle dipendenze. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di gestione delle dipendenze completo chiamato Dependency_Management_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Gestione delle Dipendenze, definendo una strategia di gestione delle dipendenze completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di gestione delle dipendenze.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione delle Dipendenze Complessiva
    - Descrizione della strategia di gestione delle dipendenze adottata (es. gestione delle dipendenze, performance tuning).
    - Definizione dei diversi livelli di gestione delle dipendenze (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione delle Dipendenze Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione delle dipendenze specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione delle Dipendenze Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione delle dipendenze (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Dependency_Management_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della gestione delle dipendenze nel progetto 'Mare Nostrum'.

### Prompt_Environment_Configuration_Expert
**Ruolo**: Agisci come un esperto di configurazione dell'ambiente. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di configurazione dell'ambiente completo chiamato Environment_Configuration_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Configurazione dell'Ambiente, definendo una strategia di configurazione dell'ambiente completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di configurazione dell'ambiente.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Configurazione dell'Ambiente Complessiva
    - Descrizione della strategia di configurazione dell'ambiente adottata (es. configurazione dell'ambiente, performance tuning).
    - Definizione dei diversi livelli di configurazione dell'ambiente (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Configurazione dell'Ambiente Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di configurazione dell'ambiente specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Configurazione dell'Ambiente Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla configurazione dell'ambiente (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Environment_Configuration_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della configurazione dell'ambiente nel progetto 'Mare Nostrum'.

## Prompt_User_Feedback_Analysis_Expert
**Ruolo**: Agisci come un esperto di analisi del feedback degli utenti. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di analisi del feedback degli utenti completo chiamato User_Feedback_Analysis_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Analisi del Feedback degli Utenti, definendo una strategia di analisi del feedback degli utenti completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di analisi del feedback degli utenti.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Analisi del Feedback degli Utenti Complessiva
    - Descrizione della strategia di analisi del feedback degli utenti adottata (es. analisi del feedback degli utenti, performance tuning).
    - Definizione dei diversi livelli di analisi del feedback degli utenti (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Analisi del Feedback degli Utenti Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di analisi del feedback degli utenti specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Analisi del Feedback degli Utenti Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati all'analisi del feedback degli utenti (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file User_Feedback_Analysis_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione dell'analisi del feedback degli utenti nel progetto 'Mare Nostrum'.

### Prompt_Priority_Management_Expert
**Ruolo**: Agisci come un esperto di gestione delle priorità. Il tuo compito è analizzare i file di specifica del progetto 'Mare Nostrum' e generare un documento di gestione delle priorità completo chiamato Priority_Management_Expert.md.

**Obiettivo**: Questo documento deve servire come guida per il Team di Sviluppo e l'Esperto di Gestione delle Priorità, definendo una strategia di gestione delle priorità completa che copra sia lo sviluppo manuale che quello automatizzato, in linea con le best practice di gestione delle priorità.

**Input da analizzare**:
- implementation_plan.md: Per comprendere la roadmap tecnica, le specifiche di ogni blocco e i criteri di accettazione.
- walkthrough.md: Per avere una visione chiara dello stato attuale dell'implementazione e dei flussi di test già validati.
- PDR.md: Per comprendere i requisiti di business e gli obiettivi di qualità del prodotto.
- task.md: Per avere una visione chiara dello stato di avanzamento attuale e dei blocchi già completati.

**Struttura del file richiesta**:

1. Strategia di Gestione delle Priorità Complessiva
    - Descrizione della strategia di gestione delle priorità adottata (es. gestione delle priorità, performance tuning).
    - Definizione dei diversi livelli di gestione delle priorità (Unit, Integration, E2E, Performance, Security).
    - Integrazione con la pipeline CI/CD (GitHub Actions).

2. Gestione delle Priorità Manuale
    - Per ogni blocco della roadmap (Fase 4 e Fase 5), definisci:
        - Casi di gestione delle priorità specifici (Happy Path, Negative Path, Edge Cases).
        - Criteri di accettazione dettagliati.
        - Strumenti da utilizzare (es. browser dev tools, API testing tools).

3. Gestione delle Priorità Automatizzata
    - Identifica i test che dovrebbero essere automatizzati (es. test di regressione, test di integrazione).
    - Specifica gli strumenti da utilizzare (es. Playwright, Jest, Cypress).
    - Definisci la struttura della pipeline CI/CD e come i test si integrano in essa.

4. Piano di Esecuzione
    - Sequenza di esecuzione dei test (quali test eseguire prima di quali).
    - Strategia di gestione dei bug (segnalazione, tracciamento, verifica della risoluzione).
    - Criteri di uscita (Go/No-Go) per ogni fase di rilascio.

5. Rischi e Mitigazioni
    - Identifica i rischi specifici legati alla gestione delle priorità (es. difficoltà nel testare l'integrazione con servizi esterni).
    - Proponi strategie di mitigazione e soluzioni alternative.

**Formattazione**:
    - Usa Markdown avanzato con tabelle per i casi di test e le matrici di compatibilità.
    - Utilizza alert blocks > [!IMPORTANT] per i vincoli critici e > [!TIP] per le best practice.
    - Mantieni un tono professionale, tecnico e orientato all'azione.

**Output**: Genera il file Priority_Management_Expert.md completo, fornendo una guida chiara e attuabile per la pianificazione e l'esecuzione della gestione delle priorità nel progetto 'Mare Nostrum'.
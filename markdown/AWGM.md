# Agentic Workflow & Governance Manual (AWGM)

Questo documento funge da regolamento ufficiale per l'architettura multi-agente del progetto **Mare Nostrum**. Definisce ruoli, permessi, protocolli di comunicazione e standard di documentazione per garantire la coerenza e l'efficienza della collaborazione tra agenti AI.

## 1. Definizione dei Ruoli (Agent Roster)

### 1.1 Product Manager (PM)
- **Mindset**: Custode della visione del prodotto e dei requisiti di business.
- **Responsabilità**: Definire "cosa" costruire e stabilire le priorità strategiche.
- **Obiettivo**: Massimizzare il valore del prodotto per l'utente finale.

### 1.2 Software Manager
- **Mindset**: Architetto tecnico e risolutore di problemi logici.
- **Responsabilità**: Tradurre i requisiti in specifiche tecniche Next.js e coordinare l'esecuzione dei blocchi.
- **Obiettivo**: Garantire un'architettura software robusta, scalabile e performante.

### 1.3 Database Manager
- **Mindset**: Ingegnere dei dati e custode dell'integrità informativa.
- **Responsabilità**: Progettare lo schema Supabase/PostgreSQL e gestire le migrazioni.
- **Obiettivo**: Assicurare che i dati siano strutturati, sicuri e accessibili.

### 1.4 Graphic Manager
- **Mindset**: Creativo focalizzato sull'estetica e l'usabilità (UI/UX).
- **Responsabilità**: Gestire i 4 temi CSS, le animazioni premium e la visual excellence.
- **Obiettivo**: Creare un'interfaccia "WOW" che sia al contempo funzionale.

### 1.5 DevOps Manager
- **Mindset**: Orientato alla stabilità del sistema e all'automazione dei processi.
- **Responsabilità**: Gestione di build, pacchetti npm, deployment e integrazioni esterne (Stripe/n8n).
- **Obiettivo**: Garantire che il codice sia sempre deployabile e l'infrastruttura sicura.

### 1.6 Test Engineer
- **Mindset**: Critico e metodico, garante della qualità.
- **Responsabilità**: Verificare la correttezza delle feature rispetto ai criteri di accettazione.
- **Obiettivo**: Portare il tasso di bug a zero attraverso test manuali e automatizzati.

### 1.7 Review & Propose (Governance)
- **Mindset**: Supervisore imparziale e arbitro della coerenza.
- **Responsabilità**: Analizzare le discrepanze tra documenti e approvare le proposte di modifica.
- **Obiettivo**: Prevenire conflitti tra agenti e mantenere la "verità unica" nei file di progetto.

---

## 2. File Ownership Matrix

| File | PM | Software Mgr | DB Mgr | Graphic Mgr | Test Eng | DevOps | Reviewer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `PDR.md` | **W** | R | R | R | R | R | **A** |
| `PdP.md` | **W** | R | R | R | R | R | **A** |
| `DB_Schema.md` | R | R | **W** | R | R | R | **A** |
| `implementation_plan.md` | R | **W** | R | R | R | R | **A** |
| `task.md` | R | R | R | R | **W** | R | **A** |
| `walkthrough.md` | R | R | R | R | **W** | R | R |
| `Style_Guide.md` | R | R | R | **W** | R | R | **A** |
| `env.local` | R | R | R | R | R | **W** | **A** |

**Legenda**: **W** (Write/Modifica), **R** (Read Only), **A** (Approve/Validazione).

---

## 3. Protocolli di Comunicazione e Handoff

- **Propedeuticità**: Il Software Manager può aggiornare l'`implementation_plan.md` solo dopo che il PM ha approvato una modifica nel `PDR.md` o nel `PdP.md`.
- **Esecuzione**: Un agente non può iniziare un task se non è segnato come `[/]` (In Progress) nel `task.md`.
- **Chiusura Task**: Il Test Engineer segna un task come completato `[x]` in `task.md` solo dopo aver aggiornato il `walkthrough.md` con i risultati dei test.
- **Proposte**: Ogni richiesta di modifica a un file con permesso **R** deve passare tramite una proposta analizzata dal **Review & Propose**.
- **Regola d'Oro**: Nessun agente può scrivere su un file se non ha il permesso 'W', anche se ha un suggerimento utile. Deve comunicarlo all'Orchestratore o all'agente competente.

---

## 4. Regole di Scrittura File

- **Task Tracking**: Uso obbligatorio di `[ ]` (da fare), `[/]` (in corso) e `[x]` (completato).
- **Enfatizzazione**: Utilizzo di alert blocks per note critiche:
  > [!IMPORTANT]
  > Informazione bloccante o vincolo tecnico imprescindibile.
  > [!NOTE]
  > Nota di contesto o suggerimento per altri agenti.
  > [!WARNING]
  > Rischio identificato che richiede attenzione.
- **Coerenza**: Mantenimento rigoroso dello storico delle fasi (es. Fase 3 completata vs Fase 4 in corso). Non eliminare i task passati, ma archiviarli o segnarli come completati.
- **Percorsi**: Usare sempre percorsi assoluti per i file quando citati nella documentazione tecnica.

---

> [!NOTE] (Agente: AWGM_Architect)
> Questo manuale è la base della governance del progetto. Ogni deviazione deve essere giustificata e approvata dalla Governance.

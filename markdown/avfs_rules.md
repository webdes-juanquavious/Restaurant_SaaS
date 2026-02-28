# AVFS Rules (Agentic Virtual File System)

Regolamento per la lettura, scrittura e modifica dei file di progetto da parte degli agenti AI.

## 1. Matrice di Ownership (Read/Write/Approve)

| File | PM | Software Mgr | DB Mgr | Graphic Mgr | Test Eng | Reviewer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `PDR.md` | **W** | R | R | R | R | **A** |
| `PdP.md` | **W** | R | R | R | R | **A** |
| `DB_Schema.md` | R | R | **W** | R | R | **A** |
| `implementation_plan.md` | R | **W** | R | R | R | **A** |
| `task.md` | R | R | R | R | **W** | **A** |
| `Style_Guide.md` | R | R | R | **W** | R | **A** |
| `walkthrough.md` | R | R | R | R | **W** | R |

**Legenda**: **W** (Write/Modifica), **R** (Read Only), **A** (Approve/Validazione Finale).

## 2. Protocollo di Modifica
1. **Richiesta**: Un agente che desidera modificare un file per cui ha solo permessi **R** deve inviare una proposta al **Review & Propose**.
2. **Atomicità**: Gli agenti non devono mai modificare più di un file fondamentale contemporaneamente senza aver aggiornato lo stato nel `task.md`.
3. **Commenti**: Ogni modifica significativa deve essere accompagnata da una breve nota nel file stesso usando il tag `> [!NOTE] (Agente: NomeAgente)`.

## 3. Gestione dei Conflitti
- In caso di discrepanza tra `PDR.md` e `implementation_plan.md`, la precedenza spetta sempre al `PDR.md` (Visione del PM).
- Se il **Review & Propose** classifica una proposta come `INUTILE`, l'agente proponente non può ripresentarla senza nuovi dati o giustificazioni.

## 4. Validazione e Chiusura Task
- Un task in `task.md` può essere segnato come completato `[x]` **solo dal Test Engineer** dopo aver verificato i criteri di accettazione definiti nell'Implementation Plan.
- L'approvazione finale del blocco di lavoro spetta al **Review & Propose** (Governance).
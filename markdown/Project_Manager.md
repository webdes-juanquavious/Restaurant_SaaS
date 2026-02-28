# Project Manager Strategy — Mare Nostrum

Questo documento definisce la strategia di gestione del progetto, i casi di test e la pipeline di rilascio seguendo i principi Agile e DevOps.

## 1. Strategia di Gestione Complessiva

La gestione del progetto adotta un approccio **Shift-Left Development & Testing**, integrando i controlli di qualità sin dalle prime fasi di sviluppo.

- **Unit Testing**: Verifica delle funzioni di calcolo (prezzi, capienza, tempi).
- **Integration**: Verifica del passaggio dati tra form e tabelle dashboard.
- **E2E**: Flusso completo Prenotazione -> Dashboard Admin -> Contabilità.
- **DevOps**: Build automatizzate (`npm run build`) per prevenire regressioni CSS/TypeScript.

---

## 2. Gestione Manuale (Fase 4 & 5)

| Blocco | Caso di Test: Happy Path | Casi Limite (Edge Cases) | Strumenti |
| :--- | :--- | :--- | :--- |
| **8: Contabilità** | Stats aggiornate dopo chiusura conto. | Cambio range date a metà operazione. | React DevTools |
| **9: Menu** | URL Immagine renderizza correttamente. | URL non valido -> fallback emoji. | Browser Inspector |
| **10: Orari** | Turno "Chiuso" disabilita orari. | Orari sovrapposti tra mattina e sera. | UI Manual Test |
| **11: Carousel** | Navigazione fluida e click centrale. | 1 solo piatto in vetrina / 0 piatti. | Console Log |
| **12: Recruiting** | Inviato form candidature mock. | CV file pesante (mock) / Campi vuoti. | Form Tester |

---

## 3. Gestione Automatizzata e CI/CD

- **Tools**: `Playwright` per test E2E sulla Home e Processo Prenotazione.
- **GitHub Actions**: Pipeline attivata su ogni Push per validare il building.
- **Vercel**: Deployment automatico del branch `main` con anteprima (Preview Deployments).

---

## 4. Piano di Esecuzione e Rilascio

1. **Sviluppo Locale**: npm run dev + manual validation.
2. **Build Check**: npm run build garantito.
3. **Draft Release**: Aggiornamento `walkthrough.md` e `task.md`.
4. **Final Approval**: Review dell'Agente Governance (Review & Propose).

---

## 5. Rischi e Mitigazioni

- **Rischio**: Incoerenza dati tra i 4 temi.
  - **Mitigazione**: Test visivo obbligatorio su tutti i temi per ogni nuova pagina UI.
- **Rischio**: Complessità Transition Supabase.
  - **Mitigazione**: Creazione di un mock service isolato prima dell'integrazione reale.

---

> [!IMPORTANT]
> Nessun task è considerato completato senza il superamento del Building in modalità produzione.

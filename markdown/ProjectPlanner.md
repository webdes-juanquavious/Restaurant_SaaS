# Project Planner — Mare Nostrum

Analisi strategica e allocazione risorse per lo sviluppo della piattaforma Mare Nostrum.

## 1. Riepilogo Esecutivo
Il progetto è attualmente nella **Fase 4 (UX/UI & Advanced Features)**. Le fondamenta (Fasi 1-3) sono solide e testate. La salute del progetto è ottima, con un rischio controllato legato alla futura integrazione di Supabase.

## 2. Analisi delle Dipendenze e Sequenziamento
- **Critica**: Il Blocco 11 (Carousel Home) dipende strettamente dal Blocco 9 (Aggiunta campi `descrizioneHome` e `mostraInHome` nel Menu).
- **Parallelo**: Il Blocco 8 (Restyling Contabilità) può essere eseguito indipendentemente dagli altri blocchi UI pubblici.
- **Sequenza Suggerita**:
  1. Blocco 8 (Stabilità Admin)
  2. Blocco 9 (Backend Menu Data)
  3. Blocco 10 (Configurazione Orari)
  4. Blocco 11 (Frontend Home)
  5. Blocco 12 (Recruiting System)

---

## 3. Allocazione Risorse e Stima dei Tempi

| Blocco | Complessità | Stima (Uomo-Ore) | Membri Team |
| :--- | :---: | :---: | :--- |
| **8: Restyling Contabilità** | Media | 4h | Software Mgr + Graphic Mgr |
| **9: Admin Menu Details** | Bassa | 3h | Software Mgr + DB Mgr |
| **10: Orari Doppio Turno** | Alta | 8h | Software Mgr |
| **11: Home Carousel 3D** | Alta | 10h | Graphic Mgr + Test Eng |
| **12: Lavora con noi** | Molto Alta | 16h | PM + Software Mgr + DevOps |

---

## 4. Strategia di Gestione dei Rischi

| Rischio | Strategia di Mitigazione | Piano di Emergenza (Contingency) |
| :--- | :--- | :--- |
| **Latenza Carousel 3D** | Ottimizzazione immagini e lazy loading. | Fallback su carousel 2D statico se FPS < 30. |
| **Errori Calcolo Orari** | Test di validazione su input conflict. | Default su orari "Continuato" in caso di errore logico. |
| **Integrazione Stripe** | Sandbox testing prolungato. | Pagamento manuale/testuale se API non risponde. |

---

## 5. Criteri di Successo Fase 4
- **Quantitativi**: Build success, 0 bug critici in `/prenota`.
- **Qualitativi**: Feedback utente "WOW" sulla fluidità del carousel. Dashboard admin percepita come più "ordinata" (Blocco 8).

---

## 6. Raccomandazioni Strategiche
- **Mini-Release**: Rilasciare i Blocchi 8-11 prima di iniziare il 12 per raccogliere feedback sull'estetica.
- **Performance**: Monitorare il peso del bundle JS dopo l'aggiunta di librerie per animazioni.

---

> [!TIP]
> Si consiglia di iniziare la configurazione di n8n in parallelo al Blocco 11 per non rallentare l'inizio della Fase 5.

# Checkpoint Stripe — 3 ottobre 2026

**COMPLETATO: SEI PRIMI PAGAMENTI SANDBOX, 6/6 PASS.**

Rapporto conclusivo: docs/TEST_PAGAMENTI_STRIPE.md.
Evidenze: docs/prove-stripe/pagamenti-20261003/results.json, reconciliation.json, listener.log e schermata del primo ritorno.

Acquisiti: sei sessioni complete/paid, sei sottoscrizioni active e fatture paid, importi corretti (15/25/45 EUR scheda, 30/60/120 EUR coaching). 18 eventi Stripe correlati agli ID dei sei casi, tutti HTTP 200. 21 email locali. Feedback scheda: 0/2/5; selezioni temporanee coach consumate.

I pagamenti sono stati confermati manualmente dall'utente a seguito del blocco della revisione automatica dello strumento. Non aggirare quel blocco per eventuali nuove conferme. Non ripetere questi sei acquisti o i controlli già conclusi.

Stato finale: listener Stripe arrestato con codice 0; file .local-test-artifacts/stripe-listener.stop presente. Backend, nginx, mysql e redis restano avviati con overlay Stripe; celery e beat fermi. Sei utenti QA (12–17), clienti e sottoscrizioni Stripe di test conservati, attivi. Credenziali nel file ignorato .local-test-artifacts/stripe-test.env.

Persistenza: .local-test-artifacts/stripe-payment-run.json contiene gli ID e gli esiti. stripe_checkout_case.py riutilizza le sessioni esistenti; stripe_payment_report.py aggiorna l'indice locale e copia evidenze senza URL di checkout. L'indice http://localhost:3000/stripe-qa-checkouts.html ora mostra sei pagamenti completati.

Nessuna attività residua per i sei primi pagamenti richiesti. Scenari ulteriori non verificati: rinnovi, rifiuti, 3DS, annullamento, portale, idempotenza webhook, percorso UI dal pulsante FitNexus. Email reali escluse. Due difetti non bloccanti nei nomi visualizzati delle email sono documentati (nome cliente ripetuto; cognome cliente usato nel nome del coach) e non corretti in questa fase. Per eventuale lavoro successivo partire dal nuovo scenario richiesto, conservando tutte le evidenze.

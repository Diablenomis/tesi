# Test dei sei abbonamenti Stripe — 3 ottobre 2026

## Stato

**Collaudo dei primi pagamenti completato: 6/6 PASS.** Tutte le sessioni sono complete, tutti i pagamenti e le fatture saldati, tutti gli abbonamenti attivi. Gli importi coincidono con i sei prezzi. Totale simulato: **295 EUR**, senza movimento di denaro reale. Sono stati correlati **18 eventi Stripe**, tutti consegnati al backend con HTTP 200, e **21 messaggi nel raccoglitore email locale**.

Questa conclusione riguarda i primi acquisti in Sandbox, non l'intero ciclo di vita degli abbonamenti. Rimangono i limiti e le anomalie di presentazione email descritti sotto.

La revisione automatica dello strumento Browser ha rifiutato l'azione di compilazione della carta e conferma del primo pagamento, richiedendo il passaggio all'utente anche in modalità test. Non sono stati utilizzati metodi alternativi per aggirare il blocco.

## Operazioni eseguite

- Predisposti sei utenti sintetici locali distinti, ciascuno con una copia delle 48 risposte del questionario QA già disponibile. Per i tre casi coaching è stata predisposta una scelta del coach sintetico. Non è stata ripetuta la compilazione del questionario nell'interfaccia.
- Avviato Stripe CLI con inoltro a `http://localhost:8000/payments/webhook/`, limitando i tipi di evento a checkout completato, fatture pagate/fallite e ciclo di vita delle sottoscrizioni. Segreti oscurati nel log.
- Invocato il vero endpoint HTTP FitNexus `/payments/create-checkout-session/` con autenticazione di ciascun utente. Tutte le risposte sono HTTP 200. Recuperate le sessioni tramite API Stripe e verificati `livemode=false`, importi, cliente e stato.
- Aperta la prima pagina Stripe Checkout nel browser: visibili Sandbox, scheda personalizzata, importo 15 EUR al mese e utente corretto. La prima navigazione ha impiegato più del timeout dello strumento, ma la pagina si è successivamente caricata. La pagina è stata aperta dall'URL restituito da Stripe: **non è ancora verificato il reindirizzamento dal pulsante della pagina PaymentPage di FitNexus**.
- L'azione di compilazione della carta di test e conferma è stata rifiutata dalla revisione automatica prima dell'esecuzione.
- L'utente ha poi confermato manualmente tutti e sei i pagamenti. Il primo è stato verificato subito e acquisito come concluso; alla ripresa sono stati interrogati soltanto i cinque casi rimanenti. Infine gli eventi Stripe sono stati associati agli ID di sessione, sottoscrizione e fattura e alle risposte HTTP registrate dal listener.

## Esito per abbonamento

Per ciascuna riga: creazione del Checkout attraverso FitNexus, conferma manuale dell'utente e lettura di sessione, fattura e sottoscrizione tramite API Stripe; verifica dei webhook e degli effetti locali. Il passaggio manuale richiesto dallo strumento non è un difetto dell'applicazione.

| Funzione | Importo per rinnovo | Risultato Checkout | Pagamento e webhook |
| --- | --- | --- | --- |
| Scheda personalizzata, 1 mese | 15 EUR | complete, paid, fattura paid, abbonamento active | PASS: tre eventi ricevuti con HTTP 200 |
| Scheda personalizzata, 3 mesi | 25 EUR | complete, paid, fattura paid, abbonamento active | PASS: tre eventi con HTTP 200; 2 feedback e 3 email locali |
| Scheda personalizzata, 6 mesi | 45 EUR | complete, paid, fattura paid, abbonamento active | PASS: tre eventi con HTTP 200; 5 feedback e 3 email locali |
| Coaching online, 1 mese | 30 EUR | complete, paid, fattura paid, abbonamento active | PASS: tre eventi con HTTP 200; selezione coach consumata, 4 email locali |
| Coaching online, 3 mesi | 60 EUR | complete, paid, fattura paid, abbonamento active | PASS: tre eventi con HTTP 200; selezione coach consumata, 4 email locali |
| Coaching online, 6 mesi | 120 EUR | complete, paid, fattura paid, abbonamento active | PASS: tre eventi con HTTP 200; selezione coach consumata, 4 email locali |

Evidenze: [sessioni, fatture, importi ed effetti locali](prove-stripe/pagamenti-20261003/results.json), [correlazione degli eventi e controlli per caso](prove-stripe/pagamenti-20261003/reconciliation.json), [log webhook](prove-stripe/pagamenti-20261003/listener.log). Gli URL completi dei Checkout erano conservati soltanto nei file locali ignorati da Git; dopo il completamento Stripe restituisce URL nullo.

### Primo pagamento: scheda personalizzata mensile

**Operazioni:** l'utente ha completato manualmente il Checkout Sandbox; successivamente sono stati interrogati sessione, sottoscrizione e fattura su Stripe e controllati log webhook e database locale.

**Risultato:** 15 EUR di test pagati, sessione `complete`, pagamento `paid`, sottoscrizione `active`, fattura `paid` con motivo `subscription_create`. I tre eventi `customer.subscription.created`, `checkout.session.completed`, `invoice.payment_succeeded` sono arrivati al backend e hanno ricevuto HTTP 200. Generati tre messaggi nel raccoglitore locale: pagamento effettuato, questionario al team, istruzioni al cliente. Zero feedback mensili iniziali, coerentemente con il piano di un mese. Il browser mostra «Pagamento effettuato» su `/payment-succeeded/`.

**Problemi:** nessun errore osservato nell'elaborazione di questo pagamento. Conferma manuale necessaria per il blocco dello strumento descritto sopra. Le email non sono state spedite tramite MailerSend. Il reindirizzamento dal pulsante di pagamento del frontend non è coperto, perché la sessione era stata aperta dall'URL Stripe.

**Evidenza:** [risultati](prove-stripe/pagamenti-20261003/results.json), [log webhook](prove-stripe/pagamenti-20261003/listener.log), [schermata di successo](prove-stripe/pagamenti-20261003/scheda-1-success.png). Eventi osservati alle 15:36:57–15:36:59 Europe/Rome del 3 ottobre 2026.

## Effetti osservati e anomalie

Per ogni scheda sono stati generati il riepilogo del pagamento, il questionario destinato al team e le istruzioni al cliente. I feedback mensili iniziali sono 0, 2 e 5 per i periodi di 1, 3 e 6 mesi, coerentemente con la logica applicativa che esclude l'ultimo mese. La creazione dei record non equivale alla loro futura consegna.

Per ogni coaching sono stati generati quattro messaggi: pagamento al cliente, istruzioni al cliente, richiesta al team e richiesta al coach sintetico. Il record temporaneo della selezione del coach è stato consumato. Non si afferma che sia stata creata una nuova associazione permanente al coach o una scheda di allenamento: queste azioni non sono dimostrate dal presente test.

**Anomalie non bloccanti osservate nei dati email:** il nome visualizzato del destinatario della conferma di pagamento è `Stripeqa Stripeqa` (nome ripetuto al posto di nome e cognome); nel messaggio al coach il nome visualizzato combina il nome del coach con il cognome del cliente (`Stripeqa Coaching1`, e analoghi). Gli indirizzi destinatari sono corretti. Il difetto proviene dalle composizioni in `payments/services.py`; è documentato e non è stato corretto durante questa fase di collaudo. Non comporta un errore nel pagamento o nei webhook.

La compatibilità con le fatture `2025-11-17.clover`, adeguata nella preparazione, è ora verificata anche sui sei eventi effettivamente prodotti da Stripe, oltre che sulle fixture locali.

## Limiti e stato finale

Non sono verificati rinnovi, pagamenti rifiutati, autenticazione aggiuntiva, annullamento, portale cliente, idempotenza/ripetizione degli eventi e reindirizzamento dal pulsante PaymentPage del frontend FitNexus. I questionari e la scelta coach sono fixture predisposte nel database; non è stato ripetuto tutto il percorso UI di registrazione e acquisto. Le email sono soltanto raccolte localmente: MailerSend e recapito reale restano esclusi.

Il flag account `charges_enabled=false` non ha impedito i sei pagamenti Sandbox. Non si trae alcuna conclusione sull'abilitazione ai pagamenti reali.

Il listener è stato arrestato dopo la verifica conclusiva (processo terminato con codice 0). Backend, Nginx, MySQL e Redis restano disponibili; Celery e Beat restano fermi. I sei utenti e le sei sottoscrizioni di test sono conservati per ispezione; gli abbonamenti sono attivi e non sono stati cancellati. Non è stato modificato il catalogo dei prodotti.

La [pagina locale del riepilogo](http://localhost:3000/stripe-qa-checkouts.html) è aggiornata ai sei pagamenti completati e non propone nuovi acquisti. Evidenze e checkpoint consentono di riprendere eventuali ulteriori scenari senza ripetere quelli conclusi.

# Preparazione del collaudo Stripe — 3 ottobre 2026

> Fase successiva completata: [sei primi pagamenti Sandbox verificati](TEST_PAGAMENTI_STRIPE.md). Il presente documento conserva lo stato e i limiti della sola preparazione; non rappresenta più il checkpoint operativo corrente.

## Stato e perimetro

Configurazione locale predisposta e controlli preparatori completati. **Test di pagamento non avviati: si attende il via libera dell'utente.** Nessuna sessione Checkout, transazione, sottoscrizione, prodotto o prezzo è stata creata durante questa preparazione. Non sono stati generati eventi Stripe di prova.

La verifica iniziale della chiave backend e del catalogo è stata acquisita dal checkpoint precedente. Alla ripresa sono stati completati i collegamenti CLI, backend e frontend, senza ripetere il collaudo funzionale storico.

## Catalogo da collaudare

Tutti i prodotti e prezzi recuperati sono di test (`livemode=false`). Gli importi sono addebitati per l'intero intervallo indicato, non mensilmente per i piani plurimensili.

| Prodotto | Intervallo di rinnovo | Importo per rinnovo |
| --- | --- | --- |
| scheda-personalizzata | 1 mese | 15 EUR |
| scheda-personalizzata | 3 mesi | 25 EUR |
| scheda-personalizzata | 6 mesi | 45 EUR |
| coaching-online | 1 mese | 30 EUR |
| coaching-online | 3 mesi | 60 EUR |
| coaching-online | 6 mesi | 120 EUR |

Gli identificativi dei sei prezzi sono nell'[evidenza catalogo](prove-stripe/preflight-20261003/stripe-preflight.json).

## Configurazione predisposta

- Docker Compose: base `qa/local/docker-compose.qa.yml` e overlay esplicito `qa/local/docker-compose.stripe.yml`, progetto `fitnexus-qa`, volume MySQL esistente conservato.
- Il backend riceve le credenziali da `.local-test-artifacts/stripe-test.env`, escluso da Git. `stripe_boot.py` conserva la chiave reale di test senza farla sovrascrivere dal precedente valore offline; rifiuta chiavi live o un segreto webhook mancante.
- Il backend è collegato anche alla rete Docker con uscita Internet. Le email dell'app continuano a essere intercettate dal raccoglitore locale. L'overlay non costituisce un firewall verso tutti i domini esterni: i controlli eseguiti hanno utilizzato soltanto Stripe.
- Frontend dedicato in `.local-test-artifacts/frontend-stripe-build`. La chiave pubblica arriva da `REACT_APP_STRIPE_PUBLISHABLE_KEY`, valorizzata in compilazione da `stripe_prepare.py build`. Eliminata la chiave incorporata nel sorgente di PaymentPage. Le altre build devono ora fornire questa variabile.
- Nginx usa una configurazione dedicata che consente le risorse Stripe. Frontend su `http://localhost:3000`, backend su `http://localhost:8000`, webhook previsto `/payments/webhook/`.
- Stripe CLI 1.53.0 autenticata con la chiave di test fornita, senza password dell'account. Il segreto ottenuto è salvato nello stesso file locale come `STRIPE_SIGNATURE_KEY`. Nessun endpoint pubblico è stato registrato.
- Il controllo della connessione CLI non aveva `--forward-to`: nessun evento dell'account è stato inoltrato all'app. Il processo è stato arrestato al termine.

## Esiti delle verifiche preparatorie

| Verifica | Operazione | Esito ed evidenza |
| --- | --- | --- |
| Credenziali backend e catalogo | Letture API dell'account, prodotti e prezzi | Riuscite, 2 prodotti e 6 prezzi; [rapporto iniziale](prove-stripe/preflight-20261003/stripe-preflight.json). Il flag `webhook_secret_present=false` fotografa il momento precedente alla configurazione CLI. |
| Catalogo attraverso FitNexus | Richiesta HTTP autenticata al backend Docker con utente QA esistente | HTTP 200, tutti i sei prezzi restituiti; [rapporto backend](prove-stripe/preflight-20261003/stripe-app-preflight.json). Nessuna modifica all'utente. |
| Firma webhook | Messaggio locale con tipo ignorato `qa.configuration_probe`, firma valida e poi errata | HTTP 200 e 400 rispettivamente. Nessuna logica di pagamento eseguita. Stessa evidenza backend. |
| Connessione Stripe CLI | Ascolto temporaneo senza inoltro né generazione di eventi | `Ready`, segreto corrispondente al file, versione webhook `2025-11-17.clover`; [rapporto CLI](prove-stripe/preflight-20261003/stripe-cli-preflight.json). |
| Compatibilità fatture | Controlli con dati simulati e chiamate Stripe sostituite da mock | 13 controlli superati, zero scritture DB; [rapporto compatibilità](prove-stripe/preflight-20261003/stripe-invoice-compatibility.json). |
| Frontend e accesso locale | Compilazione, lettura HTTP della pagina e del bundle servito, richiesta anonima al catalogo | Build completata, pagina HTTP 200, chiave pubblica corretta nel bundle, segreti privati assenti, CSP Stripe presente, catalogo anonimo HTTP 401; [rapporto frontend](prove-stripe/preflight-20261003/stripe-frontend-preflight.json). |

## Incompatibilità individuata e adeguamento

La versione webhook dell'account è più recente del formato atteso da `payments/services.py`: il codice leggeva direttamente `invoice.payment_intent` e `invoice.lines.data[0].plan`. La [documentazione Stripe](https://docs.stripe.com/changelog/basil/2025-03-31/add-support-for-multiple-partial-payments-on-invoices) descrive il passaggio dalla relazione diretta al contenitore `payments`; le [righe fattura](https://docs.stripe.com/api/invoice-line-item/object?api-version=2025-06-30.basil) espongono il riferimento al prezzo nella struttura `pricing`.

Il codice ora supporta sia il formato precedente sia quello recente: recupera i pagamenti della fattura quando non espansi, riporta i riferimenti dei pagamenti saldati e risolve la periodicità dal prezzo della riga. Per fatture senza un pagamento associato usa l'ID della fattura come riferimento. Sono verificati localmente i periodi da 1, 3 e 6 mesi, il formato precedente, pagamenti multipli, fatture a valore zero, periodicità annuale e rifiuto esplicito di quella settimanale.

Questo adeguamento è verificato con fixture, **non ancora con una fattura prodotta da un acquisto su Stripe**.

## Problemi tecnici incontrati durante la preparazione

- La prima esecuzione era stata interrotta da un errore del controllo automatico delle autorizzazioni per limite di utilizzo. Dopo la richiesta di ripresa i comandi autorizzati sono stati eseguiti regolarmente.
- La compilazione frontend nella sandbox ha restituito `spawn EPERM`; la stessa compilazione fuori dalla sandbox è terminata con codice 0. Rimangono gli avvisi di dipendenze/browserlist e dimensione del bundle, senza errore di build.
- Due raccolte iniziali del rapporto backend si sono fermate su dettagli dello script diagnostico (versione SDK e inizializzazione della chiave nel processo di shell). Corretto lo script, rapporto completo salvato. Le ripetizioni riguardavano queste raccolte incomplete, non il precedente collaudo funzionale.
- Un primo tentativo di ascolto CLI non ha raggiunto lo stato pronto entro 15 secondi. Il successivo è riuscito e il processo è stato chiuso.

## Limiti e attività successive

Non sono ancora verificati: validità della coppia chiave pubblica/backend durante Checkout, accettazione dei pagamenti da parte dell'account, interfaccia Checkout nel browser, invio di un evento di pagamento Stripe fino al backend, aggiornamenti applicativi dopo l'acquisto, rinnovi, rifiuti, autenticazione aggiuntiva e annullamenti.

La lettura iniziale dell'account restituiva `charges_enabled=false`: il dato è conservato nell'evidenza e non viene interpretato come prova del funzionamento o del fallimento dei pagamenti in test. L'esito operativo sarà determinato soltanto dalla fase successiva autorizzata.

Alla chiusura della preparazione restano avviati MySQL, Redis, backend e Nginx; Celery e Beat restano fermi. Nessun listener Stripe è lasciato attivo. Prima dei pagamenti occorre riavviare il listener con inoltro a `http://localhost:8000/payments/webhook/` e le stesse credenziali/dispositivo della preparazione, conservando oscurati i segreti nei log.

**Prima attività da riprendere:** ottenere il via libera richiesto dall'utente, quindi predisporre gli utenti/fixture necessari per ciascuno dei sei prezzi e iniziare dal primo acquisto di test. Per il coaching è necessaria anche la scelta del coach, per la scheda il questionario compilato. Mantenere le email locali e documentare separatamente ciascun esito.

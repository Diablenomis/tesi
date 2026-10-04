# FitNexus — Esito delle prove locali

> Aggiornamento Vimeo del 4 ottobre 2026: **upload reale riuscito**, 9 controlli locali superati, video pubblico su autorizzazione, play/pausa verificati nel player separato e **riproduzione dentro la scheda confermata manualmente dall'utente**. Il percorso Vimeo concordato è completato. Il riquadro vuoto osservato nel browser automatico resta documentato come limite della verifica automatica. Vedere [rapporto Vimeo](TEST_VIMEO_FITNEXUS.md); le esclusioni Vimeo nelle sezioni storiche seguenti sono superate per questo percorso.

> Aggiornamento Stripe del 3 ottobre 2026: completati e verificati **6/6 primi pagamenti Sandbox**, con 18 webhook HTTP 200, 21 email raccolte localmente e feedback mensili attesi. Vedere [test pagamenti Stripe](TEST_PAGAMENTI_STRIPE.md) per evidenze, limiti e due anomalie non bloccanti nei nomi visualizzati delle email. Le precedenti esclusioni di Stripe descrivono il collaudo storico; rinnovi, casi negativi, portale e percorso UI completo restano non verificati.

> Verifica aggiuntiva del 3 ottobre 2026: il task feedback corretto è stato eseguito tramite **Celery Beat → Redis → worker**, con stato **SUCCESS** e 10 controlli superati. Vedere [test Celery Beat](TEST_CELERY_BEAT_FITNEXUS.md). La precedente limitazione sul mancato riesame del task corretto attraverso Beat è superata; la consegna email reale rimane esclusa.

> Aggiornamento del 3 ottobre 2026: eseguito anche un [test di carico locale documentato](TEST_CARICO_FITNEXUS.md). I limiti relativi al carico descritti nel resoconto seguente si riferiscono al precedente collaudo funzionale.

## Stato delle correzioni

- **Permessi delle schede: RISOLTO e verificato.** Gli endpoint gestionali richiedono trainer o superutente prima di eseguire creazione, lettura, modifica, pubblicazione/ritiro e cancellazione. Cliente proprietario, altro cliente, utente solo staff e anonimo vengono respinti; la consultazione personale del proprietario rimane disponibile. Regressione: **99 controlli superati su SQLite e 99 su MySQL**, inclusa verifica di dati, feedback ed email invariati quando l'operazione è negata. Evidenze: [SQLite](prove-locali/fix-permissions-sqlite.json), [MySQL](prove-locali/fix-permissions-mysql.json). Nessun servizio esterno utilizzato; fixture annullate tramite transazione.
- **Task feedback: RISOLTO e verificato.** Il task settimanale seleziona ora `settimanale`; i record mensili senza scheda sono gestiti dalla funzione mensile. **24 controlli superati su SQLite e 24 su MySQL**: inviti dovuti oggi e ai limiti temporali, esclusione di futuri/scaduti fuori finestra/compilati, destinatari e template corretti, task complessivo senza eccezioni. Il token resta utilizzabile per la risposta. Evidenze: [SQLite](prove-locali/fix-feedback-sqlite.json), [MySQL](prove-locali/fix-feedback-mysql.json). Task eseguiti direttamente; il trasporto Redis/Beat già verificato non è stato ripetuto.
- **Questionario vuoto: RISOLTO e verificato.** L'API valida il payload prima di creare record: lista obbligatoria e non vuota, struttura delle voci valida, almeno una domanda con risposta non vuota. Campi facoltativi e placeholder vuoti del frontend rimangono compatibili. **26 controlli SQLite e 27 MySQL superati**, incluso il payload reale di 48 voci del precedente test browser e l'assenza di scritture per richieste non valide. Evidenze: [SQLite](prove-locali/fix-survey-sqlite.json), [MySQL](prove-locali/fix-survey-mysql.json). Questa correzione riguarda il questionario vuoto/malformato, non introduce una replica server di tutte le regole condizionali del frontend.
- **PDF tagliato: RISOLTO e verificato.** Orientamento coerente con il canvas, parametri a capo quando lo spazio è insufficiente e animazione disattivata nella copia esportata. Scaricati e ispezionati i PDF reali desktop e viewport 390×844: titolo, esercizio, tutti e cinque i parametri e descrizione completi. Controllo geometrico superato in entrambi i casi. Evidenze: [desktop](prove-locali/fix-pdf-desktop.pdf), [mobile](prove-locali/fix-pdf-mobile.pdf), [controlli](prove-locali/fix-pdf-results.json).
- **Questionario dopo errore/sessione scaduta: RISOLTO e verificato.** Il payload viene ordinato su una copia; il rinnovo viene atteso, condiviso tra richieste concorrenti e non ricorsivo. Il refresh non ruotato viene conservato. Se la sessione è scaduta, nuovo accesso nella stessa pagina senza perdere le risposte; cambio account azzera il questionario. **11 test mirati superati** e prova browser su MySQL: sessione scaduta, risposte intatte, nuovo login, rinnovo automatico e salvataggio HTTP 201 di 48 voci, navigazione a `/payment`. Evidenze: [risultati](prove-locali/fix-session-results.json), [HTTP](prove-locali/fix-session-http.log), [database](prove-locali/fix-session-db.json). Risposte conservate in memoria nella pagina aperta, non dopo ricaricamento manuale/chiusura.
- **Dipendenze di build: RISOLTO e verificato.** Rimosso soltanto `self==2020.12.3`, non utilizzato; requirements normalizzato in UTF-8. Opzioni PayPal tipizzate tramite `ScriptProviderProps["options"]` del pacchetto dichiarato, senza import interni. `.dockerignore` esclude dipendenze host, artefatti ed env locali. Entrambi i Dockerfile del progetto costruiti con successo; backend: `pip check` e controllo Django superati; frontend: `npm ci`, TypeScript attivo (anche `tsc --noEmit` superato), Nginx e HTTP 200 verificati con rete disattivata. Evidenze: [risultati](prove-locali/fix-build-results.json), [build backend](prove-locali/fix-build-backend.log), [build frontend](prove-locali/fix-build-frontend.log), [avvio frontend](prove-locali/fix-build-frontend-smoke.log).
- **Problematiche ancora aperte nel perimetro concordato: nessuna.**

I conteggi e le anomalie descritti nelle sezioni seguenti sono il **collaudo storico precedente alle correzioni**, non lo stato attuale. I report originali sono conservati come evidenza; tutti i sei FAIL API (`PERM-01`, `PERM-03`, `PERM-04`, `TASK-01`, `TASK-02`, `SURVEY-03`) sono ora risolti nelle regressioni mirate. Anche le problematiche frontend e build sono risolte nelle verifiche mirate riportate sopra.

Esecuzioni: 30 settembre – 2 ottobre 2026. Questo rapporto integra l'[analisi funzionale](ANALISI_FUNZIONALE.md), basata sull'ispezione dei sorgenti. Le sezioni 1–4 documentano la prima fase; le sezioni 5–7 completano gli esiti con Docker/MySQL e browser.

**Esito del collaudo iniziale (storico):** prove locali concluse nel perimetro descritto. Eseguiti i 37 casi API su SQLite e su MySQL, con 31 PASS e 6 FAIL in ciascun ambiente; tre controlli HTTP superati in ciascun ambiente. Completate inoltre le prove browser di login/logout, questionario, consultazione, modifica/pubblicazione scheda e feedback. Il PDF viene generato ma presenta un taglio del contenuto. Servizi esterni esclusi. Tutti i sei container QA sono stati fermati al termine, conservando il database.

## 1. Prima fase del 30 settembre: perimetro e modalità di avvio

Sono state eseguite prove sul codice backend originale, con dati fittizi e un ambiente di test separato. Le prove non attestano il funzionamento in produzione o il corretto comportamento dei servizi esterni.

**Docker Compose non è stato utilizzato per avviare l'applicazione.** Sono stati eseguiti `docker version`, `docker compose version`, `docker ps` e `docker compose -f docker-compose-dev.yml config --services`. Il client Docker 29.0.1 e Compose 2.40.3 erano installati, ma il daemon Docker Desktop Linux non era raggiungibile: la named pipe del motore non esisteva. La configurazione di sviluppo veniva letta e individuava i sei servizi, con un avviso sul campo `version` obsoleto.

Il virtualenv esistente del backend non era utilizzabile: cercava un interprete Python 3.8.10 non presente. Il Node nel PATH era 10.24.1 e la cartella `node_modules` era vuota. È stato quindi predisposto un ambiente locale dedicato.

| Componente | Modalità effettivamente utilizzata |
|---|---|
| Python | Runtime locale 3.12.14; dipendenze isolate in `.local-test-deps` |
| Django | 3.2.9, con viste, serializer, modelli e routing originali |
| Database | Nuovo file SQLite di prova, creato tramite le migrazioni del progetto; nessun import del backup |
| Test API | `rest_framework.test.APIClient`, senza simulare le viste o le operazioni database |
| Server backend | `runserver 127.0.0.1:8000 --noreload` con impostazioni QA |
| MySQL | Non avviato; differenze rispetto a SQLite non collaudate |
| Redis / Celery worker / Celery Beat | Non avviati; funzioni dei task chiamate direttamente e sincronicamente |
| MailerSend | Solo il metodo di invio sostituito con un raccoglitore locale; nessuna email trasmessa |
| Stripe e Vimeo | Esclusi dal collaudo |

Le dipendenze principali del backend sono nelle versioni indicate dal repository. L'ambiente Python e alcune dipendenze transitive differiscono dai container: l'elenco realmente installato è in [python-packages.txt](prove-locali/python-packages.txt). MailerSend 0.5.0 è stato installato senza le dipendenze di sviluppo che imponevano una versione di setuptools incompatibile con il runtime scelto.

Le impostazioni di test cambiano database, host ammessi, logging, chiave JWT di prova e configurazione Celery. I file applicativi non sono stati corretti per far passare i test. Il trasporto email restituisce normalmente un'accettazione simulata `202`; in un caso negativo restituisce `500`. Un blocco delle connessioni socket esterne impedisce ai test backend di contattare provider reali. Nel report automatico risultano **zero tentativi di connessione esterna**.

## 2. Dati e significato degli esiti

Sono stati utilizzati tre account fittizi: cliente, trainer e secondo cliente, con indirizzi nel dominio riservato `example.test`. Una scheda di prova contiene settimana, giorno, sezione e uno squat fittizio con serie, ripetizioni, recupero, carico e intensità. Sono state create anche richieste di feedback fittizie.

- **PASS**: il risultato osservato coincide con l'aspettativa del singolo scenario, compresi rifiuti attesi e simulazioni di errore.
- **FAIL**: la prova è stata eseguita e ha riprodotto un comportamento non conforme all'aspettativa funzionale indicata.
- **Escluso**: la funzione richiede un servizio esterno non incluso nella richiesta.
- **Non completato**: mancano una o più verifiche pratiche; non va interpretato come funzionamento confermato.

Le prove API comprendono **37 casi: 31 PASS e 6 FAIL**. Sono inoltre riuscite tre verifiche tramite HTTP reale sul server locale. I sei FAIL corrispondono a tre operazioni con permessi insufficienti, due scenari di automazione feedback e un caso di validazione questionario.

## 3. Esito per funzione richiesta

### Registrazione

**Eseguito:** invio dei dati obbligatori a `/auth/register/`, ripetizione con stesso account, invio di dati incompleti.

**Osservato:** creazione con HTTP 201; account inizialmente non verificato; duplicati e dati incompleti respinti con HTTP 400. La registrazione ha generato un messaggio raccolto localmente contenente il token di attivazione.

**Esito:** superata lato API. Non è stata verificata la consegna email. Evidenze `REG-01`–`REG-03`.

### Verifica email

**Eseguito:** recupero del token effettivamente generato dalla registrazione nell'outbox locale e richiesta all'API di verifica; ulteriori richieste con token errato e scaduto.

**Osservato:** token valido → HTTP 200 e `is_verified=True` nel database; token errato/scaduto → HTTP 400. Il messaggio informativo successivo è stato intercettato localmente.

**Esito:** superata la logica locale di attivazione, senza aprire una casella email o contattare MailerSend. Evidenze `EMAIL-01`–`EMAIL-03`.

### Login e sessione

**Eseguito:** login prima/dopo l'attivazione, password errata, accesso con username, rinnovo JWT, logout via API e riutilizzo del refresh revocato. Ripetuto il login via HTTP loopback.

**Osservato:** HTTP 401 prima della verifica e con credenziali errate; HTTP 200 con email o username corretti; access e refresh restituiti. L'API di rinnovo restituisce soltanto `access`. Il logout API restituisce 204 e il refresh revocato viene respinto con 401.

**Esito:** superata la logica server. Il rinnovo automatico dell'interfaccia non è dimostrato da questi test: dipende dall'interceptor frontend. Evidenze `AUTH-01`–`AUTH-06` e [http-results.json](prove-locali/http-results.json).

### Questionario

**Eseguito:** invio senza autenticazione, salvataggio autenticato di un insieme ridotto di risposte fittizie e invio autenticato di una lista vuota.

**Esito aggiornato dopo correzione:** senza autenticazione HTTP 401; risposte valide salvate con HTTP 201; `{"survey": []}` e payload malformati respinti con HTTP 400 prima di qualsiasi scrittura.

**Esito:** `SURVEY-03` risolto. Salvataggio e rifiuto dei payload vuoti/malformati verificati; le risposte facoltative vuote restano accettate insieme a risposte compilate. La verifica non attesta l'applicazione server di tutte le domande obbligatorie/condizionali del frontend. Vedere le regressioni nello stato delle correzioni.

### Pagamento

**Eseguito:** nessuna transazione e nessuna chiamata Stripe. Non è stato simulato un pagamento riuscito per dichiarare collaudato il provider.

**Esito:** escluso, come richiesto. La presenza delle schede di prova deriva da fixture e operazioni locali, non da un acquisto.

### Creazione, modifica, pubblicazione e ritiro schede

**Eseguito:** creazione mediante account trainer, verifica dell'inaccessibilità della bozza al cliente, pubblicazione, consultazione, aggiornamento delle ripetizioni da 10 a 12, ritiro e nuova pubblicazione.

**Osservato:** creazione HTTP 201; altre operazioni HTTP 200. Bozza e scheda ritirata non restituite al cliente (404). La prima pubblicazione ha creato una richiesta di feedback; notifiche intercettate localmente. La lettura HTTP finale mostra le 12 ripetizioni aggiornate.

**Esito:** percorso principale verificato lato API. Evidenze `FORM-01`–`FORM-10` e `http-results.json`.

**Corretto e verificato:** un cliente ordinario riceve ora 403 su creazione, modifica, pubblicazione/ritiro, lettura gestionale e cancellazione; le prove verificano anche l'assenza di effetti sul database e sulle notifiche. Trainer e superutente mantengono le operazioni consentite. I precedenti `PERM-01`, `PERM-03`, `PERM-04` sono risolti; vedere i report di regressione nello stato delle correzioni.

### Consultazione

**Eseguito:** lettura della scheda pubblicata del cliente, controllo dei parametri restituiti, richiesta di un secondo cliente attraverso l'API personale, richiesta anonima. Ripetuta la consultazione via HTTP reale con token ottenuto dal login.

**Osservato:** il proprietario riceve la gerarchia e i parametri corretti; il secondo cliente riceve 404 dall'API personale; la richiesta anonima riceve 401.

**Esito:** lettura delle API personali verificata. Questo risultato non annulla i problemi degli endpoint gestionali descritti sopra.

### Video

**Eseguito:** nessun upload o streaming. L'esercizio di prova usa un riferimento video vuoto.

**Esito:** Vimeo escluso. Non è possibile dichiarare verificata la riproduzione in base alla sola consultazione dei dati dell'esercizio.

### PDF — completamento nella seconda fase

Non testabile mediante le API Django, perché la generazione avviene nel browser. La prova pratica è ora completata e descritta nella sezione 5: file generato, ma impaginazione non corretta.

### Feedback

**Eseguito:** verifica token, invio di cinque risposte, nuovo invio con lo stesso token, token inesistente e simulazione di errore del trasporto email.

**Osservato:** token valido HTTP 200; invio con accettazione email simulata HTTP 202; riutilizzo e token inesistente HTTP 400. Quando il trasporto restituisce 500, l'API restituisce 500, conserva le risposte e lascia `inviato=False`.

**Esito:** compilazione e controllo del riutilizzo verificati lato API. Il PASS del caso con errore email significa che è stato osservato l'errore previsto, non che un invio sia riuscito. Evidenze `FEED-01`–`FEED-05`.

**Automazioni corrette:** gli inviti settimanali vengono ora generati e il task complessivo gestisce anche i feedback mensili senza scheda. `TASK-01` e `TASK-02` sono risolti; vedere le regressioni nello stato delle correzioni. Lo scheduling reale, già verificato nella seconda fase descritta sotto, non è stato ripetuto per questa modifica al filtro applicativo.

## 4. Registro automatico e riproducibilità

- [Risultati dei 37 casi API](prove-locali/api-results.json): aspettativa, risposta osservata e dettagli.
- [Risultati HTTP](prove-locali/http-results.json): login, consultazione e rifiuto anonimo sul server in ascolto.
- [Dipendenze Python installate](prove-locali/python-packages.txt).
- [Istruzioni di riproduzione](../qa/local/README.md).

I dati riservati degli eventuali ambienti reali, il backup SQL e i log storici non sono stati utilizzati come fixture. Il registro email e i token di prova restano nella cartella temporanea ignorata da Git.

## 5. Verifiche frontend

Prove svolte l'1 e 2 ottobre nel browser integrato, su `http://localhost:3000`, con API su `http://localhost:8000`, Nginx/Gunicorn/MySQL della configurazione QA. Interazioni tramite pulsanti e campi reali; nessuna iniezione di token o modifica del codice frontend.

| Funzione | Azione eseguita | Risultato osservato | Esito e limiti |
|---|---|---|---|
| Accesso anonimo | Apertura area personale senza login | Richiesta di accedere o registrarsi | PASS |
| Login cliente | Password errata, poi credenziali valide dell'account fittizio | Primo tentativo non accede; secondo mostra «Il tuo percorso» e la scheda | PASS; messaggio transitorio del primo tentativo non conservato |
| Logout | Pulsante Logout nell'area personale | Ricompare la richiesta di autenticazione | PASS interfaccia; revoca refresh verificata separatamente via API |
| Consultazione | Apertura «Scheda QA aggiornata» | Settimana/giorno, squat, 3 serie, 12 ripetizioni, recupero 1m 0s, carico e descrizione visibili | PASS sulla fixture di un giorno |
| Questionario incompleto | Passaggio alla pagina 6 e tentativo d'invio | Invio bloccato con alert per domanda obbligatoria mancante | PASS |
| Navigazione questionario | Apertura delle sei pagine; selettori, slider e campi fittizi | Pagine e controlli utilizzabili; risposte conservate durante la navigazione | PASS sul percorso provato; video non aperti, immagine non caricata |
| Questionario dopo interruzione | Ripresa della scheda aperta il giorno precedente, completamento campo mancante e invio | HTTP 401; nessun passaggio al pagamento. Dopo l'errore alcune etichette risultano vuote o associate ad altre domande | RISOLTO: prova mirata con scadenze QA brevi, nuovo accesso e reinvio riusciti |
| Questionario con nuova autenticazione | Nuovo login cliente, compilazione campi obbligatori con dati fittizi e invio | Salvataggio di 48 voci in MySQL; valori verificati: altezza 175, peso 70, attività attuale no, luogo Casa. Navigazione a `/payment` | PASS salvataggio. Campi facoltativi lasciati vuoti; percorso interrotto prima di qualsiasi pagamento |
| Gestionale trainer | Login trainer, selezione cliente e scheda fittizia esistente, modifica nome in «Scheda QA browser», Salva | Nome aggiornato nel database | PASS; creazione da zero già collaudata via API, non ripetuta nel browser |
| Pubblicazione dal gestionale | Pulsante Pubblica sulla scheda fittizia modificata | Pulsante diventa Ritira; `published=True` in MySQL | PASS; notifiche raccolte localmente |
| Feedback | Compilazione dei cinque campi e Invio | Tutte le risposte persistite e `inviato=True`; ricaricando il link appare «Token non valido» | PASS; consegna email esclusa |
| PDF | Pulsante Scarica PDF nella scheda cliente | File realmente scaricato, apribile, di una pagina; taglio della parte destra | RISOLTO: nuove esportazioni desktop/mobile complete; il taglio descritto è storico |
| Video | Controllo presenza dei comandi nelle pagine; esercizio della fixture senza video | Nessun upload, apertura o streaming eseguito | Esclusi i provider esterni; riproduzione non attestata |

### Evidenza e diagnosi del PDF

Il file [scheda-esportata.pdf](prove-locali/scheda-esportata.pdf) è stato prodotto dall'applicazione, non ricostruito con strumenti esterni. Dimensione 492436 byte; produttore jsPDF 2.5.1; una pagina di 280 × 776 punti. Il rendering ispezionato mostra titolo e parte dell'esercizio, ma taglia il lato destro, inclusi parametri che sono invece visibili nella [schermata originale](prove-locali/scheda-browser.png). Evidenza visiva: [rendering del PDF](prove-locali/scheda-pdf.png).

Il codice originale forzava `orientation: "portrait"` e usa le dimensioni del canvas per aggiungere l'immagine. La discordanza tra orientamento verticale della pagina e contenuto largo è coerente con il taglio osservato; la correzione è ora verificata nei nuovi [rendering desktop](prove-locali/fix-pdf-desktop.png) e [mobile](prove-locali/fix-pdf-mobile.png), con immagine interamente contenuta nella pagina. Sono stati corretti anche overflow dei parametri e animazione nella copia del DOM usata per il PDF. Il documento esporta il giorno selezionato, non dimostra l'esportazione di un intero programma. L'attesa automatica dell'evento download è scaduta, ma il file effettivamente creato nella cartella Download è stato trovato tramite nome/data e ispezionato: non è stato classificato come fallimento del download.

### Evidenza del questionario dopo errore

La [schermata dell'errore](prove-locali/questionario-401.png) documenta il percorso dopo l'interruzione. Nel codice originale, prima dell'invio veniva ordinato in-place `userForm`, mentre le domande vengono visualizzate attraverso indici fissi. Il cambio di etichette dopo una richiesta fallita è coerente con questa mutazione. La nuova prova con autenticazione fresca ha distinto questo problema dal normale salvataggio, che è riuscito. Quella prova era storica. Per verificare la correzione, solo il backend QA ha emesso token con accesso 5 secondi e refresh 25 secondi; dopo il 401 sono state verificate [le risposte conservate](prove-locali/fix-session-answers.txt). Con refresh QA di 600 secondi, il nuovo [accesso senza ricaricamento](prove-locali/fix-session-reauthenticated.txt) e il rinnovo automatico hanno portato a salvataggio e navigazione al pagamento. Nessuna modifica manuale ai token nel browser; nessuna chiamata a provider di pagamento.

Persistenza delle azioni browser: [browser-db-results.json](prove-locali/browser-db-results.json). Non tutti gli scenari API sono stati duplicati nel browser: registrazione e attivazione email restano verificate a livello API con token reale e outbox locale.

## 6. Docker Compose: configurazione effettiva ed esiti

**Sì, nella seconda fase è stato utilizzato Docker Compose e tutti e sei i componenti sono stati avviati.** È essenziale distinguere il tentativo della configurazione originale dalla configurazione QA effettivamente usata.

### Tentativo iniziale (storico) e successiva correzione

Comando: `docker compose -f docker-compose-dev.yml build backend`. Il primo tentativo si è fermato sul reperimento di `gunicorn`; ripetendo il download quel pacchetto è stato trovato, ma la build si è fermata su `self==2020.12.3` (`No matching distribution found`). L'immagine originale non è stata quindi costruita con successo. Non si dichiara collaudato un avvio integrale e invariato di `docker-compose-dev.yml`.

Anche la compilazione frontend ha richiesto un adattamento di collaudo. Dipendenze installate con pnpm, Node 24.19.0: il primo errore era la configurazione ESLint `react-app` non risolta. Con `DISABLE_ESLINT_PLUGIN=true`, come già previsto nel Dockerfile frontend originale, è emerso TS2307 sull'import `@paypal/paypal-js/types/script-options`. Il bundle è stato prodotto con `TSC_COMPILE_ON_ERROR=true` e `GENERATE_SOURCEMAP=false`. Questa build con warning consente le prove locali, ma non attesta una build standard senza errori. Il Dockerfile frontend originale non è stato compilato integralmente.

**Verifica attuale della correzione:** `docker build -f docker/backend/Dockerfile -t fitnexus-backend-buildcheck:local .` e `docker build -f docker/nginx/Dockerfile -t fitnexus-frontend-buildcheck:local .` completati con exit 0. Non è stato necessario tollerare errori TypeScript; ESLint resta disabilitato come nel Dockerfile preesistente. Dipendenze npm installate da package-lock senza modifiche. Controlli runtime isolati: backend `pip check`/Django check e frontend `nginx -t`/GET locale 200. Non equivale a un avvio della configurazione originale con servizi e credenziali reali. Rimangono warning non bloccanti (source map di una dipendenza, Browserslist, Babel, dimensione bundle); `npm ci` ha inoltre segnalato 82 vulnerabilità nelle dipendenze. Il loro aggiornamento e un audit di sicurezza non fanno parte delle anomalie funzionali corrette.

### Configurazione QA usata

File: [docker-compose.qa.yml](../qa/local/docker-compose.qa.yml), progetto `fitnexus-qa`. Immagine backend dedicata `fitnexus-backend-qa:local`, Python 3.8, dipendenze applicative principali nelle versioni del repository, insieme di requisiti ridotto al necessario per queste prove. Versioni effettive in [python-docker-packages.txt](prove-locali/python-docker-packages.txt).

| Componente | Avvio e verifica effettiva |
|---|---|
| MySQL 8 | Volume QA nuovo; migrazioni originali eseguite; stato healthy; 37 casi API eseguiti sul database MySQL |
| Redis | Container attivo, `redis-cli ping` → PONG; trasporto del task Celery verificato |
| Backend | Gunicorn 23.0.0, due worker con due thread; login e consultazione attraverso HTTP reale |
| Nginx | Bundle React locale e proxy API; porte pubblicate solo su loopback 3000 e 8000; utilizzato dalle prove browser |
| Celery worker | Avviato con concorrenza 1; inspect ping → pong; task ricevuto ed eseguito attraverso Redis |
| Celery Beat | DatabaseScheduler attivo; timer QA di 10 secondi effettivamente inviato al worker |

La rete `offline` è interna per database, backend e processi Celery. Solo Nginx ha anche una rete di ingresso: serve file e inoltra richieste al backend locale. La CSP blocca script Stripe, frame Vimeo e risorse esterne nel browser. Il trasporto MailerSend è sostituito dal raccoglitore locale. Non vengono caricati gli env file reali, usate credenziali reali o importati backup. Gli errori Stripe.js dovuti alla CSP sono intenzionali e non sono prove sul provider.

Nel bootstrap Docker il controllo socket loopback è sostituito dall'isolamento della rete interna, necessario per comunicare con MySQL e Redis. Per questo il campo `external_network_attempts` vuoto del report Docker non è un contatore di traffico esterno monitorato. Il download delle dipendenze e delle immagini ha richiesto Internet durante la preparazione; non equivale a provare le integrazioni applicative.

Durante il primo avvio dei sei servizi il motore Docker si è arrestato (502 seguito da named pipe assente). Riavviato Docker Desktop, tutti i servizi sono partiti. Le porte su una rete soltanto interna non erano raggiungibili dal browser: è stato aggiunto l'ingresso tramite Nginx, mantenendo backend e worker isolati.

### Risultati MySQL e automazioni

I [37 casi su MySQL](prove-locali/api-docker-results.json) confermano esattamente i 31 PASS e 6 FAIL su SQLite: validazione questionario vuoto, tre operazioni gestionali consentite al cliente ordinario, invito settimanale non generato e errore del task complessivo. I [tre controlli HTTP Docker](prove-locali/http-docker-results.json) sono superati.

Il task reale `scheda_tutorial.tasks.my_task`, inviato al worker, termina in FAILURE con `AttributeError: 'NoneType' object has no attribute 'user'`. I [log di Celery](prove-locali/celery-docker.log) mostrano sia l'invio periodico di Beat sia ricezione ed errore nel worker. L'infrastruttura di scheduling è verificata; l'automazione funzionale del feedback non è corretta.

Alla prima osservazione il timer aveva registrato 9 invii. La sua disabilitazione iniziale tramite aggiornamento diretto del database non ha notificato il cambiamento a Beat, che ha continuato a inviare il task. La raccolta finale mostra 441 esecuzioni contabilizzate, che non rappresentano necessariamente il totale dei messaggi nei log. Si tratta di un limite dello script QA, non di un ulteriore difetto dell'applicazione. Al termine la disabilitazione è stata ripetuta tramite `save()` con notifica allo scheduler e tutti i container QA sono stati fermati. Nessun messaggio è stato inviato a provider esterni.

Stato durante le prove: [docker-status.txt](prove-locali/docker-status.txt). Stato dopo l'arresto: [docker-status-finale.txt](prove-locali/docker-status-finale.txt). Volume e fixture conservati; nessun servizio lasciato intenzionalmente attivo per questo collaudo.

## 7. Limiti e attività successive

Non restano prove avviate in sospeso. Restano esclusi Stripe/PayPal, consegna email reale, upload/streaming Vimeo e altre integrazioni esterne. Non sono coperti test esaustivi di ogni combinazione del questionario, tutti i dispositivi/browser, programmi di più settimane nel PDF, carico o deploy di produzione.

Tutte le sei fasi di correzione sono completate e verificate. Nessuna attività del perimetro concordato rimane da riprendere. I container QA sono stati fermati conservando volume e fixture: [stato finale delle correzioni](prove-locali/fix-docker-status-finale.txt). Le verifiche già concluse non vanno ripetute senza nuove modifiche che le riguardino. Gli avvisi sulle dipendenze indicati sopra restano distinti dagli errori di build risolti.


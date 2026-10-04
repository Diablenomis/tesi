# FitNexus — Ambiente, modalità ed esiti del collaudo locale

> Aggiornamento Vimeo del 4 ottobre 2026: **upload reale riuscito**, 9 controlli locali superati, video pubblico su autorizzazione, play/pausa verificati nel player separato e **riproduzione dentro la scheda confermata manualmente dall'utente**. Il percorso Vimeo concordato è completato. Il riquadro vuoto osservato nel browser automatico resta documentato come limite della verifica automatica. Vedere [rapporto Vimeo](TEST_VIMEO_FITNEXUS.md); le esclusioni Vimeo nelle sezioni storiche seguenti sono superate per questo percorso.

> Aggiornamento Stripe del 3 ottobre 2026: **sei primi pagamenti Sandbox riusciti e verificati**, con 18 webhook HTTP 200 e corretti effetti locali. [Rapporto dedicato](TEST_PAGAMENTI_STRIPE.md). Le conferme sono state eseguite manualmente dall'utente; il recapito email reale e il ciclo completo degli abbonamenti restano esclusi. Due difetti non bloccanti nei nomi visualizzati delle email sono annotati nel rapporto.

> Verifica aggiuntiva del 3 ottobre 2026: il task feedback corretto è stato eseguito tramite **Celery Beat → Redis → worker**, con stato **SUCCESS** e 10 controlli superati. Vedere [test Celery Beat](TEST_CELERY_BEAT_FITNEXUS.md). La precedente limitazione sul mancato riesame del task corretto attraverso Beat è superata; la consegna email reale rimane esclusa.

> Aggiornamento del 3 ottobre 2026: eseguito anche un [test di carico locale documentato](TEST_CARICO_FITNEXUS.md). I limiti relativi al carico descritti nel resoconto seguente si riferiscono al precedente collaudo funzionale.

Documento redatto il **3 ottobre 2026**, sulla base delle prove svolte dal **30 settembre al 2 ottobre 2026** e delle successive verifiche delle correzioni. La redazione non ha comportato una nuova esecuzione dei test.

Questo resoconto descrive ciò che è stato effettivamente provato. Distingue le anomalie iniziali, le correzioni verificate e le integrazioni escluse. Il registro tecnico completo è [ESITO_PROVE_LOCALI.md](ESITO_PROVE_LOCALI.md); le evidenze originali sono conservate nella cartella `prove-locali`.

## 1. Ambiente utilizzato

| Informazione | Ambiente effettivo |
|---|---|
| Macchina | PC locale dell’utente, repository in `D:\Desktop\UniMarconi\TESI`. Nessuna VM Linux remota utilizzata. |
| Sistema operativo host | Windows a 64 bit, shell PowerShell. Edizione e build Windows non rilevate con certezza. |
| Container Linux | Docker Desktop con motore Linux basato su WSL2. Il log del controllo finale Nginx riporta `Linux 6.18.40.1-microsoft-standard-WSL2`. Questo è il kernel dell’ambiente container, non il sistema operativo host. |
| RAM e CPU | Non rilevate. Non sono disponibili misure delle risorse assegnate a Docker né del consumo durante le prove. |
| Strumenti Docker | Client Docker 29.0.1 e Docker Compose 2.40.3 rilevati nel collaudo iniziale. |
| Prima fase, senza container | Python 3.12.14 locale, Django 3.2.9, dipendenze isolate, database SQLite di prova. Backend su `127.0.0.1:8000`. |
| Seconda fase, con container | Python 3.8, Django 3.2.9, Gunicorn 23.0.0, MySQL 8, Redis, Celery worker, Celery Beat e Nginx. |
| Frontend e browser | Browser integrato su `http://localhost:3000`, API su `http://localhost:8000`. Bundle QA iniziale costruito con Node 24.19.0/pnpm; build finale verificata con Node 18 Alpine e `npm ci` nel Dockerfile del progetto. |
| Dati | Account fittizi nel dominio `example.test`, schede ed esercizi di prova. Nessun backup di esercizio importato e nessuna credenziale reale utilizzata per i test. |

Evidenze: [pacchetti della prima fase](prove-locali/python-packages.txt), [pacchetti Docker QA](prove-locali/python-docker-packages.txt), [log Nginx finale](prove-locali/fix-build-frontend-smoke.log).

## 2. Modalità di avvio

**Docker Compose è stato utilizzato nella seconda fase.** Inizialmente il motore Docker Desktop non era raggiungibile: le prime prove sono state eseguite direttamente su Windows, usando SQLite e il server Django locale. In questa prima fase MySQL, Redis, worker e Beat non erano avviati; le funzioni dei task venivano chiamate direttamente.

La configurazione effettivamente usata per il collaudo con container è [qa/local/docker-compose.qa.yml](../qa/local/docker-compose.qa.yml), progetto `fitnexus-qa`. Per avviare l’ambiente già predisposto è stato utilizzato il comando:

```powershell
docker compose -f qa/local/docker-compose.qa.yml up -d --no-build
```

Il volume MySQL QA era stato preparato con le migrazioni e dati fittizi. Il comando precedente riutilizza tale ambiente; non sostituisce la preparazione iniziale di un database vuoto.

| Componente | Avvio e verifica |
|---|---|
| MySQL | Avviato, stato `healthy`, database QA su volume persistente. Prove API e browser eseguite su questo database. |
| Redis | Avviato; risposta `PONG` al controllo e trasporto dei messaggi Celery osservato. |
| Backend | Gunicorn con due worker e due thread; richieste HTTP reali di login, questionario e consultazione. |
| Nginx | Servizio del bundle React e proxy API; porte pubblicate esclusivamente su loopback, 3000 e 8000. |
| Celery worker | Avviato con concorrenza 1; risposta al ping e ricezione/esecuzione del task osservate. |
| Celery Beat | Avviato con DatabaseScheduler; invio periodico del task QA ogni 10 secondi osservato. |

**Tutti e sei i componenti sono stati contemporaneamente attivi durante il collaudo Docker.** Durante le successive correzioni browser erano necessari soltanto MySQL, Redis, backend e Nginx; worker e Beat sono rimasti spenti. Al termine tutti i container QA sono stati fermati, conservando il volume e le fixture.

La configurazione QA usa una rete interna per database, backend e processi Celery. Nginx dispone anche della rete di ingresso. Le email sono intercettate localmente e la CSP del browser blocca script Stripe, frame Vimeo e risorse esterne.

**Distinzione dalla configurazione originale:** è stato tentato `docker-compose-dev.yml`, ma la build backend iniziale si bloccava su una dipendenza non disponibile. Dopo le correzioni sono stati costruiti con successo entrambi i Dockerfile del progetto. Non è stato eseguito un collaudo integrale della configurazione originale con i suoi env file e servizi esterni reali.

Evidenze: [sei servizi attivi](prove-locali/docker-status.txt), [stato finale dopo le correzioni](prove-locali/fix-docker-status-finale.txt), [risultati delle build](prove-locali/fix-build-results.json).

## 3. Funzionalità provate ed esiti

Le prove API usano il routing e le operazioni database dell’applicazione; non sono simulazioni delle viste. Le prove browser usano campi e pulsanti reali. La simulazione riguarda esclusivamente il trasporto email e gli scenari di errore dichiarati.

### 3.1 Registrazione

**Funzione:** registrazione di un nuovo utente, verificata tramite API su SQLite e MySQL.  
**Operazioni:** invio dei dati obbligatori a `/auth/register/`, ripetizione con lo stesso account e invio di dati incompleti.  
**Risultato:** creazione con HTTP 201 e account inizialmente non verificato; duplicati e dati incompleti respinti con HTTP 400. Generato il messaggio di attivazione, raccolto nell’outbox locale.  
**Problemi:** nessuna anomalia osservata nei casi provati. Non sono state provate la registrazione tramite interfaccia browser né la consegna del messaggio a una casella reale.  
**Evidenza:** casi `REG-01`–`REG-03` nei [risultati API MySQL](prove-locali/api-docker-results.json) e nei [risultati SQLite](prove-locali/api-results.json).

### 3.2 Verifica email

**Funzione:** attivazione dell’account mediante token, verificata tramite API.  
**Operazioni:** recupero del token effettivamente generato dalla registrazione nell’outbox locale; richiesta di verifica con token valido, errato e scaduto.  
**Risultato:** token valido → HTTP 200 e `is_verified=True`; token errato/scaduto → HTTP 400. Anche il messaggio successivo all’attivazione è stato intercettato localmente.  
**Problemi:** nessuna anomalia nella logica di attivazione provata. Non è stato aperto un link ricevuto in una casella email reale.  
**Evidenza:** casi `EMAIL-01`–`EMAIL-03` nei [risultati API MySQL](prove-locali/api-docker-results.json).

### 3.3 Login e logout

**Funzione:** autenticazione e uscita, verificate tramite API, HTTP e browser.  
**Operazioni:** login prima e dopo l’attivazione, password errata, login con email e username; apertura del profilo cliente e logout dal browser. Separatamente, logout API e riutilizzo del refresh token revocato.  
**Risultato:** HTTP 401 con account non verificato o password errata; HTTP 200 con credenziali valide. Nel browser il cliente accede al proprio percorso e alla scheda; dopo Logout ricompare la richiesta di autenticazione. Logout API → HTTP 204; refresh revocato → HTTP 401.  
**Problemi:** nessuna anomalia nei casi descritti. Il rinnovo automatico frontend presentava invece il difetto descritto e risolto nella prova 3.5. La revoca del refresh è attestata dal test API separato, non dalla sola scomparsa del profilo nel browser.  
**Evidenza:** `AUTH-01`–`AUTH-06` nei [risultati API](prove-locali/api-docker-results.json); [login HTTP](prove-locali/http-docker-results.json).

### 3.4 Questionario: compilazione, validazione e salvataggio

**Funzione:** questionario per la scheda personalizzata.  
**Operazioni:** invio anonimo e autenticato tramite API; invio di lista vuota e payload malformati. Nel browser: apertura delle sei pagine, uso di campi, selettori e slider, tentativo d’invio incompleto e successiva compilazione dei campi obbligatori con dati fittizi.  
**Risultato:** richiesta anonima respinta con 401; questionario valido salvato con 201. Nel browser la domanda obbligatoria mancante blocca l’invio; la compilazione completa salva 48 voci in MySQL e porta a `/payment`. Le risposte restano disponibili durante la navigazione tra le pagine.  
**Problemi:** inizialmente l’API accettava un questionario vuoto. Correzione verificata: input vuoti/malformati respinti con 400 senza scritture; campi facoltativi vuoti compatibili con un questionario compilato. Superati 26 controlli SQLite e 27 MySQL. Non sono state verificate tutte le combinazioni condizionali né il caricamento di un’immagine; la validazione server non replica tutte le regole obbligatorie del frontend.  
**Evidenza:** [salvataggio browser](prove-locali/browser-db-results.json), [regressione SQLite](prove-locali/fix-survey-sqlite.json), [regressione MySQL](prove-locali/fix-survey-mysql.json).

### 3.5 Questionario dopo errore o sessione scaduta

**Funzione:** recupero della compilazione e reinvio.  
**Operazioni:** inizialmente ripresa di una pagina rimasta aperta dal giorno precedente. Dopo la correzione: test frontend mirati e prova browser con token emessi dal solo backend QA a durata breve; scadenza completa, nuovo accesso nella stessa pagina e reinvio con access token nuovamente scaduto. Nessuna iniezione manuale di token nel browser.  
**Risultato:** dopo il 401 le etichette e le risposte restano intatte; il nuovo login non ricarica la pagina. Il successivo invio rinnova automaticamente l’access token, salva 48 voci e porta a `/payment`. Gli 11 test frontend comprendono errore di rete, richieste concorrenti, refresh rifiutato e cambio account.  
**Problemi:** inizialmente l’ordinamento modificava lo stato del questionario e il rinnovo del token non veniva atteso correttamente. Entrambi corretti e verificati. Le risposte sono conservate in memoria nella pagina aperta: non è stata introdotta una bozza persistente che sopravviva alla chiusura o alla ricarica manuale. Le durate QA brevi sono state ripristinate ai valori normali.  
**Evidenza:** [risultati](prove-locali/fix-session-results.json), [risposte dopo il 401](prove-locali/fix-session-answers.txt), [database](prove-locali/fix-session-db.json). Estratto del [log HTTP](prove-locali/fix-session-http.log), reinvio del 2 ottobre alle 16:42:31 UTC:

```text
POST /survey/send/        401
POST /auth/token/refresh/ 200
POST /survey/send/        201
```

### 3.6 Pagamento

**Funzione:** pagamento mediante provider esterno.  
**Operazioni:** verificata soltanto la navigazione a `/payment` dopo il salvataggio del questionario. Nessuna transazione, conferma di pagamento o chiamata al provider eseguita.  
**Risultato:** raggiunta la pagina; pagamento escluso dal collaudo. Le schede disponibili ai clienti di prova derivano da fixture e operazioni locali, non da acquisti.  
**Problemi:** esito del pagamento non determinabile. Il blocco di Stripe.js imposto dalla CSP QA è intenzionale e non è un difetto dimostrato del provider. Non sono attestati checkout, webhook, attivazione di acquisti o rimborsi.  
**Evidenza:** destinazione `/payment` nei [risultati della prova di sessione](prove-locali/fix-session-results.json); perimetro di isolamento nel [rapporto tecnico](ESITO_PROVE_LOCALI.md).

### 3.7 Creazione e modifica delle schede

**Funzione:** gestione di una scheda personalizzata da parte del trainer.  
**Operazioni:** creazione via API di una scheda con settimana, giorno, sezione ed esercizio; modifica delle ripetizioni da 10 a 12. Nel browser: accesso trainer, selezione del cliente e di una scheda esistente, modifica del nome in «Scheda QA browser» e salvataggio.  
**Risultato:** creazione HTTP 201, aggiornamento HTTP 200; parametri aggiornati restituiti nella consultazione e nome modificato nel database.  
**Problemi:** il percorso autorizzato ha funzionato. Inizialmente alcuni endpoint gestionali permettevano operazioni anche al cliente ordinario: problema corretto, come documentato nella prova 3.9. La creazione da zero è stata verificata via API, non ripetuta nel browser.  
**Evidenza:** `FORM-01` e `FORM-07` nei [risultati API](prove-locali/api-docker-results.json); [modifica browser persistita](prove-locali/browser-db-results.json).

### 3.8 Pubblicazione, ritiro e ripubblicazione

**Funzione:** disponibilità della scheda al cliente.  
**Operazioni:** come trainer, pubblicazione della scheda, ritiro e ripubblicazione via API; come cliente, richiesta della bozza e della scheda pubblicata/ritirata. Nel browser trainer, pressione del pulsante Pubblica.  
**Risultato:** operazioni gestionali HTTP 200; bozza e scheda ritirata non accessibili al cliente (404); scheda pubblicata consultabile. La prima pubblicazione crea una richiesta di feedback. Nel browser il pulsante cambia in Ritira e il database contiene `published=True`.  
**Problemi:** nessuna anomalia residua nei casi verificati dopo la correzione dei permessi. Le notifiche sono state raccolte localmente; nessuna consegna email reale verificata.  
**Evidenza:** `FORM-02`, `FORM-03`, `FORM-08`–`FORM-10` nei [risultati API](prove-locali/api-docker-results.json); [stato di pubblicazione dal browser](prove-locali/browser-db-results.json).

### 3.9 Permessi gestionali delle schede

**Funzione:** separazione delle operazioni consentite a cliente, trainer e amministratore.  
**Operazioni:** dopo la correzione, richieste di creazione, lettura gestionale, modifica, pubblicazione/ritiro e cancellazione con cliente proprietario, altro cliente, utente solo staff, trainer, superutente e anonimo; controllo degli effetti su dati, feedback e notifiche.  
**Risultato:** 99 controlli SQLite e 99 MySQL superati. Trainer e superutente autorizzati; clienti, utente solo staff e anonimo respinti per le operazioni gestionali. Le operazioni negate non modificano i dati né generano notifiche; resta disponibile la consultazione personale autorizzata.  
**Problemi:** i precedenti accessi gestionali indebiti del cliente sono stati corretti. Nessuna anomalia residua nella matrice di casi provata.  
**Evidenza:** [regressione SQLite](prove-locali/fix-permissions-sqlite.json), [regressione MySQL](prove-locali/fix-permissions-mysql.json).

### 3.10 Consultazione della scheda

**Funzione:** consultazione da parte del cliente proprietario.  
**Operazioni:** lettura API e HTTP della scheda pubblicata; apertura nel browser di «Scheda QA aggiornata». Richieste separate da un secondo cliente e da utente anonimo.  
**Risultato:** gerarchia settimana/giorno/sezione ed esercizio consultabili. Visibili squat, 3 serie, 12 ripetizioni, recupero 1m 0s, carico, intensità e descrizione. Secondo cliente → 404 dall’API personale; anonimo → 401.  
**Problemi:** nessuno osservato sulla fixture di un giorno. Non è un collaudo esaustivo di tutte le possibili strutture di programma.  
**Evidenza:** [risposta HTTP con parametri](prove-locali/http-docker-results.json), [schermata della scheda](prove-locali/scheda-browser.png).

### 3.11 Video

**Funzione:** video associati agli esercizi e contenuti Vimeo.  
**Operazioni:** osservata la presenza dei comandi nelle pagine. Nessuna apertura del player, riproduzione, richiesta di streaming o upload; l’esercizio fittizio ha riferimento video vuoto.  
**Risultato:** riproduzione video non verificata.  
**Problemi:** nessuna conclusione sul funzionamento o meno di Vimeo; integrazione esclusa.  
**Evidenza:** campo `video: ""` nella [scheda restituita via HTTP](prove-locali/http-docker-results.json). Non è disponibile una schermata che dimostri una riproduzione riuscita.

### 3.12 Esportazione PDF

**Funzione:** esportazione del giorno selezionato dalla scheda cliente.  
**Operazioni:** pressione dei pulsanti Scarica PDF/Esporta PDF; apertura e rendering dei file realmente scaricati. Dopo la correzione, nuova esportazione desktop e con viewport 390×844; controllo visivo e verifica geometrica della pagina.  
**Risultato:** file apribili, di una pagina, con titolo, esercizio, cinque parametri e descrizione completi in entrambe le dimensioni provate. L’immagine esportata è contenuta nei limiti della pagina.  
**Problemi:** inizialmente il lato destro era tagliato; sul viewport stretto i parametri superavano anche la larghezza della scheda. Corretti orientamento, disposizione dei parametri e animazione della copia esportata. Non è attestata l’esportazione di un intero programma di più settimane. La prova a 390 pixel è una variazione del viewport, non una prova su telefono fisico.  
**Evidenza:** [PDF desktop](prove-locali/fix-pdf-desktop.pdf), [rendering desktop](prove-locali/fix-pdf-desktop.png), [PDF mobile](prove-locali/fix-pdf-mobile.pdf), [rendering mobile](prove-locali/fix-pdf-mobile.png), [controlli geometrici](prove-locali/fix-pdf-results.json).

### 3.13 Compilazione e invio feedback

**Funzione:** risposta del cliente a una richiesta di feedback tramite token.  
**Operazioni:** verifica del token, compilazione e invio di cinque risposte, riutilizzo del token e richiesta con token inesistente. Nel browser, compilazione dei cinque campi e ricaricamento del link dopo l’invio. Simulato separatamente un errore del trasporto email.  
**Risultato:** token valido → 200; invio con accettazione email simulata → 202; risposte salvate e `inviato=True`. Riutilizzo/token inesistente → 400; dopo l’invio il browser mostra «Token non valido» alla riapertura.  
**Problemi:** nessuna anomalia nel percorso positivo provato. Nel caso di errore email simulato, l’API restituisce 500, conserva le risposte e lascia `inviato=False`: è il comportamento osservato dal test negativo, non una consegna riuscita. L’email reale resta esclusa.  
**Evidenza:** `FEED-01`–`FEED-05` nei [risultati API](prove-locali/api-docker-results.json); [cinque risposte persistite dal browser](prove-locali/browser-db-results.json).

### 3.14 Generazione automatica degli inviti feedback

**Funzione:** task settimanali, mensili e task complessivo.  
**Operazioni:** chiamate dirette alle funzioni con feedback dovuti, futuri, già compilati e fuori finestra; verifica di destinatari e template raccolti localmente. Provato anche un feedback mensile privo di scheda.  
**Risultato:** dopo la correzione, 24 controlli SQLite e 24 MySQL superati. Generati gli inviti dovuti, esclusi quelli non dovuti; task complessivo senza eccezioni; token ancora disponibile per la compilazione.  
**Problemi:** inizialmente il filtro settimanale selezionava il tipo errato, non generava l’invito atteso e il task complessivo poteva fallire con `AttributeError`. Correzione applicativa verificata tramite esecuzione diretta. Il trasporto worker/Beat, già provato, non è stato rieseguito dopo questa modifica.  
**Evidenza:** [regressione SQLite](prove-locali/fix-feedback-sqlite.json), [regressione MySQL](prove-locali/fix-feedback-mysql.json); per lo scheduling reale vedere la sezione 5.

## 4. Integrazioni esterne

| Integrazione | Che cosa è stato effettivamente verificato |
|---|---|
| Stripe | **Non è stato eseguito un test Stripe, nemmeno in modalità test.** Nessuna transazione o webhook verificato. La CSP QA bloccava il caricamento dello script; non è attestata la modalità operativa di un account Stripe. |
| PayPal | Nessuna transazione. È stato corretto e verificato soltanto il tipo TypeScript usato nella compilazione frontend. |
| MailerSend/email | **Le email non arrivavano a caselle reali.** Il metodo di invio era sostituito da un raccoglitore locale: sono stati verificati la generazione dei messaggi, i token, i destinatari e i template nei casi previsti. Accettazione 202 ed errore 500 del trasporto erano simulati. |
| Vimeo | **Riproducibilità non verificata.** Nessun upload o streaming; frame esterni bloccati e riferimento video della fixture vuoto. |

Internet è stato utilizzato per scaricare dipendenze e immagini durante la preparazione/build. Questo non costituisce un test delle integrazioni applicative.

## 5. Prove infrastrutturali

### 5.1 Avvio e ripresa dei container

**Funzione:** avvio dell’ambiente Docker QA.  
**Operazioni:** avvio dei sei servizi; ripartenza di Docker Desktop dopo un arresto del motore durante la preparazione; successivi arresti/riavvii dei servizi QA. Il backend è stato anche ricreato per applicare le durate JWT temporanee e poi ripristinare quelle normali.  
**Risultato:** ambiente tornato disponibile, servizi utilizzati nelle prove successive e infine fermati.  
**Problemi:** inizialmente motore irraggiungibile/502; inoltre l’ingresso dal browser richiedeva una rete di ingresso su Nginx oltre alla rete interna. Risolti per l’ambiente QA. **Non è stata eseguita una campagna sistematica di crash/recovery**, né un test delle politiche di riavvio automatico di ciascun servizio o del riavvio del PC.  
**Evidenza:** [servizi attivi](prove-locali/docker-status.txt), [stato finale](prove-locali/fix-docker-status-finale.txt), cronologia nel [rapporto tecnico](ESITO_PROVE_LOCALI.md).

### 5.2 Conservazione dei dati

**Funzione:** persistenza dei dati di prova.  
**Operazioni:** riutilizzo del volume MySQL QA nelle riprese del lavoro, lettura delle fixture esistenti e verifica nel database dei salvataggi eseguiti dal browser; arresto finale senza eliminazione del volume.  
**Risultato:** account e schede riutilizzati; modifiche, 48 risposte del questionario e feedback riletti dal database.  
**Problemi:** nessuna perdita osservata nei dati utilizzati. È una verifica operativa di persistenza, **non un test dedicato di integrità dopo crash**. Non sono stati provati backup/ripristino, eliminazione e ricostruzione del volume o durabilità sotto guasto hardware.  
**Evidenza:** [letture dopo le azioni browser](prove-locali/browser-db-results.json), [salvataggio dopo recupero sessione](prove-locali/fix-session-db.json), volume dichiarato nel [Compose QA](../qa/local/docker-compose.qa.yml).

### 5.3 Redis, Celery worker e Celery Beat

**Funzione:** trasporto ed esecuzione periodica dei task.  
**Operazioni:** ping Redis e worker, invio del task reale tramite Redis, attivazione di un timer QA ogni 10 secondi con DatabaseScheduler; osservazione dei log di Beat e worker.  
**Risultato:** Redis e worker rispondono; Beat invia e il worker riceve/esegue il task. È quindi verificato il percorso infrastrutturale. Nell’esecuzione iniziale il task terminava in FAILURE per il difetto applicativo feedback; la correzione funzionale è stata poi verificata direttamente come descritto nella prova 3.14. **Non si dichiara un SUCCESS del task corretto rieseguito attraverso Beat.**  
**Problemi:** oltre al difetto applicativo poi corretto, il primo arresto del timer tramite aggiornamento diretto del database non notificava Beat. Il timer è stato disabilitato con `save()`; la raccolta finale riporta `enabled=False` e 441 esecuzioni contabilizzate. È un problema della procedura QA, non un’ulteriore anomalia dell’applicazione.  
**Evidenza:** [log Celery](prove-locali/celery-docker.log), [stato del timer](prove-locali/browser-db-results.json). Estratti storici:

```text
Scheduler: Sending due task QA local scheduling (scheda_tutorial.tasks.my_task)
AttributeError("'NoneType' object has no attribute 'user'")
```

### 5.4 Build e controlli di avvio delle immagini del progetto

**Funzione:** costruzione delle immagini backend e frontend.  
**Operazioni:** build dei Dockerfile `docker/backend/Dockerfile` e `docker/nginx/Dockerfile`; `pip check` e controllo Django nell’immagine backend; controllo TypeScript, configurazione Nginx e richiesta HTTP locale nell’immagine frontend. I controlli runtime finali sono stati eseguiti senza rete esterna.  
**Risultato:** entrambe le build concluse con exit 0; nessuna dipendenza Python incoerente, nessun problema rilevato dal controllo Django; TypeScript superato e Nginx risponde HTTP 200. Bundle QA aggiornato dall’immagine verificata.  
**Problemi:** inizialmente build backend bloccata da `self==2020.12.3`, poi rimossa perché non usata; frontend bloccato da import TypeScript PayPal, poi corretto. Il primo bundle QA tollerava l’errore TypeScript; la build finale non lo tollera e passa. ESLint resta disabilitato come nel Dockerfile preesistente. Restano warning su dipendenze, source map e dimensione bundle; `npm ci` ha segnalato 82 vulnerabilità. Non è stato svolto un intervento generale di aggiornamento o audit di sicurezza.  
**Evidenza:** [risultati](prove-locali/fix-build-results.json), [build backend](prove-locali/fix-build-backend.log), [build frontend](prove-locali/fix-build-frontend.log), [avvio Nginx/HTTP](prove-locali/fix-build-frontend-smoke.log).

## 6. Stato conclusivo e limiti

Il collaudo iniziale comprendeva **37 casi API su SQLite e 37 su MySQL: 31 PASS e 6 FAIL in ciascun ambiente**, oltre a tre controlli HTTP superati per ambiente e alle prove browser descritte. Questi conteggi rimangono storici: i sei FAIL API sono stati risolti e verificati con regressioni mirate; non è stata rieseguita inutilmente l’intera suite per sostituire i report originali.

Le sei fasi di correzione concordate risultano completate: permessi schede, task feedback, validazione questionario, PDF, recupero sessione e build. Le evidenze delle regressioni descrivono il risultato attuale, mentre i log originari conservano i problemi incontrati.

Restano fuori dal collaudo pagamenti reali o sandbox dei provider, consegna email, upload/riproduzione Vimeo, carico e prestazioni, audit di sicurezza, compatibilità esaustiva tra dispositivi/browser e recupero sistematico dai guasti. L’assenza di anomalie nei casi locali provati non attesta questi ambiti.

**Stato alla consegna del collaudo:** container QA fermati, volume e dati fittizi conservati, nessun task concordato rimasto incompleto. **Stato di questo documento:** redazione completata sulle evidenze esistenti, senza nuove prove funzionali o infrastrutturali.


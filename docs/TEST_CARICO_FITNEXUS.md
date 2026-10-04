# FitNexus — Test di carico locale

**Data:** 3 ottobre 2026. **Run:** `20261003T095617Z`. **Esito:** esecuzione completata, senza interruzione automatica per errori.

Sono state eseguite **8.409 richieste nelle sette fasi di carico**, tutte con HTTP 200 e contenuto conforme ai controlli del runner. Includendo riscaldamento e controllo finale, il file delle misure contiene **9.107 richieste, con zero errori**. Altre due richieste preliminari hanno verificato login e disponibilità della scheda prima del carico.

La consultazione raggiunge circa **66–72 richieste/s** nelle fasi con 5–20 utenti concorrenti. Il login raggiunge circa **10 richieste/s** con 5–10 utenti concorrenti. Aumentando la concorrenza oltre questi livelli, in questa esecuzione crescono soprattutto i tempi di risposta. Questi valori descrivono un test locale su dati ridotti, non la capacità certificata del sistema in produzione.

## 1. Ambiente e perimetro

| Elemento | Configurazione utilizzata |
|---|---|
| Host | PC locale, Windows 11 Home, versione 10.0.22000 |
| CPU host | Intel Core i7-8550U @ 1.80 GHz, 4 core fisici e 8 processori logici |
| Docker | Docker Desktop, server 29.0.1; kernel Linux `6.18.40.1-microsoft-standard-WSL2` |
| Risorse viste da Docker | 8 CPU e 16.718.872.576 byte di memoria, circa 15,57 GiB. È la memoria riportata dal motore, non una misura della RAM libera durante il test né una quota riservata a ogni container. |
| Configurazione | [Compose QA](../qa/local/docker-compose.qa.yml), progetto `fitnexus-qa`, volume MySQL esistente |
| Servizi attivi | Nginx, backend Gunicorn, MySQL 8 e Redis |
| Servizi non avviati | Celery worker e Celery Beat: nessun carico concorrente dei task periodici |
| Backend | Immagine `fitnexus-backend-qa:local`, Python 3.8, Django 3.2.9; Gunicorn con 2 worker e 2 thread per worker |
| Destinazione delle richieste | `http://127.0.0.1:8000`, passando attraverso Nginx e il backend reale |
| Generatore | Script Python standard library sullo stesso PC; un thread e una connessione HTTP per utente virtuale |
| Dati | Un account cliente fittizio e la sua scheda pubblicata: una settimana, un giorno, un esercizio. Risposta JSON della consultazione: 479 byte. |
| Isolamento | Rete interna QA; nessun pagamento, invio email reale o collegamento Vimeo |

Non è stato riavviato il collaudo funzionale generale. Sono stati riutilizzati ambiente e dati già predisposti. Le impostazioni QA, compreso il logging ridotto, differiscono da un possibile ambiente di produzione. Le risorse CPU/RAM non sono limitate per singolo servizio dal Compose utilizzato.

Il login verifica realmente le credenziali ed emette JWT di prova. Non modifica schede o questionari; può produrre i normali record di gestione token nel database QA. Non sono state create transazioni di pagamento o comunicazioni verso provider.

## 2. Metodo e criteri

La prova è un **test di carico progressivo a concorrenza fissa per fase**, non un test prolungato né una ricerca esaustiva del punto di rottura.

Ogni utente virtuale invia una richiesta, attende la risposta completa e invia subito la successiva, senza pausa simulata. Questo modello è detto *closed loop*: la frequenza di arrivo diminuisce automaticamente quando il server rallenta. Non simula quindi un afflusso esterno costante e può sottostimare le code che si avrebbero con richieste in arrivo a frequenza imposta.

| Fase | Operazione | Concorrenza | Durata nominale |
|---|---|---|---|
| Preflight | Login e consultazione per ottenere il token e validare la fixture | 1 | Due richieste, escluse dalle misure |
| Riscaldamento letture | Consultazione autenticata | 1 | 5 s, esclusi dai risultati di carico |
| Letture | `GET /personal/my-course/?scheda=<id-QA>` | 1, 5, 10, 20 | 30 s per livello |
| Riscaldamento login | Login con credenziali valide | 1 | 5 s, esclusi dai risultati di carico |
| Login | `POST /auth/login/` | 1, 5, 10 | 30 s per livello |
| Controllo finale | Consultazione autenticata dopo il carico | 1 | 10 s |

Le fasi sono sequenziali: letture e login non vengono mescolati. Un unico token valido viene usato per le letture, senza dover effettuare login a ogni consultazione. Il riutilizzo della connessione HTTP viene mantenuto quando supportato dal server.

**Tempi:** le fasi misurate iniziano alle 09:56:24 UTC; il controllo finale termina alle 10:00:11 UTC del 3 ottobre. Gli orari nei file sono UTC, due ore indietro rispetto all’ora italiana di quel giorno. Le richieste già in corso vengono completate alla scadenza della fase: per questo le fasi nominali di 30 secondi durano effettivamente da 30,026 a 30,823 secondi.

**Misure:** la latenza va dall’inizio della richiesta alla lettura completa della risposta, includendo l’eventuale apertura della connessione; esclude la successiva validazione JSON. La portata è il numero di richieste completate diviso per la durata effettiva della fase, compreso lo smaltimento finale. I percentili sono calcolati con il metodo *nearest rank*: p95 indica il tempo entro cui termina il 95% delle richieste della fase.

**Controlli di correttezza:** ogni risposta deve avere HTTP 200. Per la consultazione vengono verificati JSON leggibile, identificativo della scheda e presenza delle settimane; per il login, JSON leggibile e presenza dell’access token. Non viene verificato ogni singolo campo applicativo sotto carico.

**Limiti operativi del runner:** timeout di 10 secondi; arresto delle fasi successive se, dopo almeno 50 richieste, gli errori raggiungono il 20%. Questa protezione non è scattata. I valori di concorrenza sono limitati a quelli della tabella.

**Criterio di lettura dei risultati:** obiettivo tecnico di zero errori nei casi eseguiti. Non essendo stato concordato uno SLA sui tempi di risposta, non viene dichiarata una conformità prestazionale a una soglia arbitraria. Un utente virtuale qui rappresenta una sorgente continua di richieste, non una persona che naviga con pause di lettura.

## 3. Risultati per funzione

### Consultazione autenticata della scheda

**Funzione:** lettura della scheda personale pubblicata.  
**Operazioni:** richieste HTTP reali con JWT valido, aumentando la concorrenza da 1 a 20.  
**Risultato:** 7.657 richieste nelle fasi di carico, zero errori HTTP, di trasporto o di validazione rilevati.  
**Problemi osservati:** nessun fallimento, ma crescita della latenza; oltre 5 utenti concorrenti la portata non aumenta ulteriormente in modo evidente in questa esecuzione.  
**Evidenza:** fasi `read_1`, `read_5`, `read_10`, `read_20` nel [riepilogo](prove-carico/20261003T095617Z/summary.json) e nel [CSV delle singole richieste](prove-carico/20261003T095617Z/requests.csv).

| Concorrenza | Richieste | Errori | Richieste/s | p50 (ms) | p95 (ms) | p99 (ms) | Max (ms) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1.402 | 0 | 46,69 | 20,56 | 27,20 | 39,38 | 59,55 |
| 5 | 2.156 | 0 | 71,71 | 64,56 | 114,84 | 148,42 | 232,45 |
| 10 | 1.990 | 0 | 65,96 | 149,76 | 260,86 | 314,04 | 369,19 |
| 20 | 2.109 | 0 | 69,52 | 284,38 | 500,68 | 580,72 | 669,41 |

### Login

**Funzione:** autenticazione con credenziali valide.  
**Operazioni:** login ripetuti sullo stesso account QA, con 1, 5 e 10 richieste concorrenti. Ogni richiesta esegue il percorso di autenticazione ed emissione token.  
**Risultato:** 752 richieste nelle fasi di carico, tutte riuscite e con access token presente.  
**Problemi osservati:** nessun errore, ma la portata si assesta intorno a 10 login/s; passando da 5 a 10 utenti il p95 cresce da circa 779 a 1.681 ms. Il massimo osservato è 2.123 ms.  
**Evidenza:** fasi `login_1`, `login_5`, `login_10` nel [riepilogo](prove-carico/20261003T095617Z/summary.json). Password e token non sono riportati nei risultati o nel CSV.

| Concorrenza | Richieste | Errori | Richieste/s | p50 (ms) | p95 (ms) | p99 (ms) | Max (ms) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 137 | 0 | 4,56 | 205,34 | 297,27 | 394,52 | 432,49 |
| 5 | 309 | 0 | 10,18 | 433,39 | 778,99 | 873,28 | 965,21 |
| 10 | 306 | 0 | 9,93 | 967,03 | 1.681,13 | 1.991,99 | 2.123,29 |

### Consultazione dopo il carico

**Funzione:** controllo del comportamento al ritorno a bassa concorrenza.  
**Operazioni:** subito dopo il carico di login, consultazione con un utente per 10 secondi.  
**Risultato:** 446 richieste, zero errori, 44,59 richieste/s; p50 21,33 ms, p95 27,68 ms e p99 42,43 ms. Sono valori vicini alla fase iniziale, il cui p95 era 27,20 ms.  
**Problemi osservati:** nessun degrado persistente evidente nel breve intervallo osservato. Questo controllo non dimostra il recupero dopo un crash e non esclude problemi che emergano dopo ore di utilizzo.  
**Evidenza:** fase `read_recovery` nel [riepilogo](prove-carico/20261003T095617Z/summary.json).

I riscaldamenti, non inclusi nelle due tabelle principali, hanno eseguito 230 letture e 22 login, senza errori. Non sono stati aggregati i percentili di login e consultazione in un unico valore, perché rappresentano operazioni diverse.

## 4. Risorse e stato dei container

Sono stati acquisiti **47 campioni** con `docker stats --no-stream`, a cadenza prevista di circa 5 secondi, senza errori del monitor. I campioni possono durare alcuni secondi: nell’aggregazione per fase sono stati esclusi quelli il cui intervallo di raccolta poteva attraversare un cambio di fase. Le righe seguenti si basano su cinque campioni interni per ogni fase di carico; non sono misure continue né picchi assoluti garantiti.

In Docker, **100% CPU equivale circa all’utilizzo di un processore logico**: 371,51% rappresenta circa 3,72 CPU, non il 371% dell’intero PC. La memoria è quella riportata da Docker stats; i massimi sono massimi campionati.

| Fase | CPU backend media | CPU backend max | RAM backend max (MiB) | CPU MySQL media | RAM MySQL max (MiB) |
|---|---:|---:|---:|---:|---:|
| Letture, 1 | 76,18% | 77,22% | 162,7 | 16,70% | 467,2 |
| Letture, 5 | 218,44% | 221,31% | 166,7 | 29,95% | 468,1 |
| Letture, 10 | 223,18% | 225,11% | 167,1 | 29,56% | 468,4 |
| Letture, 20 | 223,45% | 227,35% | 167,0 | 29,26% | 468,2 |
| Login, 1 | 91,93% | 92,65% | 167,0 | 5,92% | 469,1 |
| Login, 5 | 346,29% | 363,53% | 167,0 | 9,98% | 469,1 |
| Login, 10 | 371,51% | 386,84% | 166,9 | 10,76% | 469,5 |

Il generatore ha consumato al massimo il 4,76% medio di una CPU nelle fasi misurate, secondo il tempo CPU del proprio processo. Questo non misura l’intero carico Windows né l’overhead del processo Docker usato per il monitoraggio. Generatore e servizi condividono comunque lo stesso PC.

Il controllo finale dei quattro container, prima dell’arresto volontario, riportava `state=running`, `restarted=0` e `oom=false`. Nessun riavvio automatico o terminazione per memoria esaurita risulta da tale stato. I servizi QA sono poi stati fermati senza eliminare il volume MySQL.

Evidenze: [campioni grezzi](prove-carico/20261003T095617Z/resources.jsonl), [aggregazione e controllo di integrità](prove-carico/20261003T095617Z/analysis.json), [stato dopo il carico](prove-carico/20261003T095617Z/containers-after.txt), [stato dopo l’arresto](prove-carico/20261003T095617Z/containers-stopped.txt).

## 5. Interpretazione e limiti

**Esito tecnico:** il sistema ha sostenuto tutti i livelli provati senza errori rilevati. Dopo il carico, la lettura è tornata a prestazioni simili alla fase iniziale. Non è stato raggiunto un livello che producesse timeout o errori; non è quindi stato determinato il punto di rottura.

**Comportamento prestazionale:** l’aumento degli utenti concorrenti produce soprattutto attesa, una volta raggiunto il plateau di portata. Il login è sensibilmente più costoso della lettura e mostra un maggiore impiego CPU del backend. Queste osservazioni sono compatibili con un limite di elaborazione e accodamento nel backend con pochi worker/thread, ma **non costituiscono una diagnosi del collo di bottiglia**: non sono stati profilati codice, query SQL, attese del database o costo delle singole operazioni crittografiche.

I risultati hanno questi limiti:

- Una sola esecuzione, fasi brevi, stesso account e scheda molto piccola. Il riuso favorisce cache calde; un database più grande o schede più articolate possono produrre risultati diversi.
- Modello closed loop senza pause e senza miscela di scenari. Non equivale a 20 persone reali, a 20 sessioni indipendenti o a un determinato numero di utenti giornalieri.
- HTTP su loopback, nessun traffico WAN/TLS di produzione; host, generatore, monitor e container condividono risorse. Eventuali altri carichi del PC non sono stati controllati.
- Provate soltanto autenticazione e lettura della scheda. Non sono misurati rendering React, download di tutti gli asset, generazione PDF nel browser, registrazioni, scrittura dei questionari, pubblicazioni o feedback sotto carico.
- Celery/Beat non eseguivano lavoro concorrente; Stripe, PayPal, email e Vimeo sono esclusi. Redis era avviato, ma non è stato sottoposto a un carico specifico.
- Nessun test prolungato, di picco improvviso, di esaurimento risorse, di perdita di rete o di recupero dopo crash. Nessun SLA aziendale definito o certificato.

Per valutare una capacità di produzione servirebbero requisiti sui tempi accettabili, dati rappresentativi, più account e percorsi misti, prove più lunghe e un generatore separato. Prima di modificare worker o query, è opportuno profilare le operazioni che mostrano il plateau. Questa esecuzione non ha modificato il codice applicativo per ottimizzare le prestazioni.

## 6. Evidenze, riproducibilità e stato del lavoro

La cartella [del run](prove-carico/20261003T095617Z/summary.json) contiene riepilogo JSON, CSV con una riga per richiesta, campioni delle risorse, risultati dell’analisi e stati Docker. [runner-used.py](prove-carico/20261003T095617Z/runner-used.py) è la copia dello script usato in questa esecuzione.

Il [runner](../qa/local/load_test.py) richiede il runtime Python locale, Docker CLI, le immagini/bundle QA già predisposti e il file locale `.local-test-artifacts/session.json` con le fixture esistenti. Si rifiuta di usare un account non appartenente a `example.test`; la destinazione HTTP è fissata al loopback. I metadati hardware nel runner sono la fotografia di questa macchina e vanno aggiornati se lo si usa su un ambiente diverso.

Per una futura nuova esecuzione deliberata, dalla radice del repository:

```powershell
docker compose -f qa/local/docker-compose.qa.yml up -d --no-build mysql redis backend nginx
python qa/local/load_test.py
# Sostituire <run> con la cartella appena creata, non sovrascrivere le prove precedenti.
python qa/local/analyze_load_test.py docs/prove-carico/<run>
docker compose -f qa/local/docker-compose.qa.yml stop mysql redis backend nginx
```

In questa esecuzione è stato usato il Python 3.12.14 locale già disponibile. Il runner crea una cartella datata e aggiorna il checkpoint dopo ogni fase. L’[analizzatore](../qa/local/analyze_load_test.py) rilegge le misure senza generare traffico: ha verificato corrispondenza dei conteggi, degli errori e dei percentili tra CSV e riepilogo.

**Lavoro completato:** preparazione, test, controllo delle evidenze, analisi, documentazione e arresto dei soli servizi QA avviati. Database di prova conservato. Non restano fasi avviate da riprendere; non occorre ripetere questo test per completare il documento.

# Prove locali isolate

Questi script eseguono il codice applicativo Django originale con un database di prova SQLite, senza usare dati o credenziali di esercizio. `MailerSend.NewEmail.send` è sostituito da un raccoglitore locale; le connessioni socket fuori da loopback vengono bloccate. Stripe e Vimeo non vengono collaudati.

## File

- `qa_settings.py`: override database, logging, host e broker solo per QA.
- `runtime.py`: bootstrap, isolamento trasporto email/rete, avvio dei comandi Django.
- `test_flows.py`: crea ogni volta un nuovo database, migra, esegue i casi API e lascia dati fittizi per il browser.
- `test_http.py`: smoke test via HTTP su backend in ascolto.
- `serve_frontend.py`: serve il bundle con CSP che impedisce accessi a servizi esterni.

Gli artefatti temporanei, compresi database, outbox e credenziali esclusivamente fittizie, sono in `.local-test-artifacts` e ignorati da Git. Le evidenze condivisibili sono in `docs/prove-locali`.

## Esecuzione backend

Usare un interprete Python con le dipendenze elencate in `docs/prove-locali/python-packages.txt`, oppure installarle nella cartella `.local-test-deps` della radice. Nell'esecuzione del 30 settembre 2026 è stato usato Python 3.12.14 fornito dall'ambiente di lavoro; il vecchio virtualenv del progetto non era utilizzabile. Le versioni dei componenti principali corrispondono ai requisiti del progetto, ma questo ambiente non riproduce integralmente Python 3.8/MySQL dei container.

```powershell
python qa/local/test_flows.py
python qa/local/runtime.py runserver 127.0.0.1:8000 --noreload
```

Da un altro terminale:

```powershell
python qa/local/test_http.py
```

Il primo script produce un nuovo database e aggiorna il riferimento in `.local-test-artifacts/session.json`; riavviare il server quando si rigenera la sessione. I risultati `FAIL` segnalano comportamenti non conformi alle aspettative funzionali esplicitate, mentre `BLOCKED` segnala un caso non completato. Un caso che attende e riceve HTTP 500 in una simulazione di errore trasporto è `PASS` per quello specifico scenario negativo, non per la normale disponibilità del servizio.

Il test API usa il routing, middleware, viste, serializer, JWT e modelli reali. I token degli attori secondari sono preparati come fixture tramite `RefreshToken.for_user`; i casi login verificano separatamente l'autenticazione reale. Il test HTTP usa effettivamente il token restituito dal login. I task sono invocati sincronicamente, senza worker Redis/Celery attivi.

## Frontend

Compilare i sorgenti React destinando il risultato a `.local-test-artifacts/frontend-build`, quindi eseguire dalla radice:

```powershell
python qa/local/serve_frontend.py
```

Aprire `http://localhost:3000`. Il backend deve ascoltare sulla porta 8000, coerentemente con `ApiSettings.ts`. Il server frontend aggiunge una CSP per impedire caricamenti di script Stripe, frame Vimeo, font e altre risorse esterne. I relativi messaggi CSP sono effetti intenzionali dell'isolamento, non esiti di test sui provider.

I sorgenti applicativi non sono modificati da questi script. I processi avviati per le prove devono essere fermati al termine; i database e i report possono essere conservati per riproducibilità.

## Seconda fase: Docker/MySQL e browser (1–2 ottobre)

Stato finale e limiti sono in `docs/ESITO_PROVE_LOCALI.md`; il registro delle fasi è in `qa/local/STATO_PROVE.md`. I test già conclusi non devono essere ripetuti per riprendere il progetto.

Nel collaudo iniziale la build backend era fallita su `self==2020.12.3` non reperibile. È stata quindi usata un'immagine QA Python 3.8 con `requirements.docker.txt`, distinta dall'immagine standard. `docker_boot.py` applica le impostazioni QA e l'intercettazione email; la rete interna Docker sostituisce il blocco socket loopback usato su Windows. Nginx è il solo punto di ingresso su localhost; MySQL, Redis, backend e Celery non hanno accesso alla rete esterna.

Per riaprire l'ambiente già preparato, senza ripetere test né migrazioni:

```powershell
docker compose -f qa/local/docker-compose.qa.yml up -d --no-build
```

Per la prima preparazione di un ambiente NUOVO, con database QA vuoto:

```powershell
docker compose -f qa/local/docker-compose.qa.yml build backend
docker compose -f qa/local/docker-compose.qa.yml up -d mysql redis
docker compose -f qa/local/docker-compose.qa.yml run --rm -e QA_REPORT_NAME=api-docker-results.json backend test
docker compose -f qa/local/docker-compose.qa.yml up -d --no-build
```

**Non rieseguire `backend test` sul MySQL già popolato:** gli account fittizi esistenti entrerebbero in conflitto. Il runner SQLite crea un file nuovo, quello MySQL utilizza il volume dedicato esistente. Non eliminare il volume per una semplice ripresa.

Il bundle frontend è stato creato in `.local-test-artifacts/frontend-build` con Node 24.19.0, dipendenze installate tramite pnpm e queste variabili:

```powershell
$env:BUILD_PATH='D:\Desktop\UniMarconi\TESI\.local-test-artifacts\frontend-build'
$env:GENERATE_SOURCEMAP='false'
$env:DISABLE_ESLINT_PLUGIN='true'
# Solo nel collaudo storico: TSC_COMPILE_ON_ERROR=true (non più necessario)
```

Dalla directory `gym-fe-app`: `node node_modules/react-scripts/scripts/build.js`. Questa era la procedura storica prima della correzione PayPal. Ora entrambi i Dockerfile del progetto sono stati verificati, senza TSC_COMPILE_ON_ERROR; il bundle QA attuale è stato copiato dall’immagine frontend verificata. Il lock pnpm importato dal package-lock è conservato in `gym-fe-app/pnpm-lock.yaml`.

Per i controlli HTTP, se necessari dopo modifiche:

```powershell
$env:QA_HTTP_REPORT_NAME='http-docker-results.json'
python qa/local/test_http.py
```

`docker_probe.py` invia il task reale e crea un timer QA: non eseguirlo per un semplice controllo di stato. Per disabilitare correttamente il timer occorre notificare il cambiamento a Beat tramite `save()`; un semplice `QuerySet.update()` non basta:

```powershell
docker compose -f qa/local/docker-compose.qa.yml exec -T backend python /workspace/qa/local/docker_boot.py shell -c "from django_celery_beat.models import PeriodicTask; t=PeriodicTask.objects.get(name='QA local scheduling'); t.enabled=False; t.save()"
docker compose -f qa/local/docker-compose.qa.yml stop
```

Al termine del collaudo il timer è stato disabilitato in questo modo e tutti i sei container sono stati fermati, senza rimuovere volumi. Le evidenze del browser sono conservate in `docs/prove-locali`; `collect_browser_evidence.py` legge soltanto i record QA interessati dalle azioni browser.

## Correzioni completate

Stato finale e regressioni: `STATO_CORREZIONI.md` e `../../docs/ESITO_PROVE_LOCALI.md`.
I test frontend mirati sono `src/http-common.test.ts` e `src/pages/SchedaPersonalizzataPage.test.tsx` (11 casi). Esecuzione dalla cartella frontend: `npm test -- --watchAll=false --runInBand --runTestsByPath src/http-common.test.ts src/pages/SchedaPersonalizzataPage.test.tsx`.

Per ricostruire le immagini corrette dalla radice, quando necessario:

```powershell
docker build -f docker/backend/Dockerfile -t fitnexus-backend-buildcheck:local .
docker build -f docker/nginx/Dockerfile -t fitnexus-frontend-buildcheck:local .
```

Il Compose QA continua a usare l’immagine QA isolata; le immagini standard sono state verificate separatamente senza avviare servizi reali. Per aggiornare il bundle montato da Nginx QA si può copiare `/usr/share/nginx/html/.` dall’immagine frontend in `.local-test-artifacts/frontend-build` tramite un container temporaneo creato con `docker create`, poi rimuovere quel container.

Solo per riprodurre i casi di scadenza, il servizio backend QA accetta `LOCAL_QA_ACCESS_SECONDS` e `LOCAL_QA_REFRESH_SECONDS` nell’ambiente del comando Compose. Le prove hanno usato 5/25 secondi per la scadenza completa e 5/600 per il recupero. I valori predefiniti 3600/86400 sono stati ripristinati; le impostazioni applicative normali non sono state modificate.

## Test di carico del 3 ottobre 2026

Test completato; rapporto in `../../docs/TEST_CARICO_FITNEXUS.md`, misure in `../../docs/prove-carico/20261003T095617Z`. `load_test.py` genera carico solo su loopback, usando le fixture QA esistenti; `analyze_load_test.py <cartella-run>` verifica e aggrega i dati senza generare traffico. Non serve ripetere il test completato. Consultare il rapporto prima di nuove esecuzioni, in particolare per perimetro, risorse e limiti.

## Verifica Beat del 3 ottobre 2026

Completata con SUCCESS: `../../docs/TEST_CELERY_BEAT_FITNEXUS.md`. Per un nuovo test deliberato utilizzare `test_beat_delivery.py`, che pianifica il task reale one-off su coda dedicata, controlla Redis e outbox e rimuove le proprie fixture. Non riattivare il vecchio timer tramite `docker_probe.py`. Raccoglitore email locale; nessuna consegna reale collaudata.

# Stato di avanzamento — 2 ottobre 2026

**Correzioni successive al collaudo:** il registro attivo è ora [STATO_CORREZIONI.md](STATO_CORREZIONI.md). Le dichiarazioni di assenza di modifiche applicative sotto sono storiche; le prime tre problematiche backend sono state corrette e verificate. Prossima attività: PDF.

**CONCLUSO.** Rapporto principale aggiornato, prove locali completate nel perimetro dichiarato, timer disabilitato tramite `save()` e sei container QA fermati conservando il volume. Non ci sono prove da riprendere né modifiche applicative da annullare.

## Ultima fase completata il 2 ottobre

- Ripresa della pagina questionario senza rigenerare fixture: risposta obbligatoria mancante individuata. Dopo completamento, invio HTTP 401 a seguito della lunga interruzione; etichette incoerenti dopo l'errore documentate.
- Nuovo login cliente e nuovo questionario: salvataggio riuscito, 48 voci in MySQL, navigazione a `/payment`; nessun pagamento eseguito.
- Login/logout UI e pannello trainer: rinominata una scheda QA esistente in «Scheda QA browser», salvata e pubblicata. Persistenza e `published=True` verificati.
- Evidenze raccolte in `browser-db-results.json`, `docker-status.txt`, `docker-status-finale.txt`, `celery-docker.log` e `python-docker-packages.txt`.
- La disabilitazione iniziale del timer con aggiornamento diretto non aveva notificato Beat: il conteggio finale osservato è 441 (non un totale certo degli invii). Corretto il cleanup QA con `save()`, poi arrestati i container. Il dato storico di 9 sotto è la prima osservazione.
- Rapporto e README aggiornati; sorgenti applicativi invariati.

Eventuale prossimo lavoro: correggere le anomalie documentate, solo se richiesto. Non ripetere l'intero collaudo; verificare i percorsi interessati dalle correzioni.

## Acquisito: non ripetere

- Analisi funzionale e catalogo API in `docs/`.
- 37 test SQLite: 31 PASS e 6 FAIL; tre test HTTP superati.
- Stessi 37 test su MySQL in Docker: stessi esiti; tre test HTTP Docker superati.
- Tutti i sei componenti Compose QA avviati; MySQL healthy, Redis PONG, Gunicorn attivo, worker Celery pong.
- Task reale inviato attraverso Redis: FAILURE con AttributeError su feedback mensile privo di scheda. Beat ha registrato 9 invii del timer QA, poi disabilitato.
- Browser: accesso anonimo protetto, login cliente, consultazione scheda con 3 serie, 12 ripetizioni, 60 secondi di recupero.
- Browser feedback: cinque risposte salvate in MySQL, inviato=True; ricaricando il link appare Token non valido.
- PDF scaricato e ispezionato: una pagina 280x776 pt, 492436 byte, contenuto tagliato a destra. Evidenze PDF e PNG in `docs/prove-locali/`.
- Questionario: visitate tutte le sei pagine, invio vuoto bloccato con messaggio di domanda mancante; compilati dati fittizi, secondo invio rimasto sulla pagina senza conferma. Questo è il punto da riprendere.

## Ambiente effettivo

`qa/local/docker-compose.qa.yml`: rete offline interna per backend, MySQL, Redis e Celery; soltanto Nginx ha anche rete ingress e porte loopback 3000/8000. CSP blocca servizi esterni nel browser; MailerSend intercettato localmente. Nessun pagamento o video esterno provato.

Build backend originale fallita: primo tentativo gunicorn non reperito, secondo tentativo self==2020.12.3 non reperito. Immagine QA Python 3.8 con requisiti dedicati; non equivale alla build originale riuscita.

Frontend compilato localmente con Node 24 e dipendenze pnpm: ESLint react-app non risolto; con DISABLE_ESLINT_PLUGIN=true (come Dockerfile originale), ulteriore errore TS2307 sui tipi PayPal. Bundle di collaudo ottenuto con TSC_COMPILE_ON_ERROR=true, senza correzioni ai sorgenti.

## Piano precedente — ora completato

1. Chiarire esito del questionario compilato nel browser; controllare stato della pagina prima di agire.
2. Verifica interfaccia trainer per gestione schede, se raggiungibile con fixture esistenti (API già verificate).
3. Aggiornare `docs/ESITO_PROVE_LOCALI.md` e README con risultati Docker/browser e limiti; attualmente il rapporto principale si ferma alle prove del 30 settembre.
4. Registrare evidenze residue, controllare solo i file nuovi/modificati e fermare i container QA a fine collaudo, conservando il volume.

All'inizio della ripresa del 2 ottobre i sei container risultavano ancora attivi; al termine sono stati fermati. Non rigenerare fixture né rieseguire i 37 casi sullo stesso MySQL popolato. Nessuna modifica ai sorgenti dell'applicazione; preservare la cartella utente `Elaborato/`.

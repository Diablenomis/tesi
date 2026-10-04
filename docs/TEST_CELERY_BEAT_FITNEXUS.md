# FitNexus — Verifica del task corretto attraverso Celery Beat

**Data:** 3 ottobre 2026. **Run:** `qa-beat-20261003T103948Z`. **Esito: PASS**, con 10 controlli superati.

È stata completata la verifica che mancava dopo la correzione dei task feedback: **Celery Beat → Redis → worker Celery → esecuzione del task applicativo → risultato SUCCESS in Redis**. Il task non è stato chiamato direttamente né inviato manualmente con `.delay()`.

Questa prova riguarda lo scheduling asincrono locale. **Non verifica ancora un provider esterno:** MailerSend è rimasto sostituito dal raccoglitore locale, senza consegna a caselle reali. Stripe, PayPal e Vimeo non sono stati utilizzati.

## Ambiente e modalità

- PC Windows locale, container Linux tramite Docker Desktop/WSL2, configurazione [Compose QA](../qa/local/docker-compose.qa.yml).
- MySQL e Redis QA avviati sul volume esistente; backend HTTP e Nginx non necessari e rimasti spenti.
- Worker e Beat avviati come container temporanei dalla stessa immagine backend QA, con sorgenti applicativi correnti montati e impostazioni di isolamento già utilizzate.
- Worker con concorrenza 1, in ascolto esclusivamente della coda `qa-beat-verification`, per separare questa esecuzione dalle vecchie code.
- Beat con `django_celery_beat.schedulers:DatabaseScheduler` e intervallo massimo di controllo di 2 secondi.
- Pianificazione `ClockedSchedule`, `one_off=True`, nome univoco del run e coda dedicata. Il task pianificato è quello reale: `scheda_tutorial.tasks.my_task`.
- Invio email intercettato nel processo worker; accettazione del trasporto simulata con stato 202. Rete interna QA, nessuna credenziale di provider reale.

Sono state aggiunte quattro sole fixture di feedback, riconoscibili dal prefisso del run: settimanale dovuto oggi, mensile dovuto oggi senza scheda, settimanale futuro e mensile già compilato. È stato riutilizzato il cliente fittizio esistente. Le vecchie fixture non sono state modificate; le verifiche dei messaggi selezionano soltanto quelli delle nuove fixture.

## Prova eseguita

**Funzione:** generazione degli inviti feedback tramite pianificazione Beat.  
**Operazioni:** avvio del worker dedicato e attesa dello stato pronto; inserimento delle fixture e della pianificazione per circa 20 secondi dopo la preparazione; avvio di Beat; osservazione dell’invio pianificato, ricezione ed esecuzione nel worker; lettura dello stato nel result backend Redis e verifica dei messaggi nell’outbox locale.  
**Risultato:** task terminato in `SUCCESS`, ritorno `None` atteso, nessuna eccezione. Per le fixture della prova sono presenti esattamente un invito settimanale e uno mensile, con destinatario e template attesi. Nessun invito per feedback futuro o già compilato. Il token dei due feedback dovuti resta utilizzabile per la successiva compilazione.  
**Problemi:** non è ricomparso l’`AttributeError` osservato prima della correzione. La consegna email reale non è attestata. L’esecuzione riuscita riguarda una pianificazione singola, non un test prolungato di periodicità, retry o recupero dai guasti.  
**Evidenza:** [risultati e 10 controlli](prove-beat/qa-beat-20261003T103948Z/result.json), [log Beat](prove-beat/qa-beat-20261003T103948Z/beat.log), [log worker](prove-beat/qa-beat-20261003T103948Z/worker.log), [pianificazione](prove-beat/qa-beat-20261003T103948Z/schedule.json).

### Traccia dell’esecuzione

Task ID: `a01af03d-baf5-4c95-b5e3-c3bfb2abc1b2`. Orari UTC del 3 ottobre 2026; in Italia erano le 12:40.

```text
10:40:18,652  Beat: Scheduler: Sending due task qa-beat-20261003T103948Z
             (scheda_tutorial.tasks.my_task)
10:40:18,656  Worker: Task scheda_tutorial.tasks.my_task
             [a01af03d-baf5-4c95-b5e3-c3bfb2abc1b2] received
10:40:18,841  Worker: Task ... succeeded in 0.18279782199897454s: None
```

Le righe sono abbreviate per leggibilità; i file collegati conservano i log completi. Redis registra `SUCCESS` e completamento alle `10:40:18.838001+00:00`. I circa **0,183 secondi** sono il tempo riportato dal worker con trasporto email locale, non una misura della latenza di MailerSend.

| Controllo | Esito |
|---|---|
| Stato del task letto dal result backend Redis | SUCCESS |
| Valore di ritorno | `None`, atteso |
| Messaggi delle fixture del run | Esattamente 2 |
| Tipi di feedback selezionati | Solo settimanale e mensile dovuti |
| Destinatario settimanale | `cliente@example.test`, corretto |
| Template settimanale | `jpzkmgq68y24059v`, corretto |
| Destinatario mensile | `cliente@example.test`, corretto |
| Template mensile | `vywj2lp6q7k47oqz`, corretto |
| Feedback dovuti dopo l’invito | `inviato=False`, token non consumati |
| Feedback mensile senza scheda | Eseguito correttamente con `form=None` |

## Chiusura e conservazione dei dati

Beat e worker temporanei sono stati fermati e rimossi. Successivamente la pianificazione è stata esplicitamente disabilitata tramite `save()` e rimossa insieme alle quattro fixture e al relativo `ClockedSchedule`. Sono stati preservati account, schede e feedback preesistenti.

La lettura immediata della pianificazione dopo l’esecuzione riportava ancora `enabled=True` e `total_run_count=0`: pertanto **non si usa quel contatore come prova dell’esecuzione o dell’autodisabilitazione**. Le prove dell’esecuzione sono i log, il risultato Redis e i messaggi raccolti. La chiusura è garantita dall’arresto dei processi e dalla successiva rimozione esplicita della pianificazione.

Il controllo finale conferma coda dedicata vuota, vecchio timer «QA local scheduling» ancora disabilitato e nessuna fixture del nuovo run rimasta nel database. MySQL e Redis QA sono stati fermati conservando il volume.

Nel log Beat compare anche l’invio del task interno `celery.backend_cleanup` sulla coda ordinaria. Il worker dedicato della prova non ascoltava quella coda: quel task di manutenzione non è parte del risultato attestato e la coda ordinaria non è stata svuotata.

Evidenze: [pulizia delle fixture](prove-beat/qa-beat-20261003T103948Z/cleanup.json), [coda e vecchio timer](prove-beat/qa-beat-20261003T103948Z/final-state.json), [container fermati](prove-beat/qa-beat-20261003T103948Z/containers-stopped.txt).

## Riproducibilità e stato finale

Script aggiunti: [orchestratore](../qa/local/test_beat_delivery.py) e [fixture/verifiche nel container](../qa/local/beat_delivery_fixture.py). Richiedono immagini QA e fixture locali già predisposte. Non utilizzare il vecchio `docker_probe.py` per ripetere questa prova: abilita il precedente timer ricorrente.

Per una futura esecuzione deliberata, dalla radice del repository:

```powershell
docker compose -f qa/local/docker-compose.qa.yml up -d --no-build mysql redis
python qa/local/test_beat_delivery.py
docker compose -f qa/local/docker-compose.qa.yml stop mysql redis
```

L’orchestratore salva i log, controlla il risultato e pulisce i propri record anche in caso di errore dopo la preparazione. Le credenziali e i token delle fixture restano nell’area locale di collaudo, non nei risultati condivisibili.

**Parte Celery/Beat completata:** il task corretto è stato eseguito con successo attraverso lo scheduler reale. **Parte provider email ancora da verificare:** accettazione MailerSend reale, consegna in casella, contenuto e utilizzabilità del link ricevuto. Nessuna modifica al codice applicativo è stata necessaria per questa verifica.

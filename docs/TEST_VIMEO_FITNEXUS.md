# FitNexus — Test Vimeo reali

Collaudo del 3–4 ottobre 2026. Ripresa dal checkpoint senza ripetere upload o verifiche già concluse.

## Ambiente e avvio

PC locale Windows, Docker Desktop con container Linux. Configurazione: `qa/local/docker-compose.qa.yml` + `qa/local/docker-compose.vimeo.yml`. Backend, MySQL, Redis e Nginx avviati; worker Celery e Beat fermi in questa sessione, già collaudati separatamente. Frontend disponibile su localhost:3000 e API su localhost:8000. Il frontend compilato per Vimeo è montato in Nginx. Token Vimeo nel file locale ignorato dal repository; mai incluso nel frontend. Le email rimangono raccolte localmente; nessun nuovo test Stripe.

## Prove completate

### Autenticazione e autorizzazione Vimeo

**Operazioni:** verifica del token e lettura dell'account tramite API Vimeo.

**Risultato:** entrambe le richieste HTTP 200; scope private/edit/upload/public. Il campo account restituisce starter, mentre l'utente dichiara il piano Free: non è stato effettuato alcun cambio piano. L'accesso all'upload è dimostrato dalla successiva prova reale.

**Problemi:** nessuno nell'autenticazione.

**Evidenza:** [step-1-account.json](prove-vimeo/step-1-account.json).

### Caricamento dal profilo trainer

**Operazioni:** selezione di videoTest/video.mp4 (16.675.623 byte), creazione del ticket attraverso il backend autenticato e trasferimento TUS dal browser a Vimeo.

**Risultato:** caricamento completato; video ID **1232641850**, durata **116 secondi**. L'API conferma available, upload complete, transcode complete, is_playable=true.

**Problemi risolti:** il codice iniziale richiedeva HTTP 201 dal provider, mentre Vimeo ha risposto HTTP 200. Il backend accetta ora entrambi e restituisce HTTP 201 al frontend. Rimane nell'account un oggetto incompleto del primo tentativo, ID **1232641528**, senza trasferimento dei byte: non è stato cancellato automaticamente. Il video riuscito non è stato ricaricato.

**Evidenza:** [schermata upload](prove-vimeo/upload-success.png), [messaggio UI](prove-vimeo/upload-success.txt), [stato video](prove-vimeo/step-2-video.json). Il campo uploaded_files=0 dell'ultima evidenza riguarda il solo script di lettura, non l'intero collaudo.

### Protezione dell'endpoint di upload

**Operazioni:** nove controlli locali con risposte del provider simulate: anonimo, cliente, dimensione zero/eccessiva, nome mancante, token assente, trainer autorizzato, risposta Vimeo 200 e rifiuto Vimeo.

**Risultato:** 9/9 superati; rispettivamente rifiuti 401/403/400, errore configurazione 503, ticket 201 e rifiuto provider riportato come 502. Il token account non è restituito al browser.

**Problemi:** nessuno osservato nei casi provati. Non sono nove upload reali.

**Evidenza:** [upload-permissions.json](prove-vimeo/upload-permissions.json).

### Consultazione e riproduzione dalla scheda cliente

**Operazioni:** predisposta la scheda pubblicata “Vimeo QA playback 20261003” per cliente@example.test, con un esercizio collegato al video caricato; accesso cliente e apertura “Guarda video”. La fixture è stata preparata dal backend: non costituisce un nuovo collaudo della creazione scheda attraverso UI.

**Risultato:** il video era inizialmente non accessibile al cliente: il player ufficiale richiedeva l'accesso Vimeo. Il 4 ottobre l'utente ha autorizzato a rendere pubblico **solo il video 1232641850**; modifica riuscita HTTP 200, privacy view=anybody ed embed=public. Nel player ufficiale aperto separatamente sono riusciti **Play, avanzamento a 11,855 secondi e Pause a 31,301 secondi**, durata rilevata 116,433 secondi. **Riproduzione incorporata: PASS manuale**, confermato dall'utente nella conversazione: «La riproduzione dentro la scheda funziona». La conferma riguarda la riproduzione; non si attribuiscono all'utente ulteriori prove specifiche di pausa o fullscreen. Il riquadro vuoto resta un limite osservato nel browser automatico, non un fallimento riprodotto dall'utente.

**Problemi:** il componente precedente dipendeva da oEmbed, che con la privacy iniziale restituiva 404. La scheda usa ora direttamente il player ufficiale, senza dipendere da oEmbed. Questa modifica non scavalca la privacy: prima dell'autorizzazione il player continuava a richiedere l'accesso. Dopo la pubblicazione il player separato funziona, mentre l'iframe nel browser automatico rimane vuoto. Una richiesta HTTP diagnostica con Referer localhost riceve 401 e una pagina di verifica sicurezza Vimeo/Cloudflare; questo non dimostra da solo la causa del riquadro vuoto. Non è stato tentato alcun aggiramento. La successiva conferma manuale dell'utente chiude positivamente la prova di riproduzione nella scheda; non determina la causa del limite del browser automatico.

**Evidenza:** [fixture](prove-vimeo/playback-fixture.json), [risposta API e oEmbed iniziali](prove-vimeo/step-2-video.json), [richiesta di accesso iniziale](prove-vimeo/player-signin-required.png), [pubblicazione autorizzata](prove-vimeo/privacy-authorized.json), [play e pausa reali nel player separato](prove-vimeo/direct-playback.json), [schermata player](prove-vimeo/direct-playback.png), [riquadro vuoto nella scheda](prove-vimeo/playback-blocked.png), [diagnostica sicurezza](prove-vimeo/embed-diagnostic.txt), [build riuscita](prove-vimeo/frontend-build.log).

## Perimetro e limiti

- Upload reale nell'account dell'utente, non simulazione o ambiente sandbox Vimeo.
- Nessun acquisto. Il solo video 1232641850 è stato reso pubblico su esplicita autorizzazione; nessuna modifica ai default di privacy dell'account. Video e fixture conservati per riesame.
- Upload dal trainer e consultazione della scheda personale sono il percorso del collaudo. Gli altri player storici di homepage/pacchetti non sono stati verificati con questo video e usano ancora il componente precedente.
- Nessuna prova di interruzione rete/ripresa reale, quota esaurita, file invalido, elaborazione fallita, fullscreen, dispositivi mobili o compatibilità fra browser.
- La ripresa dell'upload conserva il ticket nella pagina aperta; la persistenza dopo ricaricamento della pagina non è implementata.
- Il frontend contiene ancora chiamate Stripe estranee a questa prova, bloccate dalla configurazione di rete/CSP Vimeo: non sono esiti dei test di pagamento già conclusi.


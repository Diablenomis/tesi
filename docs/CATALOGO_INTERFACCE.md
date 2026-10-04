# FitNexus — Catalogo delle pagine e delle API

Appendice all'[analisi funzionale](ANALISI_FUNZIONALE.md). Ricostruzione statica del 25 settembre 2026.

## 1. Convenzioni

I percorsi API sono relativi alla radice Django: un reverse proxy può aggiungere un prefisso esterno. I parametri fra `<...>` sono variabili di percorso. Non sono elencati separatamente i metodi tecnici `HEAD` e `OPTIONS`.

La colonna accesso descrive il controllo osservabile nel codice, non il ruolo ideale del processo:

- **Pubblico/default**: nessun permesso restrittivo esplicito; le impostazioni non definiscono un default restrittivo.
- **Autenticato**: presenza di `IsAuthenticated` o controllo equivalente.
- **Autenticato; ruolo solo sull'oggetto**: classe personalizzata con controllo generale della sola autenticazione. Il ruolo viene verificato quando la vista richiama il controllo sull'oggetto, non automaticamente per ogni metodo.
- **Token**: possesso del token funzionale richiesto dall'operazione.
- **Firma Stripe**: controllo della firma webhook nella logica della vista.

La presenza di un serializer dichiarato non implica che una vista manuale lo usi per validare i dati ricevuti.

## 2. Pagine frontend

Fonte: `gym-fe-app/src/App.tsx` e `src/constants/PathConstants.ts`.

| Percorso | Pagina/comportamento |
|---|---|
| `/` | Home, servizi, team, contatto e componenti condivisi di accesso |
| `/about-us` | Presentazione dell'attività |
| `/team` | Presentazione dei professionisti |
| `/serveces-details` | Dettaglio servizi; grafia effettiva della rotta |
| `/custom` | Questionario per la scheda personalizzata |
| `/coaching` | Selezione del coach |
| `/payment` | Listino relativo al servizio passato nello stato di navigazione e avvio Checkout |
| `/payment-succeeded` | Esito positivo del ritorno dal checkout |
| `/payment-failed` | Esito negativo/annullamento del ritorno dal checkout |
| `/profile` | Schede del cliente oppure pannelli coach/admin |
| `/personal/detail/user/:packPersId` | Consultazione scheda personale, video e PDF |
| `/tutorial` | Elenco corsi tutorial |
| `/tutorial/detail/:packTitle` | Dettaglio commerciale del corso |
| `/tutorial/detail/user/:packTitle` | Consultazione del tutorial acquistato |
| `/check-email` | Gestione della verifica email |
| `/reset` | Reimpostazione password attraverso i parametri del link |
| `/feedback` | Compilazione feedback tramite token nella query string |
| Qualsiasi altra rotta | Reindirizzamento alla home |

`AdminPage` e `CoachPage` sono componenti del profilo, non rotte autonome. `HomePage2` e diversi componenti precedenti sono presenti nel repository, ma non costituiscono pagine montate dal router principale. La visibilità dei pannelli frontend dipende da dati locali e non sostituisce i permessi server.

## 3. Account

Fonti: `gym-be-app/app/authentication/urls.py`, `views.py`, `serializers.py`.

| Metodo | Percorso | Funzione | Accesso osservato |
|---|---|---|---|
| POST | `/auth/register/` | Crea account e avvia verifica email | Pubblico/default |
| GET | `/auth/register-verify/` | Verifica disponibilità di `email` e `username` in query | Pubblico/default |
| POST | `/auth/login/` | Login via email o username; restituisce JWT e flag | Pubblico/default, credenziali richieste |
| POST | `/auth/logout/` | Tenta blacklist del refresh token | Autenticato |
| GET | `/auth/email-verify/` | Attiva account con `token` in query | Token |
| POST | `/auth/token/refresh/` | Rinnova access token | Refresh token |
| POST | `/auth/request-reset-email/` | Richiede email recupero password | Pubblico/default |
| GET | `/auth/reset-password/<uidb64>/<token>/` | Verifica link di reset | Token |
| POST | `/auth/password-reset-complete/` | Imposta nuova password | Token e identificativo utente nel payload |

## 4. Coach

Fonti: `gym-be-app/app/coach/urls.py` e `views.py`.

| Metodo | Percorso | Funzione | Accesso osservato |
|---|---|---|---|
| GET | `/coach/` | Elenco profili e numero utenti associati | Pubblico/default |
| GET | `/coach/info/<email>/` | Dettaglio coach | Pubblico/default |
| POST | `/coach/insert/` | Inserimento coach | Autenticato; vista manuale senza controllo oggetto esplicito |
| PUT | `/coach/update/<email>/` | Modifica coach | Autenticato; vista manuale senza controllo oggetto esplicito |
| DELETE | `/coach/delete/<email>/` | Eliminazione coach | Autenticato; vista manuale senza controllo oggetto esplicito |
| GET | `/coach/list/email/bought/pers/` | Elenco nominativi/email per il pannello schede | Autenticato; restituisce tutti gli utenti, senza filtro acquisto |

## 5. Catalogo tutorial e programmi

Fonti: `gym-be-app/app/scheda_tutorial/urls.py` e `views/view_tutorial.py`.

| Metodo | Percorso | Funzione | Accesso osservato |
|---|---|---|---|
| GET, POST | `/tutorial/discipline/` | Elenco e creazione discipline | Pubblico/default |
| DELETE | `/tutorial/discipline/<name>/` | Eliminazione disciplina | Pubblico/default |
| GET | `/tutorial/courses/<discipline>/` | Elenco per disciplina; `all` indica tutte | Pubblico/default |
| GET, DELETE | `/tutorial/course/<title>/` | Dettaglio/eliminazione corso | Pubblico/default |
| POST | `/tutorial/course-insert/` | Inserimento corso con livelli | Pubblico/default |
| PUT | `/tutorial/course-update/<title>/` | Modifica corso | Pubblico/default |
| POST | `/tutorial/course-insert-coach/` | Associazione coach a livello | Pubblico/default |
| DELETE | `/tutorial/course-remove-coach/` | Rimozione associazione coach | Pubblico/default |
| POST | `/tutorial/course/level/insert/` | Inserimento livello | Pubblico/default |
| PUT | `/tutorial/course/level/update/` | Modifica livello | Pubblico/default |
| DELETE | `/tutorial/course/level/delete/` | Eliminazione livello indicato nel payload | Pubblico/default |
| POST | `/tutorial/form/` | Creazione struttura scheda tutorial | Pubblico/default |
| GET, PUT, PATCH, DELETE | `/tutorial/form/<id>/` | Lettura/modifica/eliminazione struttura | Pubblico/default |
| GET | `/tutorial/my-courses/` | Corsi associati all'utente | Autenticato |
| GET | `/tutorial/my-courses/<id_level>/` | Scheda del livello acquistato | Autenticato e filtro acquisto |
| GET | `/tutorial/form/coach/<id_level>/` | Dettaglio livello per il pannello coach | Autenticato; vista manuale senza controllo oggetto esplicito |

L'eliminazione dell'ultimo livello di un corso elimina anche il corso. Il recupero di `my-courses` individua i corsi acquistati, ma la successiva costruzione della lista dei livelli non li filtra effettivamente sugli ID acquistati. Il dettaglio riservato applica invece il filtro di associazione. La visibilità del metadato di un livello non equivale quindi al diritto di consultarne la scheda.

## 6. Esercizi e richieste generiche

Fonte: `gym-be-app/app/scheda_tutorial/views/view_general.py`.

| Metodo | Percorso | Funzione | Accesso osservato |
|---|---|---|---|
| GET, POST | `/exercise/` | Elenco e creazione esercizi | Pubblico/default |
| GET, PUT, PATCH, DELETE | `/exercise/<id>/` | Dettaglio, modifica ed eliminazione esercizio | Pubblico/default |
| POST | `/generic/help-email/` | Invio richiesta di assistenza/orientamento al team | Pubblico/default |

## 7. Percorsi personalizzati, feedback e scelte professionali

Fonte: `gym-be-app/app/scheda_tutorial/views/view_personal.py`.

| Metodo | Percorso | Funzione | Accesso osservato |
|---|---|---|---|
| POST | `/survey/send/` | Salva questionario dell'utente corrente | Autenticato |
| POST | `/personal/form/` | Crea scheda per l'email specificata | Autenticato; il permesso `IsTrainer` verifica il ruolo solo sull'oggetto |
| GET, DELETE | `/personal/form/<id>/` | Dettaglio/eliminazione scheda nel pannello | Autenticato e controllo oggetto trainer/superutente |
| PUT | `/personal/form/<id>/` | Modifica scheda | Autenticato; implementazione manuale senza controllo oggetto esplicito |
| GET | `/personal/all-forms/` | Elenco schede; `user_email` per il trainer | Cliente: proprie pubblicate; trainer: utente indicato, senza filtro assegnazione coach |
| PUT | `/personal/form/publish/<id_form>/` | Commutazione pubblicazione/ritiro | Autenticato; vista manuale senza controllo oggetto esplicito |
| GET | `/personal/my-course/` | Scheda propria pubblicata; query `scheda` opzionale, altrimenti la più recente per creazione | Autenticato e filtro proprietario/pubblicazione |
| GET | `/personal/feedback/` | Verifica token feedback in query | Token non completato |
| POST | `/personal/feedback/` | Salva risposte e invia email | Token non completato nel payload |
| POST | `/coaching-online/choise-coach/` | Salva scelta coach e contesto temporaneo | Autenticato; nessuna verifica server della capienza |
| POST | `/nutrizionist/choise-nutrizionist/` | Invia richiesta al nutrizionista | Autenticato |

La distinzione GET/DELETE rispetto a PUT sul dettaglio personale è intenzionale: i primi sfruttano il recupero oggetto della vista generica, mentre PUT esegue una ricerca ORM manuale. Le classi dei permessi non vanno interpretate soltanto dal loro nome.

## 8. Pagamenti

Fonti: `gym-be-app/app/payments/urls.py`, `views.py`, `services.py`.

| Metodo | Percorso | Funzione | Accesso osservato |
|---|---|---|---|
| POST | `/payments/schede-tutorial/` | Acquisto e assegnazione livelli tutorial | Autenticato; ramo pagamento con anomalie descritte nell'analisi |
| GET, POST | `/payments/sconti/` | Elenco promozioni attive e creazione | Autenticato; `IsAdmin` non applicato al livello generale della richiesta |
| GET, PUT | `/payments/sconti/<codice>/` | Dettaglio/modifica promozione | Autenticato; vista manuale senza controllo ruolo sull'oggetto |
| POST | `/payments/scheda-personalizzata/` | Creazione diretta subscription, percorso precedente | Pubblico/default nella dichiarazione; il metodo usa `request.user.email` |
| GET, POST | `/payments/abbonamenti/` | Lettura listino e creazione prodotto/prezzo | Autenticato, senza controllo amministratore esplicito |
| PUT, DELETE | `/payments/abbonamenti/<product_id>/` | Nuovo prezzo/modifica metadata o disattivazione | Autenticato, senza controllo amministratore esplicito |
| POST | `/payments/create-checkout-session/` | Crea Checkout per prezzo scelto | Autenticato |
| POST | `/payments/create-customer-portal-session/` | Crea URL di accesso al portale Stripe | Autenticato |
| POST | `/payments/webhook/` | Riceve eventi di pagamento/abbonamento | Firma Stripe secondo configurazione |

Il campo di risposta `client_secret` della creazione checkout contiene l'ID della sessione; `portal_session_id` contiene invece un URL. I nomi dei campi non descrivono esattamente il tipo semantico del valore.

La classe `PaySchedePers` presente nel codice non è la vista montata su `/payments/scheda-personalizzata/`: la rotta usa `SubscriptionView`. Il flusso corrente della pagina pagamento usa `CreateCheckoutSessionView`.

## 9. Interfacce tecniche e integrazioni

| Interfaccia | Funzione | Nota |
|---|---|---|
| `/admin/` | Back office Django | Funzioni dipendenti dai modelli registrati e dai permessi Django |
| `/schema-swagger-ui/` | Documentazione delle API | Schema pubblico nella configurazione del progetto; da confrontare con le viste effettive |
| Vimeo dal browser | Avvio upload e riproduzione | Percorso esterno, non API Django |
| Stripe Checkout | Raccolta pagamento abbonamento | Servizio esterno, ritorno a pagine frontend |
| Stripe Customer Portal | Gestione rapporto di fatturazione | Opzioni dipendenti dalla configurazione esterna |
| MailerSend | Messaggi transazionali e template | Contenuto dei template non incluso nei sorgenti |
| Celery Beat / worker | Inviti feedback | Scheduler su database; periodicità effettiva da verificare |

## 10. Disallineamenti frontend/backend da considerare

| Chiamata o componente | Disallineamento osservato |
|---|---|
| `PackService.getConnections()` | Esegue GET su `/tutorial/form/`, ma la vista implementa la creazione POST |
| `PackService.getPackDetailByIdLevelForCoach()` | Costruisce `/tutorial/form/<idPack>/<idLevel>/`, mentre la rotta è `/tutorial/form/coach/<id_level>/` |
| `PackService.deleteLevel()` | Non trasmette i dati che il backend legge dal corpo della richiesta DELETE |
| `UserService.getUser()` | Richiama `/user/`, non presente nelle rotte Django esaminate |
| `CartService.getCartByUserId()` | Richiama `/cart/<id>/`, non presente nelle rotte Django esaminate |
| `CartService.addToCartByUserId()` | Richiama `/user/<id>/pack/<id>/`, non presente nelle rotte Django esaminate |
| Logout dell'interfaccia | Svuota il local storage, senza chiamare `/auth/logout/` |
| Accesso diretto a `/payment` | Non fornisce necessariamente il `subType` che il listino usa |

Le funzioni di servizio non richiamate dal percorso attuale possono essere residui; il loro nome non dimostra che la funzionalità sia disponibile all'utente. Prima di trasformare questo catalogo in un contratto API definitivo occorre stabilire quali percorsi siano supportati ufficialmente e riallineare permessi, payload ed errori.

# Vimeo — checkpoint test effettivi (4 ottobre 2026)

Upload reale completato dal trainer: video 1232641850, 16.675.623 byte, 116 secondi. Elaborazione completa. Non ripetere upload, controllo token o test permessi. Report: docs/TEST_VIMEO_FITNEXUS.md.

Implementati endpoint protetto, TUS, avanzamento/riprova, rimozione token frontend e pulsanti Guarda video. Nove controlli di autorizzazione/validazione superati. Build finale completata (frontend-build.log). Scheda personale: iframe Vimeo ufficiale diretto al posto del componente dipendente da oEmbed.

L'utente HA AUTORIZZATO il 4 ottobre la pubblicazione del solo video 1232641850. PATCH riuscita HTTP 200: view=anybody, embed=public. Evidenza privacy-authorized.json. NON chiedere nuovamente questa autorizzazione. Nessun altro video o default account modificato.

Riproduzione reale nel player ufficiale aperto separatamente: Play, avanzamento a 11,855 secondi e Pause a 31,301 secondi; durata 116,433. Evidenze direct-playback.json/png. Questa prova è PASS e non va ripetuta.

COMPLETATO: l'utente ha confermato nella conversazione «La riproduzione dentro la scheda funziona». Esito PASS manuale per incorporamento e riproduzione nella scheda. Nessun task Vimeo di questo percorso rimasto da riprendere; non ripetere le prove concluse. Restano esclusi gli scenari aggiuntivi elencati nel rapporto. Il riquadro vuoto nel browser automatico e la risposta diagnostica di sicurezza sono conservati come limiti dell'osservazione automatica, senza attribuire loro una causa certa.

URL scheda: http://localhost:3000/personal/detail/user/9206e772-869b-4b1e-9cf0-079a3baee239
Fixture: Vimeo QA playback 20261003, cliente@example.test. Backend/MySQL/Redis/Nginx avviati con overlay Vimeo; Celery/Beat fermi. Email solo locali, Stripe escluso.

Oggetto incompleto del primo tentativo: 1232641528, nessun byte trasferito, conservato. Video riuscito pubblico: 1232641850, conservato. La regola temporanea di conferma passo per passo per la sola configurazione è terminata.


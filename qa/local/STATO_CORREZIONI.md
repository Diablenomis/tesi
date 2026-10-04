# Correzioni sequenziali

Fonte del perimetro: `docs/ESITO_PROVE_LOCALI.md`. Nessun servizio esterno. Non rieseguire il collaudo generale; i report precedenti restano storici.

1. **Permessi schede — COMPLETATO.** IsTrainer verifica il ruolo a livello di richiesta; applicato anche a dettaglio e pubblicazione personali. 99 controlli mirati SQLite e 99 MySQL tutti PASS; utenti trainer/admin consentiti, cliente/altro/staff/anonimo respinti, nessun effetto indesiderato. Report principale aggiornato prima di procedere.
2. **Task feedback — COMPLETATO.** Filtro settimanale corretto; 24 controlli SQLite e 24 MySQL tutti PASS, destinatari/template/scadenze e task misto verificati. Rapporto aggiornato.
3. **Validazione questionario vuoto — COMPLETATO.** 26 controlli SQLite e 27 MySQL superati; incluso il payload browser reale di 48 voci. Nessuna scrittura per input vuoti/malformati; compatibilità con campi facoltativi vuoti. Rapporto aggiornato.
4. **PDF tagliato — COMPLETATO.** Orientamento canvas, wrap parametri (anche superserie), animazione disabilitata nella copia esportata. File reali desktop e viewport 390×844 ispezionati: contenuto completo, controlli geometrici superati. Evidenze fix-pdf-*.pdf/png e fix-pdf-results.json. Rapporto aggiornato prima di procedere.
5. **Questionario dopo errore e sessione scaduta — COMPLETATO.** 11 test Jest superati; browser reale con token QA brevi: 401 conservando dati, nuovo accesso senza reload, access scaduto rinnovato automaticamente, 201 e 48 voci MySQL. Rapporto aggiornato.
6. **Dipendenze di build — COMPLETATO.** Rimosso self, import PayPal tramite ScriptProviderProps["options"], requirements UTF-8 e .dockerignore. Entrambi i Dockerfile del progetto costruiti con exit 0; pip check e Django check PASS, tsc --noEmit PASS, Nginx e GET locale 200 PASS. Evidenze fix-build-*. Rapporto aggiornato; warning dipendenze documentati separatamente.

**TASK COMPLETATO: nessuna problematica concordata rimasta aperta.**

Test fase 1: `qa/local/test_form_permissions.py`, eseguibile standalone su nuovo SQLite o dentro Docker QA tramite shell. Tutte le fixture DB sono annullate. Non lanciare `test_flows.py` sul MySQL popolato. Il volume di collaudo esistente e la cartella utente Elaborato vanno conservati.

Altri runner mirati: `test_feedback_tasks.py`, `test_survey_validation.py`, con la stessa modalità di avvio e rollback delle fixture. Le email vengono soltanto raccolte localmente. I JSON `fix-*-sqlite.json` e `fix-*-mysql.json` sono le evidenze correnti; i JSON originali non vanno riscritti per nascondere gli esiti storici.

Tutte le fasi completate. Durate token QA normali ripristinate. Tutti i container QA fermati, volume conservato. Bundle QA aggiornato dall’immagine frontend verificata. Nessun servizio esterno collaudato.

# Test di carico locale — COMPLETATO

Run: `20261003T095617Z`, 3 ottobre 2026.

- Preparazione: servizi QA mysql, redis, backend e nginx avviati su volume esistente; worker/beat spenti.
- Esecuzione: letture a concorrenza 1/5/10/20 e login 1/5/10, 30 s per fase; riscaldamenti e controllo finale completati.
- Risultati: 8.409 richieste di carico, zero errori; 9.107 richieste includendo warmup e controllo finale, zero errori. Due richieste preflight aggiuntive riuscite.
- Analisi: conteggi e percentili verificati contro CSV; risorse aggregate escludendo campioni a cavallo delle fasi.
- Documentazione: `docs/TEST_CARICO_FITNEXUS.md`; evidenze in `docs/prove-carico/20261003T095617Z/`.
- Chiusura: servizi QA fermati, volume e fixture conservati. Codice applicativo non modificato per il test.

Nessuna attività incompleta. Non ripetere le fasi già concluse per aggiornare la documentazione. I limiti e le eventuali successive prove di capacità sono distinti da questo task completato.

"""Export the current payment checkpoint, excluding checkout URLs from evidence."""
import html
import json
from pathlib import Path
from datetime import datetime, timezone

root = Path(__file__).resolve().parents[2]
state = json.loads((root / '.local-test-artifacts/stripe-payment-run.json').read_text())
target = root / 'docs/prove-stripe/pagamenti-20261003'
target.mkdir(parents=True, exist_ok=True)
safe = json.loads(json.dumps(state))
for case in safe['cases']:
    case.pop('checkout_url', None)
safe['snapshot_at'] = datetime.now(timezone.utc).isoformat()
(target / 'results.json').write_text(json.dumps(safe, indent=2), encoding='utf-8')
rows = []
for case in state['cases']:
    name = 'Scheda personalizzata' if case['kind'] == 'scheda' else 'Coaching online'
    label = '%s — %s mesi — %s EUR' % (name, case['months'], case['amount'] / 100)
    link = '<a href="%s">Apri pagamento di prova</a>' % html.escape(case['checkout_url'], quote=True) if case.get('checkout_url') else html.escape(case['status'])
    rows.append('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % (html.escape(label), html.escape(case['payment_status']), link))
page = '''<!doctype html><html lang="it"><meta charset="utf-8"><title>FitNexus — pagamenti Stripe di prova</title>
<style>body{font:18px system-ui;margin:40px auto;max-width:1000px;padding:20px;color:#18212c}td,th{padding:16px;text-align:left;border-bottom:1px solid #ddd}a{color:#174ea6}aside{padding:20px;background:#eff5ff;border-radius:12px}code{font-size:20px}</style>
<h1>Sei pagamenti di prova FitNexus</h1><p>Ambiente Stripe Sandbox: nessun addebito reale.</p>
<aside>Usa la carta di prova <code>4242 4242 4242 4242</code>, scadenza <code>12/34</code>, CVC <code>123</code> e un nome fittizio. Non salvare i dati con Link. Verifica la dicitura Sandbox prima di confermare.</aside>
<p>La conferma deve essere eseguita manualmente. Dopo il pagamento, torna a questa pagina per il successivo. Gli stati sotto sono una fotografia della preparazione, non si aggiornano automaticamente.</p>
<table><thead><tr><th>Abbonamento e importo per rinnovo</th><th>Stato rilevato</th><th>Checkout</th></tr></thead><tbody>''' + ''.join(rows) + '</tbody></table></html>'
(root / '.local-test-artifacts/frontend-stripe-build/stripe-qa-checkouts.html').write_text(page, encoding='utf-8')
print('Saved sanitized evidence and local checkout index')

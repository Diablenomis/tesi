"""Read-only Stripe configuration check. Never creates checkout sessions or payments."""
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]

def main():
    values = {}
    for line in (ROOT / '.local-test-artifacts/stripe-test.env').read_text(encoding='utf-8-sig').splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            key, value = line.split('=', 1)
            values[key.strip()] = value.strip().strip('\"').strip("'")
    secret = values.get('STRIPE_API_KEY', '')
    public = values.get('STRIPE_PUBLISHABLE_KEY', '')
    if not secret.startswith(('sk_test_', 'rk_test_')) or not public.startswith('pk_test_'):
        raise SystemExit('STOP: required test keys missing or incorrect prefixes. Values not displayed.')

    def get(path, params=None, key=secret):
        url = 'https://api.stripe.com/v1/' + path
        if params:
            url += '?' + urlencode(params)
        try:
            with urlopen(Request(url, headers={'Authorization': 'Bearer ' + key}), timeout=30) as response:
                return json.load(response)
        except HTTPError as exc:
            error = json.load(exc).get('error', {})
            # No provider message, request headers, keys or response bodies in logs.
            raise RuntimeError('Stripe HTTP %s, type=%s, code=%s' % (exc.code, error.get('type'), error.get('code'))) from None

    def collect(path, **params):
        items = []
        while True:
            page = get(path, dict(params, limit=100))
            items.extend(page['data'])
            if not page['has_more']:
                return items
            params['starting_after'] = page['data'][-1]['id']

    account = get('account')
    products = collect('products', active='true')
    prices = collect('prices', active='true')
    catalog = []
    for product in products:
        catalog.append({
            'id': product['id'], 'name': product['name'], 'livemode': product['livemode'],
            'prices': [{k: price.get(k) for k in ('id', 'currency', 'unit_amount', 'recurring', 'livemode', 'type')}
                       for price in prices if price['product'] == product['id']],
        })
    if any(p['livemode'] or any(v['livemode'] for v in p['prices']) for p in catalog):
        raise SystemExit('STOP: unexpected live objects')
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'read_only': True,
              'secret_key_valid': True, 'public_key_test_prefix': True,
              'public_key_pair_verified': False,
              'account_id': account['id'], 'charges_enabled': account.get('charges_enabled'),
              'catalog': catalog,
              'webhook_secret_present': values.get('STRIPE_SIGNATURE_KEY', '').startswith('whsec_')}
    target = ROOT / '.local-test-artifacts/stripe-preflight.json'
    target.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()

"""Verify the served build and public configuration without opening Checkout."""
import json
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from stripe_prepare import ROOT, read_values

values = read_values()
with urlopen('http://localhost:3000/', timeout=15) as response:
    frontend_status = response.status
    csp = response.headers.get('Content-Security-Policy', '')
with urlopen('http://localhost:3000/asset-manifest.json', timeout=15) as response:
    manifest = json.load(response)
with urlopen('http://localhost:3000' + manifest['files']['main.js'], timeout=15) as response:
    bundle = response.read().decode('utf-8')
try:
    with urlopen(Request('http://localhost:8000/payments/abbonamenti/'), timeout=15) as response:
        unauth_status = response.status
except HTTPError as exc:
    unauth_status = exc.code
report = {'frontend_http_status': frontend_status,
          'configured_public_key_in_served_bundle': values['STRIPE_PUBLISHABLE_KEY'] in bundle,
          'private_key_absent_from_served_bundle': values['STRIPE_API_KEY'] not in bundle,
          'signing_secret_absent_from_served_bundle': values['STRIPE_SIGNATURE_KEY'] not in bundle,
          'csp_allows_stripe_js': 'https://js.stripe.com' in csp,
          'catalog_without_auth_http_status': unauth_status,
          'browser_checkout_tested': False}
assert frontend_status == 200 and unauth_status == 401
assert all(report[k] for k in ('configured_public_key_in_served_bundle', 'private_key_absent_from_served_bundle',
                              'signing_secret_absent_from_served_bundle', 'csp_allows_stripe_js'))
(ROOT / '.local-test-artifacts/stripe-frontend-preflight.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))

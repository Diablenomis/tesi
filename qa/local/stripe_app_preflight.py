"""Run through Django shell: read catalog over HTTP and check webhook signing only.

The synthetic webhook has an ignored type; it creates no application/Stripe objects.
"""
import hashlib
import hmac
import json
import os
import time
from importlib.metadata import version
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

from authentication.models import User
from rest_framework_simplejwt.tokens import AccessToken
from mailersend import emails
from payments import views  # Initialize the same Stripe configuration as HTTP workers.
import runtime
import stripe

user = User.objects.filter(email='cliente@example.test', is_active=True).first()
assert user is not None, 'Existing QA customer required'
token = str(AccessToken.for_user(user))
root = 'http://backend:8000'
headers = {'Host': 'localhost', 'Authorization': 'Bearer ' + token}
with urlopen(Request(root + '/payments/abbonamenti/', headers=headers), timeout=45) as response:
    catalog = json.load(response)
    catalog_status = response.status

body = json.dumps({'id': 'evt_local_configuration_probe', 'type': 'qa.configuration_probe',
                   'livemode': False, 'data': {'object': {}}}).encode()
timestamp = str(int(time.time()))
signature = hmac.new(os.environ['STRIPE_SIGNATURE_KEY'].encode(),
                     timestamp.encode() + b'.' + body, hashlib.sha256).hexdigest()

def webhook(sig):
    request = Request(root + '/payments/webhook/', data=body, headers={
        'Host': 'localhost', 'Content-Type': 'application/json', 'Stripe-Signature': sig})
    try:
        with urlopen(request, timeout=15) as response:
            return response.status
    except HTTPError as exc:
        return exc.code

valid_status = webhook('t=' + timestamp + ',v1=' + signature)
invalid_status = webhook('t=' + timestamp + ',v1=' + '0' * 64)
report = {
    'catalog_http_status': catalog_status,
    'catalog': catalog,
    'valid_local_signature_http_status': valid_status,
    'invalid_local_signature_http_status': invalid_status,
    'email_collector_active': emails.NewEmail.send is runtime.offline_send,
    'stripe_sdk_version': version('stripe'),
    'stripe_sdk_api_version': stripe.api_version,
    'test_backend_key_loaded': stripe.api_key.startswith(('sk_test_', 'rk_test_')),
    'return_base_url': os.environ['PROTOCOL_URL'] + os.environ['DOMAIN_URL'],
    'checkout_sessions_created': 0,
    'external_webhook_delivery_tested': False,
}
Path('/workspace/.local-test-artifacts/stripe-app-preflight.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
assert catalog_status == 200 and valid_status == 200 and invalid_status == 400
assert report['email_collector_active'] and report['test_backend_key_loaded']

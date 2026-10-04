"""Create/reuse one checkout through the application, then collect Stripe/DB evidence."""
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen
from authentication.models import User
from rest_framework_simplejwt.tokens import AccessToken
from scheda_tutorial.models.models_personal import Feedback
from scheda_tutorial.models.models_general import TempEmail
from payments import views
import stripe

root = Path('/workspace/.local-test-artifacts')
path = root / 'stripe-payment-run.json'
state = json.loads(path.read_text())
index = int(os.environ['QA_CASE_INDEX'])
case = state['cases'][index]
user = User.objects.get(id=case['user_id'])
if not case.get('session_id'):
    request = Request('http://backend:8000/payments/create-checkout-session/',
                      data=json.dumps({'product_price_id': case['price_id']}).encode(),
                      headers={'Host': 'localhost', 'Content-Type': 'application/json',
                               'Authorization': 'Bearer ' + str(AccessToken.for_user(user))})
    with urlopen(request, timeout=45) as response:
        data = json.load(response)
        case['checkout_http_status'] = response.status
    if data.get('error'):
        case.update(status='checkout_error', error=data['error'])
        path.write_text(json.dumps(state, indent=2))
        print(json.dumps(case, indent=2))
        raise SystemExit(1)
    case['session_id'] = data['client_secret']
    # Persist immediately so interruption never creates a second session.
    path.write_text(json.dumps(state, indent=2))

session = stripe.checkout.Session.retrieve(case['session_id'])
assert session.livemode is False
case.update(status=session.status, payment_status=session.payment_status,
            customer_id=session.customer, subscription_id=session.subscription,
            checkout_url=session.url, amount_total=session.amount_total,
            livemode=session.livemode)
if session.subscription:
    sub = stripe.Subscription.retrieve(session.subscription)
    invoice_id = sub.latest_invoice if isinstance(sub.latest_invoice, str) else sub.latest_invoice.id
    invoice = stripe.Invoice.retrieve(invoice_id)
    case.update(subscription_status=sub.status, invoice_id=invoice.id, invoice_status=invoice.status,
                amount_paid=invoice.amount_paid, invoice_billing_reason=invoice.billing_reason)
    case['feedback_count'] = Feedback.objects.filter(user=user, tipo='mensile').count()
    case['coach_selection_pending'] = TempEmail.objects.filter(email=user.email).exists()
    # Store only metadata from the email collector, never questionnaire contents or tokens.
    messages = []
    for line in (root / 'outbox.jsonl').read_text().splitlines():
        record = json.loads(line)
        body = record['body']
        if user.email in json.dumps(body):
            messages.append({'time': record['time'], 'subject': body.get('subject'),
                             'template_id': body.get('template_id'), 'recipients': body.get('to')})
    case['local_messages'] = messages
path.write_text(json.dumps(state, indent=2))
print(json.dumps(case, indent=2))

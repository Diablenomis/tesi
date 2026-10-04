"""Correlate existing Stripe events with local delivery logs; never creates payments."""
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from payments import views
import stripe

root = Path('/workspace')
state = json.loads((root / '.local-test-artifacts/stripe-payment-run.json').read_text())
log = (root / '.local-test-artifacts/stripe-payment-listener.log').read_text()
deliveries = {}
for status, event_id in re.findall(r'\[(\d{3})\] POST .*?\[(evt_[A-Za-z0-9]+)\]', log):
    deliveries.setdefault(event_id, []).append(int(status))
customers = {c['customer_id'] for c in state['cases']}
start = int(datetime(2026, 10, 3, 13, 30, tzinfo=timezone.utc).timestamp())
events = []
for kind in ('checkout.session.completed', 'customer.subscription.created', 'invoice.payment_succeeded'):
    for event in stripe.Event.list(type=kind, created={'gte': start}, limit=100).auto_paging_iter():
        obj = event.data.object
        if obj.get('customer') not in customers:
            continue
        assert event.livemode is False
        events.append({'event_id': event.id, 'type': event.type, 'object_id': obj.id,
                       'customer_id': obj.customer, 'created': event.created,
                       'api_version': event.api_version, 'http_statuses': deliveries.get(event.id, [])})

cases = []
for case in state['cases']:
    correlated = [e for e in events if e['customer_id'] == case['customer_id']]
    expected = {'checkout.session.completed': case['session_id'],
                'customer.subscription.created': case['subscription_id'],
                'invoice.payment_succeeded': case['invoice_id']}
    checks = {
        'session_complete': case['status'] == 'complete',
        'payment_paid': case['payment_status'] == 'paid',
        'subscription_active': case['subscription_status'] == 'active',
        'invoice_paid': case['invoice_status'] == 'paid',
        'amount_correct': case['amount'] == case['amount_total'] == case['amount_paid'],
        'test_mode': case['livemode'] is False,
        'first_invoice': case['invoice_billing_reason'] == 'subscription_create',
        'three_correlated_webhooks': all(any(e['type'] == kind and e['object_id'] == oid
                                           and 200 in e['http_statuses'] for e in correlated)
                                        for kind, oid in expected.items()),
        'no_webhook_http_errors': all(e['http_statuses'] and all(s == 200 for s in e['http_statuses']) for e in correlated),
        'feedback_count_correct': case['feedback_count'] == (case['months'] - 1 if case['kind'] == 'scheda' else 0),
        'local_email_count_correct': len(case['local_messages']) == (3 if case['kind'] == 'scheda' else 4),
        'coach_selection_consumed': not case['coach_selection_pending'],
    }
    cases.append({'kind': case['kind'], 'months': case['months'], 'checks': checks,
                  'outcome': 'PASS' if all(checks.values()) else 'FAIL', 'events': correlated})
report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'cases': cases,
          'passed': sum(c['outcome'] == 'PASS' for c in cases), 'total': len(cases),
          'event_count': len(events), 'local_message_count': sum(len(c['local_messages']) for c in state['cases']),
          'test_total_eur': sum(c['amount_paid'] for c in state['cases']) / 100}
target = root / 'docs/prove-stripe/pagamenti-20261003/reconciliation.json'
target.write_text(json.dumps(report, indent=2))
print(json.dumps({k: v for k, v in report.items() if k != 'cases'}, indent=2))
assert report['passed'] == 6

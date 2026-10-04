"""Local fixture checks only; every Stripe call is mocked, no database writes."""
import json
from pathlib import Path
from unittest.mock import patch
from payments.services import invoice_payment_reference, invoice_subscription_months

checks = []
def check(name, actual, expected):
    assert actual == expected, (name, actual, expected)
    checks.append(name)

with patch('stripe.Invoice.retrieve') as retrieve_invoice, patch('stripe.Price.retrieve') as retrieve_price:
    check('legacy payment intent', invoice_payment_reference({'id': 'in_local', 'payment_intent': 'pi_local'}), 'pi_local')
    retrieve_invoice.assert_not_called()
    fixture = {'id': 'in_local', 'payments': {'data': [
        {'status': 'paid', 'payment': {'payment_intent': 'pi_one'}},
        {'status': 'paid', 'payment': {'payment_intent': {'id': 'pi_two'}}},
        {'status': 'open', 'payment': {'payment_intent': 'pi_unpaid'}},
    ]}}
    check('modern multiple paid references', invoice_payment_reference(fixture), 'pi_one, pi_two')
    retrieve_invoice.return_value = fixture
    check('modern unexpanded payments', invoice_payment_reference({'id': 'in_local'}), 'pi_one, pi_two')
    retrieve_invoice.assert_called_once_with('in_local', expand=['payments'])
    check('zero-value invoice reference', invoice_payment_reference({'id': 'in_local', 'payments': {'data': []}}), 'in_local')
    for months in (1, 3, 6):
        check('legacy %s months' % months, invoice_subscription_months({'lines': {'data': [
            {'plan': {'interval': 'month', 'interval_count': months}}]}}), months)
        retrieve_price.return_value = {'recurring': {'interval': 'month', 'interval_count': months}}
        check('modern %s months' % months, invoice_subscription_months({'lines': {'data': [
            {'pricing': {'price_details': {'price': 'price_local'}}}]}}), months)
    retrieve_price.assert_called_with('price_local')
    check('expanded legacy price', invoice_subscription_months({'lines': {'data': [
        {'price': {'recurring': {'interval': 'month', 'interval_count': 3}}}]}}), 3)
    check('yearly recurrence', invoice_subscription_months({'lines': {'data': [
        {'plan': {'interval': 'year', 'interval_count': 1}}]}}), 12)
    try:
        invoice_subscription_months({'lines': {'data': [{'plan': {'interval': 'week', 'interval_count': 1}}]}})
        raise AssertionError('Unsupported recurrence accepted')
    except ValueError:
        checks.append('weekly recurrence rejected explicitly')

report = {'passed': len(checks), 'checks': checks, 'stripe_calls': 'mocked', 'database_writes': 0}
Path('/workspace/.local-test-artifacts/stripe-invoice-compatibility.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))

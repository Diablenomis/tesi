"""Local test listener; redact secrets from logs and stop when requested by file."""
import os
import re
import subprocess
import threading
import time
from stripe_prepare import ROOT, read_values

values = read_values()
assert values['STRIPE_API_KEY'].startswith(('sk_test_', 'rk_test_'))
stop = ROOT / '.local-test-artifacts/stripe-listener.stop'
if stop.exists():
    stop.unlink()
env = dict(os.environ, STRIPE_API_KEY=values['STRIPE_API_KEY'], STRIPE_DEVICE_NAME='fitnexus-local-qa',
           XDG_CONFIG_HOME=str(ROOT / '.local-test-artifacts/stripe-cli-config'))
cli = ROOT / '.local-test-artifacts/stripe-cli/stripe.exe'
proc = subprocess.Popen([str(cli), 'listen', '--forward-to', 'http://localhost:8000/payments/webhook/',
    '--events', 'checkout.session.completed,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted'],
    env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

def consume():
    with (ROOT / '.local-test-artifacts/stripe-payment-listener.log').open('a', encoding='utf-8') as log:
        for line in proc.stdout:
            line = re.sub(r'(?:sk|rk|pk)_(?:test|live)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+', '[REDACTED]', line)
            log.write(line)
            log.flush()
            print(line.rstrip(), flush=True)

reader = threading.Thread(target=consume, daemon=True)
reader.start()
try:
    while proc.poll() is None and not stop.exists():
        time.sleep(0.5)
finally:
    if proc.poll() is None:
        proc.terminate()
    proc.wait(timeout=10)
    reader.join(timeout=5)
print('Listener stopped', flush=True)

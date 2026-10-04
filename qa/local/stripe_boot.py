"""Opt-in Stripe test transport; keep the existing local email collector."""
import os
import runpy
from pathlib import Path

secret = os.environ.get('STRIPE_API_KEY', '')
signature = os.environ.get('STRIPE_SIGNATURE_KEY', '')
if not secret.startswith(('sk_test_', 'rk_test_')):
    raise SystemExit('Stripe QA requires a test API key')
if not signature.startswith('whsec_'):
    raise SystemExit('Stripe QA requires the local CLI webhook signing secret')

import runtime
os.environ['STRIPE_API_KEY'] = secret
os.environ['STRIPE_SIGNATURE_KEY'] = signature
runpy.run_path(str(Path(__file__).with_name('docker_boot.py')), run_name='__main__')

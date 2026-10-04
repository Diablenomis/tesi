"""Prepare local Stripe CLI and frontend. Does not trigger Stripe events/payments."""
import os
import re
import subprocess
import shutil
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = ROOT / '.local-test-artifacts/stripe-test.env'

def read_values():
    return dict((key.strip(), value.strip().strip('\"').strip("'"))
                for line in ENV_FILE.read_text(encoding='utf-8-sig').splitlines()
                if '=' in line and not line.lstrip().startswith('#')
                for key, value in [line.split('=', 1)])

def main():
    values = read_values()
    if not values.get('STRIPE_API_KEY', '').startswith(('sk_test_', 'rk_test_')):
        raise SystemExit('Test API key required')
    if sys.argv[1] in ('webhook', 'connection'):
        env = dict(os.environ, STRIPE_API_KEY=values['STRIPE_API_KEY'],
                   STRIPE_DEVICE_NAME='fitnexus-local-qa',
                   XDG_CONFIG_HOME=str(ROOT / '.local-test-artifacts/stripe-cli-config'))
        cli = shutil.which('stripe') or ROOT / '.local-test-artifacts/stripe-cli/stripe.exe'
        if sys.argv[1] == 'connection':
            # Receive only: no --forward-to and no trigger. Stop after connection check.
            process = subprocess.Popen([str(cli), 'listen', '--events', 'checkout.session.completed'],
                                       env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            try:
                stdout, stderr = process.communicate(timeout=15)
            except subprocess.TimeoutExpired:
                process.terminate()
                stdout, stderr = process.communicate(timeout=10)
            output = stdout + stderr
            match = re.search(r'whsec_[A-Za-z0-9]+', output)
            api = re.search(r'API Version\s*\[([^\]]+)\]', output, re.IGNORECASE)
            report = {'cli_connected': 'Ready!' in output,
                      'signing_secret_matches': bool(match and match.group() == values.get('STRIPE_SIGNATURE_KEY')),
                      'webhook_api_version': api.group(1) if api else None,
                      'forwarding_enabled': False, 'listener_stopped': True}
            (ROOT / '.local-test-artifacts/stripe-cli-preflight.json').write_text(json.dumps(report, indent=2))
            print(json.dumps(report, indent=2))
            if not report['cli_connected']:
                print(re.sub(r'(?:sk|rk|pk)_(?:test|live)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+',
                             '[REDACTED]', output)[-1800:])
            raise SystemExit(0 if report['cli_connected'] and report['signing_secret_matches'] else 1)
        result = subprocess.run([str(cli), 'listen', '--print-secret'], env=env,
                                capture_output=True, text=True, timeout=60)
        secret = re.search(r'whsec_[A-Za-z0-9]+', result.stdout)
        if result.returncode or not secret:
            # Redact credentials if the CLI includes them in diagnostics.
            diagnostic = re.sub(r'(?:sk|rk|pk)_(?:test|live)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+',
                                '[REDACTED]', result.stderr)
            raise SystemExit('CLI setup failed: ' + diagnostic[-1500:])
        lines = [line for line in ENV_FILE.read_text(encoding='utf-8-sig').splitlines()
                 if not line.strip().startswith('STRIPE_SIGNATURE_KEY=')]
        ENV_FILE.write_text('\n'.join(lines) + '\nSTRIPE_SIGNATURE_KEY=' + secret.group() + '\n', encoding='utf-8')
        print('CLI authenticated in test mode; signing secret saved locally. No listener left running.')
    elif sys.argv[1] == 'build':
        key = values.get('STRIPE_PUBLISHABLE_KEY', '')
        if not key.startswith('pk_test_'):
            raise SystemExit('Test publishable key required')
        # Only the public key is passed to the frontend build.
        env = {k: v for k, v in os.environ.items() if not k.startswith('STRIPE_')}
        env.update(REACT_APP_STRIPE_PUBLISHABLE_KEY=key,
                   BUILD_PATH=str(ROOT / '.local-test-artifacts/frontend-stripe-build'),
                   GENERATE_SOURCEMAP='false', DISABLE_ESLINT_PLUGIN='true', CI='false')
        node = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
        with (ROOT / '.local-test-artifacts/stripe-build.log').open('w', encoding='utf-8') as log:
            result = subprocess.run([str(node), 'node_modules/react-scripts/scripts/build.js'],
                                    cwd=ROOT / 'gym-fe-app', env=env, stdout=log, stderr=subprocess.STDOUT)
        print('Frontend build exit code:', result.returncode)
        raise SystemExit(result.returncode)
    else:
        raise SystemExit('Use webhook, connection or build')

if __name__ == '__main__':
    main()

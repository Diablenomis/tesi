"""Only transport is replaced: real Django views, serializers, models and JWT run."""
import os
import sys
import json
import socket
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
ARTIFACTS = ROOT / '.local-test-artifacts'
ARTIFACTS.mkdir(exist_ok=True)
sys.path.insert(0, str(ROOT / '.local-test-deps'))
sys.path.insert(0, str(ROOT / 'gym-be-app' / 'app'))
sys.path.insert(0, str(Path(__file__).parent))
os.environ.update({
    'DJANGO_SETTINGS_MODULE': 'qa_settings',
    'MAILERSEND_API_KEY': 'offline-test-placeholder',
    'STRIPE_API_KEY': 'offline-test-placeholder',
    'EMAIL_FROM': 'team@example.test', 'EMAIL_FOR_SURVEY': 'team@example.test',
    'PROTOCOL_URL': 'http://', 'DOMAIN_URL': 'localhost:3000',
})
os.environ.pop('ALL_FREE', None)
os.chdir(ROOT / 'gym-be-app' / 'app')

OUTBOX = []
SEND_STATUS = '202'
BLOCKED_NETWORK = []
original_connect = socket.socket.connect
original_connect_ex = socket.socket.connect_ex

def check_address(address):
    if isinstance(address, tuple) and str(address[0]) not in ('127.0.0.1', '::1', 'localhost'):
        BLOCKED_NETWORK.append(str(address))
        raise RuntimeError('External network disabled in local QA')

def guarded_connect(sock, address):
    check_address(address)
    return original_connect(sock, address)

def guarded_connect_ex(sock, address):
    check_address(address)
    return original_connect_ex(sock, address)

def offline_send(self, body):
    OUTBOX.append(json.loads(json.dumps(body, default=str)))
    with (ARTIFACTS / 'outbox.jsonl').open('a', encoding='utf-8') as stream:
        stream.write(json.dumps({'time': datetime.now(timezone.utc).isoformat(), 'body': body}, default=str) + '\n')
    return SEND_STATUS

def setup(database=None):
    if database:
        os.environ['LOCAL_QA_DB'] = str(database)
    elif not os.environ.get('LOCAL_QA_DB'):
        os.environ['LOCAL_QA_DB'] = json.loads((ARTIFACTS / 'session.json').read_text())['database']
    socket.socket.connect = guarded_connect
    socket.socket.connect_ex = guarded_connect_ex
    from mailersend import emails
    emails.NewEmail.send = offline_send
    import django
    django.setup()
    sys.stdout = sys.__stdout__

if __name__ == '__main__':
    setup()
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', *sys.argv[1:]])

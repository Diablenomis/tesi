"""Regression for invitation routing; provider transport stays local."""
import json
import uuid
from datetime import date, datetime, timedelta
import runtime
from django.apps import apps

if not apps.ready:
    runtime.setup(runtime.ARTIFACTS / ('feedback-' + uuid.uuid4().hex + '.sqlite3'))
    from django.core.management import call_command
    call_command('migrate', verbosity=0, interactive=False)

from django.conf import settings
from django.db import transaction
from authentication.models import User
from scheda_tutorial.models.models_personal import FormSP, Feedback
from scheda_tutorial import tasks

results = []
def check(name, actual, expected):
    results.append({'case': name, 'actual': actual, 'expected': expected,
                    'outcome': 'PASS' if actual == expected else 'FAIL'})

with transaction.atomic():
    # Temporarily exclude older QA fixtures; rollback restores every existing row.
    Feedback.objects.update(inviato=True)
    suffix = uuid.uuid4().hex[:12]
    users = {}
    for kind in ['weekly', 'monthly']:
        users[kind] = User.objects.create_user(username=kind+suffix,
            email=kind+suffix+'@example.test', name='QA', surname=kind,
            gender='M', bday='1990-01-01', password='LocalQa2026!')
    form = FormSP.objects.create(name='Weekly QA', user=users['weekly'])
    for kind, limit in [('settimanale', 1), ('mensile', 3)]:
        relation = {'form': form} if kind == 'settimanale' else {'user': users['monthly']}
        for label, offset, sent in [('today', 0, False), ('boundary', -limit, False),
                                     ('future', 1, False), ('old', -limit-1, False), ('done', 0, True)]:
            Feedback.objects.create(tipo=kind, token=kind+'-'+label, inviato=sent,
                da_inviare=date.today()+timedelta(days=offset), **relation)

    for name, fn, kinds in [('weekly', tasks.feedback_settimanale, ['settimanale']),
                             ('monthly', tasks.feedback_mensile, ['mensile']),
                             ('combined', tasks.my_task, ['settimanale', 'mensile'])]:
        before = len(runtime.OUTBOX)
        fn()
        messages = runtime.OUTBOX[before:]
        expected_tokens = sorted(kind+'-'+label for kind in kinds for label in ['today', 'boundary'])
        check(name+' due tokens only', sorted(m['personalization'][0]['data']['token'] for m in messages), expected_tokens)
        check(name+' email count', len(messages), len(expected_tokens))
        for message in messages:
            item = message['personalization'][0]
            weekly = item['data']['token'].startswith('settimanale')
            check(name+' recipient '+item['data']['token'], item['email'], users['weekly' if weekly else 'monthly'].email)
            check(name+' template '+item['data']['token'], message['template_id'],
                  'jpzkmgq68y24059v' if weekly else 'vywj2lp6q7k47oqz')
    check('invitation does not consume response token', Feedback.objects.filter(token='settimanale-today', inviato=False).exists(), True)
    check('monthly fixture has no form', Feedback.objects.get(token='mensile-today').form_id, None)
    transaction.set_rollback(True)

engine = 'mysql' if 'mysql' in settings.DATABASES['default']['ENGINE'] else 'sqlite'
output = runtime.ROOT / 'docs/prove-locali' / ('fix-feedback-' + engine + '.json')
output.write_text(json.dumps({'date': datetime.now().isoformat(), 'engine': engine,
    'transport': 'local email collector', 'fixture_cleanup': 'transaction rolled back', 'results': results}, indent=2))
failures = [r for r in results if r['outcome'] != 'PASS']
print(json.dumps({'checks': len(results), 'failures': failures, 'report': str(output)}, indent=2))
assert not failures

"""Reject empty/malformed survey data before creating database records."""
import json
import uuid
from datetime import datetime
import runtime
from django.apps import apps

if not apps.ready:
    runtime.setup(runtime.ARTIFACTS / ('survey-' + uuid.uuid4().hex + '.sqlite3'))
    from django.core.management import call_command
    call_command('migrate', verbosity=0, interactive=False)

from django.conf import settings
from django.db import transaction
from authentication.models import User
from scheda_tutorial.models.models_personal import Survey, Question
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

results = []
def check(name, actual, expected):
    results.append({'case': name, 'actual': actual, 'expected': expected,
                    'outcome': 'PASS' if actual == expected else 'FAIL'})

with transaction.atomic():
    suffix = uuid.uuid4().hex[:12]
    user = User.objects.create_user(username='survey'+suffix, email='survey'+suffix+'@example.test',
        name='QA', surname='Survey', gender='M', bday='1990-01-01', password='LocalQa2026!')
    user.is_verified = True
    user.save()
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Bearer '+str(RefreshToken.for_user(user).access_token))
    invalid = [({}, 'missing list'), ({'survey': []}, 'empty list'),
               ({'survey': None}, 'null list'), ({'survey': {}}, 'wrong list type'),
               ({'survey': [{'question':'Peso'}]}, 'missing answer'),
               ({'survey': [{'answer':'70'}]}, 'missing question'),
               ({'survey': [{'question':'Peso','answer':None}]}, 'null answer'),
               ({'survey': [{'question':'Peso','answer':{}}]}, 'wrong answer type'),
               ({'survey': [{'question':'Peso','answer':'  '}]}, 'blank only'),
               ({'survey': [{'question':'','answer':'70'}]}, 'unnamed only'),
               ({'survey': [{'question':'Peso','answer':'70'},{}]}, 'invalid later entry')]
    for data, label in invalid:
        before = [Survey.objects.count(), Question.objects.count()]
        response = client.post('/survey/send/', data, format='json')
        check(label+' response', response.status_code, 400)
        check(label+' no writes', [Survey.objects.count(), Question.objects.count()], before)
    valid = [{'question':'Peso','answer':'70'}, {'question':'Immagine facoltativa','answer':''},
             {'question':'','answer':''}]
    response = client.post('/survey/send/', {'survey':valid}, format='json')
    check('valid with optional blanks', response.status_code, 201)
    survey = Survey.objects.get(user=user)
    check('all entries persisted', survey.questions.count(), 3)
    check('answer persisted', survey.questions.get(question='Peso').answer, '70')
    # The current QA DB contains the actual 48-entry submission from the browser.
    browser_survey = Survey.objects.filter(user__email='cliente@example.test').order_by('-created_at').first()
    if browser_survey:
        data = list(browser_survey.questions.values('question', 'answer'))
        check('existing browser payload', client.post('/survey/send/', {'survey': data}, format='json').status_code, 201)
    client.credentials()
    check('anonymous still rejected', client.post('/survey/send/', {'survey':valid}, format='json').status_code, 401)
    transaction.set_rollback(True)

engine = 'mysql' if 'mysql' in settings.DATABASES['default']['ENGINE'] else 'sqlite'
output = runtime.ROOT / 'docs/prove-locali' / ('fix-survey-' + engine + '.json')
output.write_text(json.dumps({'date': datetime.now().isoformat(), 'engine': engine,
    'fixture_cleanup': 'transaction rolled back', 'results': results}, indent=2))
failures = [r for r in results if r['outcome'] != 'PASS']
print(json.dumps({'checks': len(results), 'failures': failures, 'report': str(output)}, indent=2))
assert not failures

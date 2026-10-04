"""Targeted regression: management roles and absence of forbidden side effects.

Standalone: new SQLite database. Docker shell: current QA DB, all fixtures rolled back.
"""
import json
import uuid
from datetime import datetime
import runtime
from django.apps import apps

if not apps.ready:
    runtime.setup(runtime.ARTIFACTS / ('permissions-' + uuid.uuid4().hex + '.sqlite3'))
    from django.core.management import call_command
    call_command('migrate', verbosity=0, interactive=False)

from django.conf import settings
from django.db import transaction
from authentication.models import User
from scheda_tutorial.models.models_personal import FormSP, Feedback
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

results = []
client = APIClient()

def check(label, actual, expected):
    results.append({'case': label, 'actual': actual, 'expected': expected,
                    'outcome': 'PASS' if actual == expected else 'FAIL'})

def request(actor, method, url, payload=None):
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(RefreshToken.for_user(actor).access_token)
                       if actor else '')
    return getattr(client, method)(url, payload, format='json')

with transaction.atomic():
    suffix = uuid.uuid4().hex[:12]
    actors = {}
    for role in ['customer', 'other', 'staff', 'trainer', 'admin']:
        actors[role] = User.objects.create_user(
            username=role+suffix, email=role+suffix+'@example.test', name='QA', surname=role,
            gender='M', bday='1990-01-01', password='LocalQa2026!')
        actor = actors[role]
        actor.is_verified = True
        actor.is_staff = role in ['staff', 'admin']
        actor.is_superuser = role == 'admin'
        actor.is_trainer = role == 'trainer'
        actor.save()
    actors['anonymous'] = None
    payload = {'name': 'Permissions regression', 'user_email': actors['customer'].email,
               'weeks': [{'number': 1, 'name': 'Week QA', 'days': []}]}
    for role, actor in actors.items():
        allowed = role in ['trainer', 'admin']
        denied = 401 if actor is None else 403
        form = FormSP.objects.create(name='Original QA', user=actors['customer'])
        detail = '/personal/form/' + str(form.id) + '/'
        publish = '/personal/form/publish/' + str(form.id) + '/'
        before_forms = FormSP.objects.count()
        response = request(actor, 'post', '/personal/form/', payload)
        check(role+' create', response.status_code, 201 if allowed else denied)
        check(role+' create persistence', FormSP.objects.count()-before_forms, 1 if allowed else 0)
        check(role+' management read', request(actor, 'get', detail).status_code, 200 if allowed else denied)
        response = request(actor, 'put', detail, payload)
        check(role+' update', response.status_code, 200 if allowed else denied)
        form.refresh_from_db()
        check(role+' name persistence', form.name, payload['name'] if allowed else 'Original QA')
        check(role+' nested persistence', form.weeks.count(), 1 if allowed else 0)
        for initial, action in [(False, 'publish'), (True, 'withdraw')]:
            form.published = initial
            form.save()
            feedback_before = Feedback.objects.count()
            emails_before = len(runtime.OUTBOX)
            response = request(actor, 'put', publish)
            check(role+' '+action, response.status_code, 200 if allowed else denied)
            form.refresh_from_db()
            check(role+' '+action+' state', form.published, not initial if allowed else initial)
            check(role+' '+action+' feedback', Feedback.objects.count()-feedback_before,
                  1 if allowed and not initial else 0)
            check(role+' '+action+' emails', len(runtime.OUTBOX)-emails_before,
                  1 if allowed and not initial else 0)
        response = request(actor, 'delete', detail)
        check(role+' delete', response.status_code, 204 if allowed else denied)
        check(role+' delete persistence', FormSP.objects.filter(id=form.id).exists(), not allowed)
    published = FormSP.objects.create(name='Personal read QA', user=actors['customer'], published=True)
    path = '/personal/my-course/?scheda=' + str(published.id)
    check('owner personal read', request(actors['customer'], 'get', path).status_code, 200)
    check('other personal read', request(actors['other'], 'get', path).status_code, 404)
    check('anonymous personal read', request(None, 'get', path).status_code, 401)
    transaction.set_rollback(True)

engine = 'mysql' if 'mysql' in settings.DATABASES['default']['ENGINE'] else 'sqlite'
report = {'date': datetime.now().isoformat(), 'engine': engine,
          'fixture_cleanup': 'transaction rolled back', 'results': results}
out = runtime.ROOT / 'docs/prove-locali' / ('fix-permissions-' + engine + '.json')
out.write_text(json.dumps(report, indent=2, ensure_ascii=False))
failures = [r for r in results if r['outcome'] != 'PASS']
print(json.dumps({'checks': len(results), 'failures': failures, 'report': str(out)}, indent=2))
assert not failures, 'Permission regression failed'

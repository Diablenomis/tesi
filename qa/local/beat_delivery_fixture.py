"""Run via docker_boot.py shell: prepare, verify and remove only this run's QA data."""
import json
from datetime import date, timedelta
from pathlib import Path
from django.utils import timezone
from django_celery_beat.models import ClockedSchedule, PeriodicTask
from scheda_tutorial.models.models_personal import Feedback, FormSP
from celery.result import AsyncResult
from gym.celery import app
import runtime

config_path = runtime.ARTIFACTS / 'beat-delivery-session.json'
config = json.loads(config_path.read_text())
out = runtime.ROOT / config['output']
mode = config['mode']
prefix = config['run']

if mode == 'prepare':
    assert not PeriodicTask.objects.filter(name=prefix).exists()
    session = json.loads((runtime.ARTIFACTS / 'session.json').read_text())
    form = FormSP.objects.select_related('user').get(pk=session['form_id'])
    assert form.user.email.endswith('@example.test')
    ids = []
    for label, kind, offset, done in [
        ('weekly', 'settimanale', 0, False), ('monthly', 'mensile', 0, False),
        ('future', 'settimanale', 2, False), ('completed', 'mensile', 0, True)]:
        relation = {'form': form} if kind == 'settimanale' else {'user': form.user}
        row = Feedback.objects.create(tipo=kind, token=prefix+'-'+label,
            da_inviare=date.today()+timedelta(days=offset), inviato=done, **relation)
        ids.append(str(row.pk))
    clock = ClockedSchedule.objects.create(clocked_time=timezone.now()+timedelta(seconds=20))
    periodic = PeriodicTask.objects.create(name=prefix, task='scheda_tutorial.tasks.my_task',
        clocked=clock, one_off=True, enabled=True, queue='qa-beat-verification')
    config.update({'feedback_ids':ids, 'clock_id':clock.pk, 'periodic_id':periodic.pk,
        'recipient':form.user.email, 'scheduled_utc':str(clock.clocked_time)})
    config_path.write_text(json.dumps(config, indent=2))
    (out/'schedule.json').write_text(json.dumps({k:config[k] for k in
        ['run','scheduled_utc','periodic_id','clock_id']},indent=2))
    print('PREPARED: one-off Beat task, dedicated queue, four QA feedback fixtures')

elif mode == 'verify':
    result = AsyncResult(config['task_id'], app=app)
    checks = []
    def check(name, actual, expected):
        checks.append({'test':name,'actual':actual,'expected':expected,'pass':actual==expected})
    check('Redis result backend reports SUCCESS', result.state, 'SUCCESS')
    check('task return value', result.result, None)
    messages = []
    for line in (runtime.ARTIFACTS/'outbox.jsonl').read_text().splitlines():
        body = json.loads(line)['body']
        personal = body.get('personalization', [{}])[0]
        if str(personal.get('data', {}).get('token', '')).startswith(prefix+'-'):
            messages.append(body)
    check('exactly two invitations captured', len(messages), 2)
    labels = sorted(m['personalization'][0]['data']['token'][len(prefix)+1:] for m in messages)
    check('only due weekly and monthly invitations', labels, ['monthly','weekly'])
    evidence = []
    for message in messages:
        personal = message['personalization'][0]
        label = personal['data']['token'][len(prefix)+1:]
        check(label+' recipient', personal['email'], config['recipient'])
        expected = 'jpzkmgq68y24059v' if label=='weekly' else 'vywj2lp6q7k47oqz'
        check(label+' template', message['template_id'], expected)
        evidence.append({'kind':label,'recipient':personal['email'],'template':message['template_id'],
            'transport':'local collector; acceptance simulated as 202'})
    check('invitation does not consume response tokens', Feedback.objects.filter(
        token__in=[prefix+'-weekly',prefix+'-monthly'],inviato=False).count(),2)
    check('monthly fixture has no form', Feedback.objects.get(token=prefix+'-monthly').form_id,None)
    periodic = PeriodicTask.objects.get(pk=config['periodic_id'])
    report = {'run':prefix,'task_id':config['task_id'],'task':'scheda_tutorial.tasks.my_task',
        'trigger':'Celery Beat DatabaseScheduler, ClockedSchedule one_off, dedicated Redis queue',
        'state':result.state,'date_done':str(result.date_done),'checks':checks,'messages':evidence,
        'schedule_after_execution':{'enabled':periodic.enabled,'one_off':periodic.one_off,
            'total_run_count':periodic.total_run_count},
        'external_email_delivery_tested':False}
    (out/'result.json').write_text(json.dumps(report,indent=2,default=str))
    print(json.dumps({'state':result.state,'checks':len(checks),'failures':[c for c in checks if not c['pass']]},indent=2))
    assert all(c['pass'] for c in checks)

elif mode == 'cleanup':
    # Executed after stopping the dedicated Beat/worker, never updates older fixtures.
    task = PeriodicTask.objects.filter(pk=config.get('periodic_id'),name=prefix).first()
    if task:
        task.enabled = False
        task.save()  # Notify DatabaseScheduler correctly before removal.
        task.delete()
    Feedback.objects.filter(pk__in=config.get('feedback_ids',[]),token__startswith=prefix+'-').delete()
    ClockedSchedule.objects.filter(pk=config.get('clock_id'),periodictask__isnull=True).delete()
    remaining = Feedback.objects.filter(token__startswith=prefix+'-').count()
    (out/'cleanup.json').write_text(json.dumps({'remaining_test_feedback':remaining,
        'periodic_task_removed':not PeriodicTask.objects.filter(name=prefix).exists(),
        'existing_fixtures':'preserved; only run-specific records removed'},indent=2))
    assert remaining == 0
    print('CLEANUP_OK')

"""Executed using docker_boot.py shell; only QA fixtures are involved."""
import json
from pathlib import Path
from gym.celery import app
from scheda_tutorial.tasks import my_task
from django_celery_beat.models import IntervalSchedule, PeriodicTask

print('WORKER_PING', app.control.inspect(timeout=5).ping())
result = my_task.delay()
try:
    result.get(timeout=30)
except Exception as exc:
    print('TASK_EXCEPTION', type(exc).__name__, str(exc))
print('TASK_STATE', result.state)
schedule, _ = IntervalSchedule.objects.get_or_create(every=10, period='seconds')
PeriodicTask.objects.update_or_create(name='QA local scheduling', defaults={
    'task': 'scheda_tutorial.tasks.my_task', 'interval': schedule, 'enabled': True,
})

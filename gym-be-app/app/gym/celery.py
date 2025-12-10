import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym.settings')

app = Celery('gym',
             broker='redis://redis:6379/0',
             backend='redis://redis:6379/0',
             include=['gym'])

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
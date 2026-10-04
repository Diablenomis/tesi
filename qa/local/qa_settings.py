"""Isolated settings for local functional tests; production settings are untouched."""
import sys
import os
from pathlib import Path
from gym.settings import *  # noqa: F403

sys.stdout = sys.__stdout__
ROOT = Path(__file__).resolve().parents[2]
SECRET_KEY = 'local-functional-tests-only-not-a-production-secret'
DEBUG = False
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'testserver']
CORS_ALLOWED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
DATABASES = {'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.environ['LOCAL_QA_DB'],
    'ATOMIC_REQUESTS': True,
}}
LOGGING = {'version': 1, 'disable_existing_loggers': False,
           'handlers': {'null': {'class': 'logging.NullHandler'}},
           'root': {'handlers': ['null'], 'level': 'CRITICAL'},
           'loggers': {name: {'handlers': ['null'], 'propagate': False}
                       for name in ['authentication', 'coach', 'gym', 'payments', 'scheda_tutorial', 'django.request']}}
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_BROKER_URL = 'memory://'
CELERY_RESULT_BACKEND = 'cache+memory://'

from qa_settings import *
from datetime import timedelta

# Optional short lifetimes for browser session-recovery tests only.
SIMPLE_JWT = {**SIMPLE_JWT,
    'ACCESS_TOKEN_LIFETIME': timedelta(seconds=int(os.environ.get('LOCAL_QA_ACCESS_SECONDS', '3600'))),
    'REFRESH_TOKEN_LIFETIME': timedelta(seconds=int(os.environ.get('LOCAL_QA_REFRESH_SECONDS', '86400'))),
}

DATABASES = {'default': {
    'ENGINE': 'django.db.backends.mysql', 'NAME': 'qa', 'USER': 'qa',
    'PASSWORD': 'local-qa-only', 'HOST': 'mysql', 'PORT': 3306,
    'ATOMIC_REQUESTS': True,
    'OPTIONS': {'charset': 'utf8mb4'},
}}
CELERY_TASK_ALWAYS_EAGER = False
CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULT_BACKEND = 'redis://redis:6379/0'

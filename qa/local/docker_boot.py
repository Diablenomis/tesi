"""Container entry point for isolated QA; original application code is unchanged."""
import os
import sys
import runtime
sys.path.remove(str(runtime.ROOT / '.local-test-deps'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'docker_settings'
os.environ['LOCAL_QA_DB'] = 'unused'
# Internal Docker network enforces isolation, including library subprocesses.
runtime.check_address = lambda address: None
runtime.setup()

if sys.argv[1] == 'test':
    import test_flows
elif sys.argv[1] == 'celery':
    from gym.celery import app
    app.start(sys.argv[2:])
elif sys.argv[1] == 'gunicorn':
    sys.argv = ['gunicorn', 'gym.wsgi', '--bind', '0.0.0.0:8000', '--workers', '2', '--threads', '2']
    from gunicorn.app.wsgiapp import run
    run()
else:
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', *sys.argv[1:]])

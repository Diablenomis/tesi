"""Host orchestrator for a real one-shot Beat -> Redis -> worker QA test."""
import json
from pathlib import Path
import re
import subprocess
import time
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
run = 'qa-beat-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
out = ROOT/'docs/prove-beat'/run
out.mkdir(parents=True,exist_ok=False)
session_file = ROOT/'.local-test-artifacts/beat-delivery-session.json'
session_file.write_text(json.dumps({'run':run,'mode':'prepare','output':out.relative_to(ROOT).as_posix()}))
compose = ['docker','compose','-f','qa/local/docker-compose.qa.yml']
worker = 'fitnexus-qa-beat-check-worker'
beat = 'fitnexus-qa-beat-check-scheduler'
started = []

def command(args, check=True):
    result = subprocess.run(args,cwd=ROOT,capture_output=True,text=True,timeout=45)
    if check and result.returncode:
        raise RuntimeError(result.stderr[-2000:])
    return result.stdout + result.stderr

def fixture(mode, **extra):
    config = json.loads(session_file.read_text())
    config.update({'mode':mode,**extra})
    session_file.write_text(json.dumps(config,indent=2))
    return command(compose+['run','--rm','--no-deps','backend','shell','-c',
        "exec(open('/workspace/qa/local/beat_delivery_fixture.py').read())"])

try:
    command(compose+['run','-d','--no-deps','--name',worker,'backend','celery','worker',
        '--loglevel=INFO','--concurrency=1','-Q','qa-beat-verification','-n','qa-beat-verification@%h'])
    started.append(worker)
    ready = False
    for _ in range(15):
        if ' ready.' in command(['docker','logs',worker]):
            ready=True
            break
        time.sleep(1)
    assert ready, 'Worker readiness timeout'
    print(fixture('prepare'),flush=True)
    command(compose+['run','-d','--no-deps','--name',beat,'backend','celery','beat',
        '--loglevel=INFO','--scheduler','django_celery_beat.schedulers:DatabaseScheduler','--max-interval','2'])
    started.append(beat)
    task_id = None
    deadline = time.monotonic()+90
    while time.monotonic()<deadline:
        worker_log = command(['docker','logs',worker])
        beat_log = command(['docker','logs',beat])
        match = re.search(r'Task scheda_tutorial\.tasks\.my_task\[([^\]]+)\] succeeded',worker_log)
        if match:
            task_id=match.group(1)
            assert 'Sending due task '+run in beat_log, 'Task must originate from this Beat schedule'
            break
        if 'raised unexpected' in worker_log:
            raise RuntimeError('Worker task failed; inspect captured worker.log')
        time.sleep(2)
    assert task_id, 'No task success within 90 seconds'
    time.sleep(3)  # Let Beat mark the one-off schedule disabled.
    print(fixture('verify',task_id=task_id),flush=True)
finally:
    for name in started:
        (out/('worker.log' if name==worker else 'beat.log')).write_text(
            command(['docker','logs',name],check=False),encoding='utf-8')
    for name in reversed(started):
        command(['docker','stop','-t','10',name],check=False)
        command(['docker','rm',name],check=False)
    config = json.loads(session_file.read_text())
    if 'feedback_ids' in config:
        print(fixture('cleanup'),flush=True)
print('Evidence:',out,flush=True)

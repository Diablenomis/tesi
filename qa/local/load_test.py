"""Bounded, loopback-only HTTP load test for the existing FitNexus QA environment.

No provider requests, token values or response bodies are recorded. Uses only
Python's standard library. Each virtual user waits for its previous response.
"""
import concurrent.futures
import csv
import http.client
import json
import math
import os
from pathlib import Path
import statistics
import subprocess
import threading
import time
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
RUN = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT = ROOT / 'docs' / 'prove-carico' / RUN
OUT.mkdir(parents=True, exist_ok=False)
CHECKPOINT = ROOT / 'qa/local/STATO_TEST_CARICO.md'
SESSION = json.loads((ROOT / '.local-test-artifacts/session.json').read_text())
assert SESSION['customer'].endswith('@example.test'), 'Only QA users allowed'
LOGIN = json.dumps({'email': SESSION['customer'], 'password': SESSION['password']})
PATH = '/personal/my-course/?scheda=' + SESSION['form_id']
TIMEOUT = 10
DURATION = 30
CONTAINERS = ['fitnexus-qa-' + s + '-1' for s in ['backend', 'mysql', 'nginx', 'redis']]
state = {'phase': 'preflight'}
samples = []
stop_monitor = threading.Event()
summary = {
    'run': RUN, 'started_utc': datetime.now(timezone.utc).isoformat(),
    'environment': {'host': 'Windows 11 Home 10.0.22000',
        'cpu': 'Intel Core i7-8550U @ 1.80GHz', 'physical_cores': 4, 'logical_processors': 8,
        'docker_kernel': '6.18.40.1-microsoft-standard-WSL2', 'docker_cpus': 8,
        'docker_memory_bytes': 16718872576, 'docker_server': '29.0.1'},
    'method': {'target': 'http://127.0.0.1:8000', 'model': 'closed loop, no think time',
        'connection': 'one HTTPConnection per virtual user, keep-alive when supported',
        'timeout_seconds': TIMEOUT, 'duration_per_phase_seconds': DURATION,
        'read_concurrency': [1, 5, 10, 20], 'login_concurrency': [1, 5, 10],
        'warmup_seconds_per_scenario': 5, 'recovery_seconds': 10,
        'percentile': 'nearest rank', 'dataset': 'one existing QA customer and one published single-day sheet',
        'latency': 'request start through full response body; excludes validation and think time',
        'throughput': 'completed requests / elapsed time including drain',
        'error_guard': 'stop phase and remaining load if >=20% errors after 50 completed requests'},
    'phases': [], 'preflight': {}, 'status': 'running',
}


def save_checkpoint(message):
    (OUT / 'summary.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    CHECKPOINT.write_text('# Test di carico locale\n\nRun: `' + RUN + '`.\n\n' + message +
        '\n\nEvidenze: `docs/prove-carico/' + RUN + '/`. Non rieseguire le fasi già presenti in summary.json.\n', encoding='utf-8')


def monitor():
    with (OUT / 'resources.jsonl').open('w', encoding='utf-8') as stream:
        while not stop_monitor.is_set():
            started = time.monotonic()
            row = {'utc': datetime.now(timezone.utc).isoformat(), 'phase': state['phase']}
            try:
                result = subprocess.run(['docker', 'stats', '--no-stream', '--format', '{{json .}}', *CONTAINERS],
                    capture_output=True, text=True, timeout=15)
                row['containers'] = [json.loads(line) for line in result.stdout.splitlines() if line.strip()]
                row['exit_code'] = result.returncode
            except Exception as exc:
                row['monitor_error'] = type(exc).__name__
            samples.append(row)
            stream.write(json.dumps(row) + '\n')
            stream.flush()
            stop_monitor.wait(max(0, 5 - (time.monotonic() - started)))


def percentile(values, p):
    return sorted(values)[max(0, math.ceil(len(values) * p) - 1)] if values else None


def call(conn, scenario, token):
    headers = {'Content-Type': 'application/json'}
    if scenario == 'read':
        headers['Authorization'] = 'Bearer ' + token
        conn.request('GET', PATH, headers=headers)
    else:
        conn.request('POST', '/auth/login/', body=LOGIN, headers=headers)
    response = conn.getresponse()
    body = response.read()
    return response.status, body


def validate(scenario, code, body):
    if code != 200:
        return 'http_' + str(code)
    try:
        data = json.loads(body)
        if scenario == 'read':
            pack = data['data']
            if str(pack['id']) != str(SESSION['form_id']) or not pack['weeks']:
                return 'invalid_sheet'
        elif not data.get('data', data)['tokens']['access']:
            return 'missing_access_token'
    except (ValueError, KeyError, TypeError):
        return 'invalid_response'
    return ''


def phase(scenario, users, seconds, label, token):
    state['phase'] = label
    rows = []
    lock = threading.Lock()
    gate = threading.Event()
    abort = threading.Event()
    counters = {'n': 0, 'errors': 0}
    start = 0.0

    def worker(user):
        conn = http.client.HTTPConnection('127.0.0.1', 8000, timeout=TIMEOUT)
        gate.wait()
        try:
            while time.perf_counter() < start + seconds and not abort.is_set():
                at = time.perf_counter()
                code, size, failure = 0, 0, ''
                try:
                    code, body = call(conn, scenario, token)
                    latency = (time.perf_counter() - at) * 1000
                    size = len(body)
                    failure = validate(scenario, code, body)
                except Exception as exc:
                    latency = (time.perf_counter() - at) * 1000
                    failure = type(exc).__name__
                    conn.close()
                    conn = http.client.HTTPConnection('127.0.0.1', 8000, timeout=TIMEOUT)
                with lock:
                    rows.append([label, scenario, users, user, round(at-start, 6), code,
                                 round(latency, 3), size, failure])
                    counters['n'] += 1
                    counters['errors'] += bool(failure)
                    if counters['n'] >= 50 and counters['errors'] / counters['n'] >= .2:
                        abort.set()
        finally:
            conn.close()

    cpu_before = os.times()
    utc_start = datetime.now(timezone.utc).isoformat()
    with concurrent.futures.ThreadPoolExecutor(max_workers=users) as pool:
        futures = [pool.submit(worker, user) for user in range(users)]
        start = time.perf_counter()
        gate.set()
        for future in futures:
            future.result()
    elapsed = time.perf_counter() - start
    cpu_after = os.times()
    latencies = [r[6] for r in rows]
    status_counts = {}
    error_counts = {}
    for row in rows:
        status_counts[str(row[5])] = status_counts.get(str(row[5]), 0) + 1
        if row[8]:
            error_counts[row[8]] = error_counts.get(row[8], 0) + 1
    with (OUT / 'requests.csv').open('a', newline='', encoding='utf-8') as f:
        csv.writer(f).writerows(rows)
    result = {'label': label, 'scenario': scenario, 'concurrency': users, 'started_utc': utc_start,
        'planned_seconds': seconds, 'elapsed_seconds': round(elapsed, 3), 'requests': len(rows),
        'errors': counters['errors'], 'errors_by_type': error_counts, 'status_counts': status_counts,
        'rps': round(len(rows) / elapsed, 3), 'mean_ms': round(statistics.mean(latencies), 3),
        'p50_ms': percentile(latencies, .5), 'p95_ms': percentile(latencies, .95),
        'p99_ms': percentile(latencies, .99), 'max_ms': max(latencies),
        'generator_cpu_percent_one_core': round(100 * ((cpu_after.user-cpu_before.user)+(cpu_after.system-cpu_before.system))/elapsed, 2),
        'aborted': abort.is_set()}
    summary['phases'].append(result)
    save_checkpoint('Ultima fase completata: **' + label + '**. Esecuzione in corso; leggere summary.json prima di riprendere.')
    print(json.dumps(result), flush=True)
    return abort.is_set()


def main():
    save_checkpoint('Preparazione completata, preflight HTTP da eseguire.')
    connection = http.client.HTTPConnection('127.0.0.1', 8000, timeout=TIMEOUT)
    code, body = call(connection, 'login', '')
    assert not validate('login', code, body), 'Preflight login failed'
    login = json.loads(body)
    token = login.get('data', login)['tokens']['access']
    code, body = call(connection, 'read', token)
    assert not validate('read', code, body), 'Preflight sheet failed'
    pack = json.loads(body)['data']
    summary['preflight'] = {'login_status': 200, 'read_status': code,
        'weeks': len(pack['weeks']), 'days': sum(len(w['days']) for w in pack['weeks']),
        'response_bytes': len(body)}
    connection.close()
    with (OUT / 'requests.csv').open('w', newline='', encoding='utf-8') as f:
        csv.writer(f).writerow(['phase','scenario','concurrency','user','start_offset_s','status','latency_ms','bytes','error'])
    monitor_thread = threading.Thread(target=monitor, daemon=True)
    monitor_thread.start()
    try:
        aborted = False
        for scenario, levels in [('read', [1, 5, 10, 20]), ('login', [1, 5, 10])]:
            if phase(scenario, 1, 5, scenario + '_warmup', token):
                aborted = True
                break
            for users in levels:
                if phase(scenario, users, DURATION, scenario + '_' + str(users), token):
                    aborted = True
                    break
            if aborted:
                break
        phase('read', 1, 10, 'read_recovery', token)
        summary['status'] = 'stopped_by_error_guard' if aborted else 'completed'
    finally:
        stop_monitor.set()
        monitor_thread.join(timeout=20)
        summary['finished_utc'] = datetime.now(timezone.utc).isoformat()
        summary['resource_samples'] = len(samples)
        save_checkpoint('Esecuzione terminata: **' + summary['status'] + '**. Da completare: analisi risultati, rapporto e arresto dei soli servizi QA avviati.')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        summary['status'] = 'failed'
        summary['failure_type'] = type(exc).__name__
        save_checkpoint('Esecuzione interrotta: ' + type(exc).__name__ + '. Conservare le fasi già registrate.')
        raise

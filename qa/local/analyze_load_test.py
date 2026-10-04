"""Check raw measurements and aggregate sampled resources, without rerunning load."""
import csv
import json
import math
from pathlib import Path
import statistics
import sys
from datetime import datetime, timedelta

folder = Path(sys.argv[1]).resolve()
summary = json.loads((folder / 'summary.json').read_text())
assert summary['status'] == 'completed', summary['status']
with (folder / 'requests.csv').open(newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
resources = [json.loads(line) for line in (folder / 'resources.jsonl').read_text().splitlines()]
for phase in summary['phases']:
    subset = [r for r in rows if r['phase'] == phase['label']]
    assert len(subset) == phase['requests']
    assert sum(bool(r['error']) for r in subset) == phase['errors']
    for name, fraction in [('p50_ms', .5), ('p95_ms', .95), ('p99_ms', .99)]:
        values = sorted(float(r['latency_ms']) for r in subset)
        assert values[math.ceil(len(values)*fraction)-1] == phase[name]

aggregated = []
for phase in summary['phases']:
    begin = datetime.fromisoformat(phase['started_utc'])
    end = begin + timedelta(seconds=phase['elapsed_seconds'])
    # The next sample starts after this docker-stats call has completed.
    # Retain only intervals wholly inside a phase; omit boundary samples.
    phase_samples = [sample for sample, following in zip(resources, resources[1:])
                     if datetime.fromisoformat(sample['utc']) >= begin
                     and datetime.fromisoformat(following['utc']) <= end]
    for service in ['backend', 'mysql', 'nginx', 'redis']:
        data = [c for sample in phase_samples
                for c in sample.get('containers', []) if c['Name'] == 'fitnexus-qa-' + service + '-1']
        if not data:
            continue
        cpu = [float(c['CPUPerc'].rstrip('%')) for c in data]
        def memory(c):
            text = c['MemUsage'].split('/')[0].strip()
            for suffix, factor in [('GiB',1024), ('MiB',1), ('KiB',1/1024), ('B',1/(1024**2))]:
                if text.endswith(suffix):
                    return float(text[:-len(suffix)]) * factor
            raise ValueError(text)
        aggregated.append({'phase':phase['label'],'service':service,'samples':len(data),
            'cpu_mean_percent':round(statistics.mean(cpu),2),'cpu_max_percent':max(cpu),
            'memory_max_mib':round(max(map(memory,data)),3)})
measured = [p for p in summary['phases'] if 'warmup' not in p['label'] and 'recovery' not in p['label']]
analysis = {'integrity':'PASS: CSV counts, error counts and percentile values match summary',
    'resource_attribution':'Only sample intervals fully inside each phase; next sample start bounds the preceding collection end',
    'measured_requests':sum(p['requests'] for p in measured),
    'measured_errors':sum(p['errors'] for p in measured), 'all_requests_including_warmup_recovery':len(rows),
    'all_errors':sum(bool(r['error']) for r in rows),
    'monitor_failures':sum(s.get('exit_code',0)!=0 or 'monitor_error' in s for s in resources),
    'resources':aggregated}
(folder / 'analysis.json').write_text(json.dumps(analysis,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in analysis.items() if k!='resources'},indent=2))
for p in measured + [summary['phases'][-1]]:
    print(p['label'],p['requests'],p['errors'],p['rps'],p['p50_ms'],p['p95_ms'],p['p99_ms'],p['max_ms'])
for row in aggregated:
    if row['service'] in ['backend','mysql'] and 'warmup' not in row['phase']:
        print(json.dumps(row))

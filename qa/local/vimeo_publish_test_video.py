"""Publish only the test video explicitly authorized by the user on 2026-10-04."""
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

root = Path(__file__).resolve().parents[2]
values = {}
for line in (root / '.local-test-artifacts/vimeo-test.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        key, value = line.split('=', 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
request = Request('https://api.vimeo.com/videos/1232641850?fields=uri,privacy.view,privacy.embed',
                  method='PATCH', data=json.dumps({'privacy': {'view': 'anybody'}}).encode(),
                  headers={'Authorization': 'Bearer ' + values['VIMEO_ACCESS_TOKEN'],
                           'Content-Type': 'application/json'})
with urlopen(request, timeout=25) as response:
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'http_status': response.status,
              'authorized_video_id': '1232641850', 'response': json.load(response)}
(root / 'docs/prove-vimeo/privacy-authorized.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))

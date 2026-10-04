"""Inspect recent upload metadata; no files or credentials included in evidence."""
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlencode

root = Path(__file__).resolve().parents[2]
values = {}
for line in (root / '.local-test-artifacts/vimeo-test.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        k, v = line.split('=', 1)
        values[k.strip()] = v.strip().strip('\"').strip("'")
fields = 'uri,name,created_time,status,upload.status,upload.size,transcode.status,privacy.view,privacy.embed'
url = 'https://api.vimeo.com/me/videos?' + urlencode({'fields': fields, 'sort': 'date', 'direction': 'desc', 'per_page': 10})
with urlopen(Request(url, headers={'Authorization': 'Bearer ' + values['VIMEO_ACCESS_TOKEN']}), timeout=20) as response:
    data = json.load(response)
report = {'http_status': 200, 'videos': data.get('data', [])}
(root / '.local-test-artifacts/vimeo-recent-videos.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))

"""Step 1 only: read token permissions and account upload entitlement, no upload."""
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
values = {}
for line in (ROOT / '.local-test-artifacts/vimeo-test.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        key, value = line.split('=', 1)
        values[key.strip()] = value.strip().strip('\"').strip("'")
token = values.get('VIMEO_ACCESS_TOKEN', '')
if not token:
    raise SystemExit('Token missing; no request sent')

report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'step': 1, 'read_only': True,
          'video_url_present': bool(values.get('VIMEO_TEST_VIDEO_URL')), 'video_tested': False, 'uploaded_files': 0}
for label, endpoint in [('authentication', '/oauth/verify'),
                        ('account', '/me?fields=uri,account,upload_quota')]:
    try:
        request = Request('https://api.vimeo.com' + endpoint, headers={
            'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.vimeo.*+json;version=3.4'})
        with urlopen(request, timeout=20) as response:
            data = json.load(response)
            result = {'http_status': response.status}
        if label == 'authentication':
            result['scope'] = data.get('scope')
            result['authenticated_user_present'] = bool(data.get('user'))
        else:
            result.update(account=data.get('account'), upload_quota=data.get('upload_quota'))
        report[label] = result
    except HTTPError as exc:
        report[label] = {'http_status': exc.code}
        if exc.code in (401, 403):
            break
    except URLError:
        raise SystemExit('Network connection unavailable; no credential output')

target = ROOT / 'docs/prove-vimeo'
target.mkdir(exist_ok=True)
(target / 'step-1-account.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))

"""Step 2: read video metadata and oEmbed only. Never uploads or changes privacy."""
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urlparse, urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

root = Path(__file__).resolve().parents[2]
values = {}
for line in (root / '.local-test-artifacts/vimeo-test.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        key, value = line.split('=', 1)
        values[key.strip()] = value.strip().strip('\"').strip("'")
token = values.get('VIMEO_ACCESS_TOKEN', '')
video_url = values.get('VIMEO_TEST_VIDEO_URL', '')
parsed = urlparse(video_url)
match = re.fullmatch(r'/(?:video/|manage/videos/)?(\d+)(?:/[A-Za-z0-9]+)?/?', parsed.path)
if not token or parsed.scheme != 'https' or parsed.hostname not in ('vimeo.com', 'www.vimeo.com', 'player.vimeo.com') or not match:
    raise SystemExit('Invalid or unsupported Vimeo configuration; no values displayed, no requests sent')

report = {'step': 2, 'checked_at': datetime.now(timezone.utc).isoformat(),
          'read_only': True, 'uploaded_files': 0, 'browser_playback_tested': False}

def read(url, headers):
    try:
        with urlopen(Request(url, headers=headers), timeout=20) as response:
            return response.status, json.load(response)
    except HTTPError as exc:
        return exc.code, {}
    except URLError:
        return 'network_error', {}

fields = 'status,transcode.status,upload.status,privacy.view,privacy.embed,duration,is_playable'
status, video = read('https://api.vimeo.com/videos/' + match.group(1) + '?' + urlencode({'fields': fields}),
                     {'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.vimeo.*+json;version=3.4'})
report['video'] = {'http_status': status, 'status': video.get('status'),
                   'transcode_status': (video.get('transcode') or {}).get('status'),
                   'upload_status': (video.get('upload') or {}).get('status'),
                   'privacy_view': (video.get('privacy') or {}).get('view'),
                   'privacy_embed': (video.get('privacy') or {}).get('embed'),
                   'duration_seconds': video.get('duration'), 'is_playable': video.get('is_playable')}
if status == 200:
    status, embed = read('https://vimeo.com/api/oembed.json?' + urlencode({'url': video_url}),
                          {'Referer': 'http://localhost:3000/', 'Accept': 'application/json'})
    report['oembed'] = {'http_status': status, 'type': embed.get('type'),
                        'iframe_returned': '<iframe' in embed.get('html', ''),
                        'referrer_used': 'http://localhost:3000/'}
target = root / 'docs/prove-vimeo/step-2-video.json'
target.parent.mkdir(exist_ok=True)
target.write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))

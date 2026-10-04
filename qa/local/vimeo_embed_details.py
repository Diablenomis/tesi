"""Read the provider's canonical playback link without printing private embed data."""
import json
from pathlib import Path
from urllib.request import Request, urlopen

root = Path(__file__).resolve().parents[2]
values = {}
for line in (root / '.local-test-artifacts/vimeo-test.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        k, v = line.split('=', 1)
        values[k.strip()] = v.strip().strip('\"').strip("'")
with urlopen(Request('https://api.vimeo.com/videos/1232641850?fields=uri,link,embed.html,privacy',
    headers={'Authorization': 'Bearer ' + values['VIMEO_ACCESS_TOKEN']}), timeout=20) as response:
    video = json.load(response)
(root / '.local-test-artifacts/vimeo-embed.json').write_text(json.dumps(video, indent=2))
print(json.dumps({'canonical_link_matches_config': video.get('link') == values['VIMEO_TEST_VIDEO_URL'],
                  'embed_html_present': bool(video.get('embed', {}).get('html')), 'privacy': video.get('privacy')}, indent=2))

"""Record the uploaded test video while preserving the supplied local file path."""
import sys
from pathlib import Path

video_id = sys.argv[1]
assert video_id.isdigit()
root = Path(__file__).resolve().parents[2]
path = root / '.local-test-artifacts/vimeo-test.env'
lines = path.read_text(encoding='utf-8-sig').splitlines()
original = next(line.split('=', 1)[1] for line in lines if line.startswith('VIMEO_TEST_VIDEO_URL='))
lines = [line for line in lines if not line.startswith('VIMEO_TEST_VIDEO_URL=')]
if not original.strip().strip('\"').startswith('https://') and not any(line.startswith('VIMEO_TEST_UPLOAD_PATH=') for line in lines):
    lines.append('VIMEO_TEST_UPLOAD_PATH=' + original)
lines.append('VIMEO_TEST_VIDEO_URL=https://vimeo.com/' + video_id)
path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('Video URL updated; original local path preserved. No credentials displayed.')

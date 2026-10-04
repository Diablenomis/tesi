"""Check actual browser exports: the rasterized day must fit inside the PDF page."""
import json
import sys
from pathlib import Path
from pypdf import PdfReader
from pypdf.generic import ContentStream

results = []
for filename in sys.argv[1:]:
    path = Path(filename)
    reader = PdfReader(path)
    assert len(reader.pages) == 1, 'Expected the selected day on one page'
    page = reader.pages[0]
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    transforms = [list(map(float, args)) for args, op in ContentStream(page.get_contents(), reader).operations
                  if op == b'cm']
    assert len(transforms) == 1, 'Inspect unexpected PDF transformation layout manually'
    a, b, c, d, x, y = transforms[0]
    fits = (abs(b) < .01 and abs(c) < .01 and x >= -.01 and y >= -.01
            and x + a <= width + .01 and y + d <= height + .01)
    results.append({'file': path.name, 'bytes': path.stat().st_size, 'pages': 1,
                    'page_points': [width, height], 'image_transform': transforms[0],
                    'image_inside_page': fits})
    assert fits, 'Export clips the image: ' + path.name
output = Path(__file__).resolve().parents[2] / 'docs/prove-locali/fix-pdf-results.json'
output.write_text(json.dumps(results, indent=2))
print(output.read_text())

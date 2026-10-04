"""Serve a local production bundle with a CSP prohibiting external services."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import os

ROOT = Path(__file__).resolve().parents[2]
BUILD = ROOT / '.local-test-artifacts' / 'frontend-build'
os.chdir(BUILD)

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
            "font-src 'self' data:; media-src 'self' blob:; "
            "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000; "
            "frame-src 'none'; object-src 'none'; form-action 'self'; base-uri 'self'")
        self.send_header('Cache-Control','no-store')
        super().end_headers()

    def do_GET(self):
        if not Path(self.translate_path(urlsplit(self.path).path)).is_file():
            self.path = '/index.html'
        super().do_GET()

print('Local frontend http://localhost:3000; external requests blocked by CSP', flush=True)
ThreadingHTTPServer(('127.0.0.1', 3000), Handler).serve_forever()

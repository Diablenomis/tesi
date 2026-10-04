"""Small genuine HTTP smoke test against the already-running isolated backend."""
import json
import os
import urllib.request
import urllib.error
from pathlib import Path

root = Path(__file__).resolve().parents[2]
session = json.loads((root/'.local-test-artifacts/session.json').read_text())
base = 'http://127.0.0.1:8000'
results = []

def call(method, path, data=None, token=None):
    headers={'Content-Type':'application/json'}
    if token:
        headers['Authorization']='Bearer '+token
    req=urllib.request.Request(base+path,data=json.dumps(data).encode() if data is not None else None,headers=headers,method=method)
    try:
        with urllib.request.urlopen(req,timeout=15) as response:
            return response.status,json.loads(response.read())
    except urllib.error.HTTPError as exc:
        return exc.code,json.loads(exc.read())

code,data=call('POST','/auth/login/',{'email':session['customer'],'password':session['password']})
results.append({'test':'Login tramite HTTP loopback','status':code,'pass':code==200})
login=data.get('data',data)
token=login['tokens']['access']
code,data=call('GET','/personal/my-course/?scheda='+session['form_id'],token=token)
results.append({'test':'Consultazione tramite HTTP loopback','status':code,'pass':code==200,
                'response':data})
code,data=call('GET','/personal/my-course/?scheda='+session['form_id'])
results.append({'test':'Consultazione HTTP senza token','status':code,'pass':code==401})
(root/'docs/prove-locali'/os.getenv('QA_HTTP_REPORT_NAME', 'http-results.json')).write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))

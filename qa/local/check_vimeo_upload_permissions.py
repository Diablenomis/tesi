"""Local permission/validation tests; Vimeo transport mocked, no upload objects."""
import json
import os
from pathlib import Path
from unittest.mock import patch, Mock
from rest_framework.test import APIClient
from authentication.models import User

client = APIClient()
trainer = User.objects.get(email='trainer@example.test')
customer = User.objects.get(email='cliente@example.test')
results = []
payload = {'name': 'video.mp4', 'size': 16675623}
with patch('coach.video_views.requests.post') as provider:
    for name, actor, data, expected in [
        ('anonymous rejected', None, payload, 401),
        ('customer rejected', customer, payload, 403),
        ('empty size rejected', trainer, {'name': 'video.mp4', 'size': 0}, 400),
        ('missing name rejected', trainer, {'size': 10}, 400),
        ('oversize rejected', trainer, {'name': 'video.mp4', 'size': 2 * 1024 ** 3 + 1}, 400),
    ]:
        client.force_authenticate(user=actor)
        response = client.post('/coach/videos/upload/', data, format='json')
        assert response.status_code == expected, (name, response.status_code)
        provider.assert_not_called()
        results.append({'check': name, 'status': response.status_code})
    client.force_authenticate(user=trainer)
    with patch.dict(os.environ, {'VIMEO_ACCESS_TOKEN': ''}):
        assert client.post('/coach/videos/upload/', payload, format='json').status_code == 503
    provider.assert_not_called()
    results.append({'check': 'missing token rejected', 'status': 503})
    provider.return_value = Mock(status_code=201)
    provider.return_value.json.return_value = {'uri': '/videos/123', 'link': 'https://vimeo.com/123',
        'upload': {'upload_link': 'https://files.tus.vimeo.com/test'}}
    response = client.post('/coach/videos/upload/', payload, format='json')
    assert response.status_code == 201
    assert set(response.data) == {'video_id', 'link', 'upload_url'}
    assert os.environ['VIMEO_ACCESS_TOKEN'] not in json.dumps(response.data)
    assert provider.call_args.kwargs['json']['upload']['approach'] == 'tus'
    results.append({'check': 'trainer ticket, TUS and token isolation', 'status': 201})
    provider.return_value.status_code = 200
    assert client.post('/coach/videos/upload/', payload, format='json').status_code == 201
    results.append({'check': 'Vimeo HTTP 200 upload ticket accepted', 'status': 201})
    provider.return_value.status_code = 403
    response = client.post('/coach/videos/upload/', payload, format='json')
    assert response.status_code == 502 and response.data['provider_status'] == 403
    results.append({'check': 'Vimeo denial surfaced', 'status': 502})
report = {'passed': len(results), 'checks': results, 'vimeo_calls': 'mocked', 'uploads_created': 0}
Path('/workspace/docs/prove-vimeo/upload-permissions.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))

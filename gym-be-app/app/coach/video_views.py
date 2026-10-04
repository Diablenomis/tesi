"""Issue Vimeo upload tickets to authenticated trainers without exposing the token."""
import os
import re
from urllib.parse import urlparse
import requests
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from scheda_tutorial.permission_custom import IsTrainer

class VideoUploadInput(serializers.Serializer):
    name = serializers.CharField(max_length=128)
    size = serializers.IntegerField(min_value=1, max_value=2 * 1024 ** 3)

class VideoUploadView(APIView):
    permission_classes = (IsTrainer,)

    def post(self, request):
        serializer = VideoUploadInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = os.getenv('VIMEO_ACCESS_TOKEN')
        if not token:
            return Response({'error': 'Caricamento Vimeo non configurato.'}, status=503)
        try:
            response = requests.post('https://api.vimeo.com/me/videos', headers={
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/vnd.vimeo.*+json;version=3.4',
            }, json={'name': serializer.validated_data['name'], 'upload': {
                'approach': 'tus', 'size': serializer.validated_data['size']}}, timeout=(5, 20))
        except requests.RequestException:
            return Response({'error': 'Vimeo non raggiungibile. Riprova più tardi.'}, status=502)
        if response.status_code not in (200, 201):
            return Response({'error': 'Vimeo non ha autorizzato il caricamento. Verifica Upload Access e quota.',
                             'provider_status': response.status_code}, status=502)
        try:
            video = response.json()
            upload_url = video['upload']['upload_link']
            parsed = urlparse(upload_url)
            if parsed.scheme != 'https' or not (parsed.hostname or '').endswith('.vimeo.com'):
                raise ValueError('Unexpected upload host')
            if not re.fullmatch(r'/videos/\d+', video['uri']):
                raise ValueError('Unexpected video URI')
            return Response({'video_id': video['uri'].split('/')[-1], 'link': video.get('link'),
                             'upload_url': upload_url}, status=201)
        except (ValueError, KeyError, TypeError):
            return Response({'error': 'Risposta Vimeo non valida. Controlla la libreria prima di riprovare.'}, status=502)

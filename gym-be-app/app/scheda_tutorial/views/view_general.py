import os
import logging
from rest_framework import generics, status
from rest_framework.response import Response

from mailersend import emails

from gym import custom_emails

from ..models.models_general import Exercise
from ..renderers import ViewRenderer
from ..serializers import ConsigliSerializer, ExerciseSer

logger = logging.getLogger(__name__)

mail_generic = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}


class ExerciseView(generics.ListCreateAPIView):
    serializer_class = ExerciseSer
    pagination_class = None
    queryset = Exercise.objects.all()
    renderer_classes = (ViewRenderer,)


class EsercizioOperationsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSer
    renderer_classes = (ViewRenderer,)
    pagination_class = None
    lookup_url_kwarg = 'id'
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class HelpView(generics.GenericAPIView):
    serializer_class = ConsigliSerializer
    renderer_classes = (ViewRenderer,)

    def post(self, request):
        personalization = [
            {
                "email": os.getenv('EMAIL_FROM'),
                "data": {
                    "name": request.data['name'],
                    "email": request.data['email_from'],
                    "text": request.data['text']
                }
            }
        ]
        resp = custom_emails.invia_email(mail_recipients=[mail_generic], mail_from=mail_generic, id_template="3z0vklor8z1l7qrx",
                                personalization=personalization, subject="Richiesta consigli di Percorso")

        if int(resp) == 202:
            return Response({'success': 'Ti abbiamo inviato l\'email con i consigli per il tuo percorso'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Errore nell\'invio dell\'email'}, status=status.HTTP_400_BAD_REQUEST)
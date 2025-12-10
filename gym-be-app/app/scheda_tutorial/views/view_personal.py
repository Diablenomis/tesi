from datetime import date, datetime, timedelta
import secrets
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

import os
import logging
from mailersend import emails
import uuid

from gym import custom_emails
from scheda_tutorial.models.models_general import TempEmail
from coach.models import Coach

from ..models.models_personal import Feedback, FormSP, Question, Survey
from ..serializers import ChooseCoachSerializer, ChooseNutritionistSerializer, RecivedFeedbackSerializer, SurveySerializer, FormPersSerializer, PersFormSerializer, PersFormAllSerializer
from ..renderers import ViewRenderer
from .. import services

from authentication.models import User
from ..permission_custom import StaffAllButEditOrReadOnly, IsTrainer

logger = logging.getLogger(__name__)

mail_generic = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}

use_generic_email = os.getenv('USE_GENERIC_EMAIL', True)
protocol = os.getenv('PROTOCOL_URL', 'https://')
domain_url = os.getenv('DOMAIN_URL', 'fitnexus.com')


class SurveyView(generics.GenericAPIView):
    serializer_class = SurveySerializer
    permission_classes = (permissions.IsAuthenticated,)
    #renderer_classes = (UserRenderer,)

    def post(self, request):
        req = request.data
        logger.info('Studente ' + request.user.name + ' ' + request.user.surname + ' ha compilato il questionario.')
        survey = Survey.objects.create(user=request.user)
        for q in req['survey']:
            Question.objects.create(survey=survey, question=q['question'], answer=q['answer'])
        logger.info('Questionario salvato.')

        return Response(request.data, status=status.HTTP_201_CREATED)

class SchedaPersView(generics.CreateAPIView):
    serializer_class = FormPersSerializer
    pagination_class = None
    queryset = FormSP.objects.all()
    renderer_classes = (ViewRenderer,)
    permission_classes = (IsTrainer,)


class MyPersFormView(generics.GenericAPIView):
    serializer_class = PersFormSerializer
    pagination_class = None
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    scheda_param_config = openapi.Parameter(
        'scheda', in_=openapi.IN_QUERY, description='ID della scheda se presente', type=openapi.TYPE_STRING)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[scheda_param_config])
    def get(request):
        id_scheda = request.GET.get('scheda', None)
        
        if id_scheda:
            try:
                personal = FormSP.objects.get(id=id_scheda, user__email=request.user.email, published=True)
            except FormSP.DoesNotExist:
                return Response({'error': 'Scheda non presente'}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({'error': 'ID non valido'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            personal = FormSP.objects.filter(user__email=request.user.email, published=True)
            if not personal:
                return Response({'error': 'Non è presente una scheda personalizzata pubblicata.'}, status=status.HTTP_404_NOT_FOUND)
            personal = personal.latest('create_at')
        serializer = PersFormSerializer(personal)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PersFormAllView(generics.GenericAPIView):
    serializer_class = PersFormAllSerializer
    pagination_class = None
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated, )

    email_param_config = openapi.Parameter(
        'user_email', in_=openapi.IN_QUERY, description='Se richiesto da un coach', type=openapi.TYPE_STRING, required=False)

    @staticmethod
    @swagger_auto_schema(manual_parameters=[email_param_config])
    def get(request):
        if request.user.is_trainer:
            # Recupera il valore della query string 'user_email'
            user_email = request.GET.get('user_email', None)
            if user_email:
                personal = FormSP.objects.filter(user__email=user_email)
            else:
                Response({'error': 'Non è stato fornito un indirizzo email.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            personal = FormSP.objects.filter(user__email=request.user.email, published=True)

        if personal:
            serializer = PersFormAllSerializer(personal, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            logger.info('Nessuna scheda personalizzata trovata per l\'utente.')
            return Response([], status=status.HTTP_200_OK)

class SchedaPersDetView(generics.RetrieveDestroyAPIView):
    queryset = FormSP.objects.all()
    serializer_class = FormPersSerializer
    renderer_classes = (ViewRenderer,)
    permission_classes = (StaffAllButEditOrReadOnly, )
    lookup_field = 'id'

    @staticmethod
    def put(request, id):
        personal = FormSP.objects.get(id=id)
        serializer = FormPersSerializer(personal, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        if personal.published:
            user_email = [
                {
                    "name": f'{personal.user.name.capitalize()} {personal.user.name.capitalize()}',
                    "email": personal.user.email,
                }
            ]
            personalization = [
                {
                    "email": personal.user.email,
                    "data": {
                        "domain": domain_url,
                        "protocol": protocol,
                    }
                }
            ]
            custom_emails.invia_email(mail_recipients=user_email, mail_from=mail_generic, id_template="vywj2lpw0kmg7oqz",
                personalization=personalization, subject="Scheda Aggiornata")
        return Response(serializer.data, status=status.HTTP_200_OK)    


class SchedaPersPublish(generics.GenericAPIView):
    serializer_class = None
    pagination_class = None
    permission_classes = (StaffAllButEditOrReadOnly, )

    @staticmethod
    def put(request, id_form):
        uid = uuid.UUID(id_form)
        personal = FormSP.objects.get(id=uid)
        if personal.published:
            personal.published = False
        else:
            personal.published = True
            # Non più utilizzato
            if personal.first_published is None:
                personal.first_published = datetime.now()
            token = secrets.token_hex(16)
            da_inviare = date.today() + timedelta(days=7)
            Feedback.objects.create(token=token, tipo='settimanale', da_inviare=da_inviare, form=personal)
            user_email = [
                {
                    "name": f'{personal.user.name.capitalize()} {personal.user.name.capitalize()}',
                    "email": personal.user.email,
                }
            ]
            personalization = [
                {
                    "email": personal.user.email,
                    "data": {
                        "domain": domain_url,
                        "protocol": protocol,
                    }
                }
            ]
            custom_emails.invia_email(mail_recipients=user_email, mail_from=mail_generic, id_template="z86org836d14ew13",
                personalization=personalization, subject="Scheda Pubblicata")

        personal.save()
        return Response(status=status.HTTP_200_OK)
    

class SchedaPersFeedback(generics.GenericAPIView):
    serializer_class = RecivedFeedbackSerializer
    pagination_class = None
    token_param_config = openapi.Parameter(
        'token', in_=openapi.IN_QUERY, description='Description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    @staticmethod
    def get(request):
        token = request.GET.get('token')
        feed = Feedback.objects.filter(token=token, inviato=False).first()
        if not feed:
            return Response('Token non valido', status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
    
    @staticmethod
    def post(request):
        token = request.data['token']
        feed = Feedback.objects.filter(token=token, inviato=False).first()
        if not feed:
            return Response('Token non valido', status=status.HTTP_400_BAD_REQUEST)
        
        feed.critici = request.data['critici']
        feed.forti = request.data['forti']
        feed.ese_differenti = request.data['ese_differenti']
        feed.tempistiche_ok = request.data['tempistiche_ok']
        feed.altro = request.data['altro']
        feed.save()
        
        if feed.tipo == 'settimanale':
            logger.info('Lo studente ' + feed.form.user.name + ' ' + feed.form.user.surname + ' ha compilato il feedback dopo una settimana.')
            logger.info('Email Studente: ' + feed.form.user.email + ' - Nome Scheda: ' + feed.form.name)
            resp = services.feedback_settimanale(feedback=feed)
        elif feed.tipo == 'mensile':
            logger.info('Lo studente ' + feed.user.name + ' ' + feed.user.surname + ' ha terminato il mese e ha compilato il feedback.')
            logger.info('Email Studente: ' + feed.user.email)
            resp = services.feedback_mensile(feedback=feed)

        if int(resp) == 202:
            feed.inviato = True
            feed.save()
            return Response(status=status.HTTP_202_ACCEPTED)
        else:
            return Response('Errore nell\'invio dell\'email', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CoachingOnlineView(generics.GenericAPIView):
    serializer_class = ChooseCoachSerializer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated, )

    @staticmethod
    def post(request):
        # Recupero l'utente
        user = User.objects.get(email=request.user.email)
        # Recupero il coach
        coach = Coach.objects.get(email=request.data['coach_email'])
        user.coach_email = coach.email
        user.save()

        TempEmail.objects.create(email=user.email, coach_email=coach.email)
        logger.info('Email temporanea creata.')

        return Response(status=status.HTTP_200_OK)
    
class NutrizionistView(generics.GenericAPIView):
    serializer_class = ChooseNutritionistSerializer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated, )

    @staticmethod
    def post(request):
        # Recupero l'utente
        user = User.objects.get(email=request.user.email)

        nutr_email = [
            {
                "name": request.data['name'].capitalize(),
                "email": request.data['nutritionist_email'],
            }
        ]
        personalization = [
            {
                "email": request.data['nutritionist_email'],
                "data": {
                    "nome": request.data['name'].capitalize(),
                    "nome_stud": f'{user.name.capitalize()}',
                    "cognome_stud": f'{user.surname.capitalize()}',
                    "email_stud": user.email
                }
            }
        ]
        custom_emails.invia_email(mail_recipients=nutr_email, mail_from=mail_generic, id_template="pxkjn41kqw9lz781",
                        personalization=personalization, subject="Richiesta Info Nutrizionista")

        return Response(status=status.HTTP_200_OK)
import base64
from rest_framework import generics, status, views, permissions
from .serializers import RegisterSerializer, SetNewPasswordSerializer, ResetPasswordEmailRequestSerializer, \
    EmailVerificationSerializer, LoginSerializer, LogoutSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
import jwt
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .renderers import UserRenderer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.http import HttpResponsePermanentRedirect
import os
import logging
from mailersend import emails

logger = logging.getLogger(__name__)

mail_from = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}

protocol = os.getenv('PROTOCOL_URL', 'http://')
domain_url = os.getenv('DOMAIN_URL', 'fitnexus.com')


class CustomRedirect(HttpResponsePermanentRedirect):
    allowed_schemes = [os.environ.get('APP_SCHEME'), 'http', 'https']


class RegisterVerifyView(generics.GenericAPIView):
    renderer_classes = (UserRenderer,)

    user_param = openapi.Parameter(
        'username', in_=openapi.IN_QUERY, description='Username', type=openapi.TYPE_STRING, required=False)
    email_param = openapi.Parameter(
        'email', in_=openapi.IN_QUERY, description='Email', type=openapi.TYPE_STRING, required=False)

    @swagger_auto_schema(manual_parameters=[user_param, email_param])
    def get(self, request):
        username = request.GET.get('username', None)
        email = request.GET.get('email', None)
        
        if username:
            user = User.objects.filter(username=username).first()
            if user:
                return Response('Username non disponibile', status=status.HTTP_400_BAD_REQUEST)
        if email:
            user = User.objects.filter(email=email).first()
            if user:
                return Response('Email gia\' registrata', status=status.HTTP_400_BAD_REQUEST)

        return Response('OK', status=status.HTTP_200_OK)
    

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    renderer_classes = (UserRenderer,)

    def post(self, request):
        #try:
            user = request.data
            serializer = self.serializer_class(data=user)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user_data = serializer.data
            token = RefreshToken.for_user(User.objects.get(email=user_data['email'])).access_token
            recipients = [
                {
                    "name": user_data['name'].capitalize() + ' ' + user_data['surname'].capitalize(),
                    "email": user_data['email'],
                }
            ]

            mailer = emails.NewEmail(mailersend_api_key=os.getenv('MAILERSEND_API_KEY'))
            mail_body = {}
            mailer.set_mail_to(recipients, mail_body)
            mailer.set_template("351ndgwrq3q4zqx8", mail_body)

            personalization = [
                {
                    "email": user_data['email'],
                    "data": {
                        "protocol": protocol,
                        "domain": domain_url,
                        "username": user_data['username'],
                        "token": str(token)
                    }
                }
            ]
            mailer.set_advanced_personalization(personalization, mail_body)
            mailer.send(mail_body)
            return Response(user_data, status=status.HTTP_201_CREATED)
        #except Exception as e:
        #    logger.error('Errore nella registrazione dell\'utente')
        #    logger.error('Errore: ' + str(e))
        #    return Response('Errore nella registrazione dell\'utente', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer

    token_param_config = openapi.Parameter(
        'token', in_=openapi.IN_QUERY, description='Description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get('token')
        try:
            print(token)
            payload = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])
            print(payload)
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
                recipients = [
                    {
                        "name": user.name.capitalize() + ' ' + user.surname.capitalize(),
                        "email": user.email,
                    }
                ]

                mailer = emails.NewEmail(mailersend_api_key=os.getenv('MAILERSEND_API_KEY'))
                mail_body = {}
                mailer.set_mail_to(recipients, mail_body)
                mailer.set_template("0r83ql3r6m0lzw1j", mail_body)

                personalization = [
                    {
                        "email": user.email,
                        "data": {
                            "protocol": protocol,
                            "domain": domain_url,
                            "nome": user.name.capitalize(),
                            "cognome": user.surname.capitalize()
                        }
                    }
                ]
                mailer.set_advanced_personalization(personalization, mail_body)
                with open('./authentication/attachment/INFO_GYM.pdf', 'rb') as file:
                    file_info_gym = base64.b64encode(file.read()).decode('utf-8')
                
                with open('./authentication/attachment/INFO_NUTRIZIONISTA.pdf', 'rb') as file:
                    file_info_nutrizionista = base64.b64encode(file.read()).decode('utf-8')

                attachments = [
                    {
                        'content': file_info_gym,
                        'filename': 'Info Servizio.pdf',  # Sostituisci con il nome del tuo file
                        'disposition': 'attachment',
                        'mime_type': 'application/pdf'
                    },
                    {
                        'content': file_info_nutrizionista,
                        'filename': 'Info Nutrizionista.pdf',  # Sostituisci con il nome del tuo file
                        'disposition': 'attachment',
                        'mime_type': 'application/pdf'
                    }
                ]
                mailer.set_attachments(attachments, mail_body)
                resp = mailer.send(mail_body)

                if int(resp) == 202:
                    logger.info('Email Conferma Email verificata inviata.')
                else:
                    logger.error('Email Conferma Email verificata non inviata: ' + resp)

            return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            logger.info('l\'utente ' + email + ' ha richiesto il reset della password')
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            recipients = [
                {
                    "name": user.name + ' ' + user.surname,
                    "email": email,
                }
            ]

            mailer = emails.NewEmail(mailersend_api_key=os.getenv('MAILERSEND_API_KEY'))
            mail_body = {}
            mailer.set_mail_to(recipients, mail_body)
            mailer.set_template("pxkjn415pv6lz781", mail_body)

            personalization = [
                {
                    "email": email,
                    "data": {
                        "protocol": protocol,
                        "domain": domain_url,
                        "uidb64": uidb64,
                        "token": token
                    }
                }
            ]

            mailer.set_mail_from(mail_from, mail_body)
            mailer.set_subject("Reset password GYM", mail_body)
            mailer.set_advanced_personalization(personalization, mail_body)
            resp = mailer.send(mail_body)

            if resp.__eq__(202):
                logger.info('Email inviata.')
                return Response({'success': 'Ti abbiamo inviato l\'email per il reset la tua password'},
                                status=status.HTTP_200_OK)
            else:
                logger.error('Email non inviata correttamente: ' + resp)
                return Response({'error': 'C\'è stato un problema nell\'invio dell\'invio della mail. Ti invitiamo a '
                                          'riprovare'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordTokenCheckAPI(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        logger.info('Controllo del Token di reset password')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                logger.error('Token non valido')
                return Response({'error': 'Token is not valid, please request a new one'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                logger.info('Token valido')
                return Response(None, status=status.HTTP_202_ACCEPTED)

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    logger.error('Token non valido')
                    return Response({'error': 'Token is not valid, please request a new one'},
                                    status=status.HTTP_400_BAD_REQUEST)

            except UnboundLocalError as e:
                logger.error('Token non valido')
                return Response({'error': 'Token is not valid, please request a new one'},
                                status=status.HTTP_400_BAD_REQUEST)


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)


class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

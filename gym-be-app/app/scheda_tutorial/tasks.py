import os
import logging
from celery import shared_task

from mailersend import emails
from datetime import date, datetime, timedelta

from .models.models_personal import Feedback, FormSP
from gym import custom_emails
import secrets


logger = logging.getLogger(__name__)

mail_generic = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}


protocol = os.getenv('PROTOCOL_URL', 'https://')
domain_url = os.getenv('DOMAIN_URL', 'fitnexus.com')

@shared_task
def my_task():
    logger.info('Eseguo il task per il feedback settimanale della scheda personalizzata.')
    feedback_settimanale()
    logger.info('Eseguo il task per il feedback mensile della scheda personalizzata.')
    feedback_mensile()
    

def feedback_settimanale():
    # Filter for dates less than 7 days from today
    a_data = date.today()
    da_data = date.today() - timedelta(days=1)
    feedbacks = Feedback.objects.filter(tipo='mensile', da_inviare__range=[da_data, a_data], inviato=False)
    for feed in feedbacks:
        logger.info('Esecuzione per l\'uente: ' + feed.form.user.email + ' - ' + feed.form.name)
        recipients = [
            {
                "name": f'{feed.form.user.name} {feed.form.user.surname}',
                "email": feed.form.user.email,
            }
        ]
        personalization = [
            {
                "email": feed.form.user.email,
                "data": {
                    "nome": feed.form.user.name,
                    "cognome": feed.form.user.surname,
                    "scheda": feed.form.name,
                    "protocol": protocol,
                    "domain": domain_url,
                    "token": feed.token
                }
            }
        ]
        custom_emails.invia_email(mail_recipients=recipients, mail_from=mail_generic, id_template="jpzkmgq68y24059v",
                    personalization=personalization, subject="Feedback Allenamento Settimanale")   
    return

def feedback_mensile():
    # Prendo tutti i feedback mensili da inviare
    da_data = date.today() - timedelta(days=3)
    a_data = date.today()
    # Invia i feedback da inviare tra 3 giorni e oggi
    feedbacks = Feedback.objects.filter(tipo='mensile', da_inviare__range=[da_data, a_data], inviato=False)
    for feedback in feedbacks:
        logger.info('Esecuzione feedback mensile per l\'uente: ' + feedback.user.email)
        recipients = [
            {
                "name": f'{feedback.user.name} {feedback.user.surname}',
                "email": feedback.user.email,
            }
        ]
        personalization = [
            {
                "email": feedback.user.email,
                "data": {
                    "nome": feedback.user.name,
                    "cognome": feedback.user.surname,
                    "protocol": protocol,
                    "domain": domain_url,
                    "token": feedback.token
                }
            }
        ]
        custom_emails.invia_email(mail_recipients=recipients, mail_from=mail_generic, id_template="vywj2lp6q7k47oqz",
                              personalization=personalization, subject="Feedback Allenamento Mensile")
    return
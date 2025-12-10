import calendar
from datetime import date, datetime, timedelta
import logging
import os
import secrets
import stripe

from authentication.models import User
from coach.models import Coach
from gym import custom_emails
from scheda_tutorial.models.models_general import TempEmail
from scheda_tutorial.models.models_personal import Feedback, Question, Survey

logger = logging.getLogger(__name__)

mail_generic = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}
protocol = os.getenv('PROTOCOL_URL', 'http://')
domain_url = os.getenv('DOMAIN_URL', 'localhost')


def primo_pagamento(invoice):
    customer = stripe.Customer.retrieve(invoice['customer']) # Recupera il cliente tramite l'ID
    line_items = invoice['lines']['data'] # Nome del prodotto acquistato
    products = ', '.join([item['description'] for item in line_items])
    customer_email = customer['email']
    user_rep = User.objects.get(email=customer_email)
    pagamento_effettuato(user_rep=user_rep, invoice=invoice, customer=customer, products=products)
    
    # Dopo il pagamento salvo il customer_id per l'utente
    # user_rep.id_subscription = customer_id
    # user_rep.save()

    if "scheda-personalizzata" in products:
        logger.info('L\'utente ' + customer_email + ' ha acquistato per la prima volta una scheda personalizzata: ' + products)
        operations_scheda_pers(user=user_rep, product=products)
        create_feedback_mensile(invoice=invoice, primo=True, user=user_rep)
    elif "coaching-online" in products:
        logger.info('L\'utente ' + customer_email + ' ha acquistato per la prima volta il coaching online: ' + products)
        temp_email = TempEmail.objects.filter(email=customer_email).order_by('-created_at').first()
        operations_coaching(temp_email=temp_email, product=products)
        temp_email.delete()
    else:
        logger.info('L\'utente ' + customer_email + ' ha acquistato per la prima volta: ' + products)
        logger.info('Non è stata inviata alcuna email poichè non rientra in nessun caso noto. Da verificare l\'operazione.')
        
def pagamento_ricorrente(invoice):
    customer = stripe.Customer.retrieve(invoice['customer']) # Recupera il cliente tramite l'ID
    line_items = invoice['lines']['data'] # Nome del prodotto acquistato
    products = ', '.join([item['description'] for item in line_items])
    user_rep = User.objects.get(email=customer['email'])
    pagamento_effettuato(user_rep=user_rep, invoice=invoice, customer=customer, products=products)
    if "scheda-personalizzata" in products:
        create_feedback_mensile(invoice=invoice, primo=False, user=user_rep)
        

# Recupera i dati del pagamento e invia l'email di informativa al cliente
def pagamento_effettuato(user_rep, invoice, customer, products):
    customer_name = customer['name']
    customer_email = customer['email']
    payment_intent_id = invoice['payment_intent'] # ID del PaymentIntent (codice transazione)
    amount_paid = invoice['amount_paid'] / 100  # Importo pagato (in centesimi, convertito in euro)
    purchase_date = datetime.fromtimestamp(invoice['created']).strftime('%Y-%m-%d %H:%M:%S') # Data di acquisto (convertita da timestamp UNIX)
    
    recipients = [
        {
            "name": f'{user_rep.name.capitalize()} {user_rep.name.capitalize()}',
            "email": customer_email,
        }
    ]  
    pers_pagamento_effettuato = [
        {
            "email": customer_email,
            "data": {
                "data": purchase_date,
                "nome": customer_name,
                "importo": f"{amount_paid:.2f}",
                "prodotto": products,
                "transazione": payment_intent_id
            }
        }
    ]  
    custom_emails.invia_email(mail_recipients=recipients, mail_from=mail_generic, id_template='0p7kx4xxe8749yjr',
                personalization=pers_pagamento_effettuato, subject='PAGAMENTO EFFETTUATO')    
        

# INVIA DUE EMAIL: 
# 1) SCHEDA DEL QUESTIONARIO AGLI ALLENATORI (EMAIL GENERALE) 
# 2) ISTRUZIONI PER L'UTENTE
def operations_scheda_pers(user, product):
    survey = Survey.objects.filter(user=user).order_by('-created_at').first()
    questions = Question.objects.filter(survey=survey)
    quest_image = Question.objects.get(survey=survey, question__icontains="immagine")
    
    
    pers_survey = [
        {
            "email": os.getenv('EMAIL_FROM'),
            "data": {
                'domain': domain_url,
                'protocol': protocol,
                "student" :{
                    'name': user.name,
                    'surname': user.surname,
                    'email': user.email,
                    'gender': user.gender,
                    'bday': user.bday.isoformat()
                },
                'product': product,
                "survey":[
                    {
                        "question": question.question,
                        "answer": question.answer
                    } for question in questions if "immagine" not in question.question.lower()
                ],
                "image": quest_image.answer
            }
        }
    ]
    custom_emails.invia_email(mail_recipients=[mail_generic], mail_from=mail_generic, id_template="z3m5jgr8y2mldpyo",
                              personalization=pers_survey, subject="Questionario Utente")

    user_email = [
        {
            "name": f'{user.name.capitalize()} {user.surname.capitalize()}',
            "email": user.email,
        }
    ]
    pers_istruzioni = [
        {
            "email": user.email,
            "data": {
                "nome": f'{user.name.capitalize()}',
                "cognome": f'{user.surname.capitalize()}'
            }
        }
    ]
    custom_emails.invia_email(mail_recipients=user_email, mail_from=mail_generic, id_template="3zxk54vjkq64jy6v",
                              personalization=pers_istruzioni, subject="ISTRUZIONI SCHEDA PERSONALIZZATA")
    
# INVIA TRE EMAIL: 
# 1) ISTRUZIONI PER L'UTENTE
# 2) AVVISO ALLENATORI (EMAIL GENERALE)
# 3) AVVISO ALLENATORE (EMAIL PERSONALE)
def operations_coaching(temp_email, product):
    coach = Coach.objects.get(email=temp_email.coach_email)
    user = User.objects.get(email=temp_email.email)
    user_email = [
        {
            "name": f'{user.name.capitalize()} {user.surname.capitalize()}',
            "email": user.email,
        }
    ]
    pers_istruzioni = [
        {
            "email": user.email,
            "data": {
                "nome": f'{user.name.capitalize()}',
                "cognome": f'{user.surname.capitalize()}'
            }
        }
    ]
    custom_emails.invia_email(mail_recipients=user_email, mail_from=mail_generic, id_template="neqvygmkxwz40p7w",
                              personalization=pers_istruzioni, subject="ISTRUZIONI COACHING ONLINE")

    pers_all_coach = [
        {
            "email": os.getenv('EMAIL_FROM'),
            "data": {
                "nome": f'{coach.name.capitalize()}',
                "cognome": f'{coach.surname.capitalize()}',
                "nome_stud": f'{user.name.capitalize()}',
                "cognome_stud": f'{user.surname.capitalize()}',
                "email_stud": user.email,
                "product": product
            }
        }
    ]
    custom_emails.invia_email(mail_recipients=[mail_generic], mail_from=mail_generic, id_template="z86org836z04ew13",
                            personalization=pers_all_coach, subject="RICHIESTA COACHING ONLINE")

    coach_single = [
        {
            "name": f'{coach.name.capitalize()} {user.surname.capitalize()}',
            "email": coach.email,
        }
    ]
    pers_single_coach = [
        {
            "email": coach.email,
            "data": {
                "nome": f'{coach.name.capitalize()}',
                "cognome": f'{coach.surname.capitalize()}',
                "nome_stud": f'{user.name.capitalize()}',
                "cognome_stud": f'{user.surname.capitalize()}',
                "email_stud": user.email,
                "product": product
            }
        }
    ]
    custom_emails.invia_email(mail_recipients=coach_single, mail_from=mail_generic, id_template="z86org836z04ew13",
                        personalization=pers_single_coach, subject="RICHIESTA COACHING ONLINE")   
    
    
# Crea il numero di feedback idoneo per l'acquisto dell'utente
def create_feedback_mensile(invoice, primo, user):
    mesi_iscrizione = invoice['lines']['data'][0]['plan']['interval_count'] # Recupera il numero di mesi a cui si è iscritto l'utente
    # Controllo se è un pagamento ricorrrente e nel caso positivo domani invio il feedback
    if not primo:
        token = secrets.token_hex(16)
        da_inviare = date.today() + timedelta(days=1)
        Feedback.objects.create(token=token, tipo='mensile', da_inviare=da_inviare, user=user)
        
    # Creo i feedback mensili per il numero di mesi a cui si è iscritto l'utente meno l'ultimo mese
    for i in range(mesi_iscrizione):
        if i > 0:
            token = secrets.token_hex(16)
            days_in_month = 0
            data = date.today()
            for i1 in range(i):
                month = (data.month + i1 - 1) % 12 + 1
                year = data.year + (data.month + i1 - 1) // 12
                days_in_month += calendar.monthrange(year, month)[1]
            da_inviare = data + timedelta(days=days_in_month)
            Feedback.objects.create(token=token, tipo='mensile', da_inviare=da_inviare, user=user)
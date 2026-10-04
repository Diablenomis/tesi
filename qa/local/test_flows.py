"""Run against a NEW disposable database each time; output observed results, not mocks of business logic."""
import copy
import os
import json
import traceback
from datetime import datetime, date, timedelta, timezone
import runtime

stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
database = runtime.ARTIFACTS / ('qa-' + stamp + '.sqlite3')
runtime.setup(database)
from django.core.management import call_command
from django.conf import settings
from rest_framework.test import APIClient
from authentication.models import User
from scheda_tutorial.models.models_general import Exercise, Week, Day, Section, ExerciseInForm
from scheda_tutorial.models.models_personal import FormSP, Feedback, Survey
from scheda_tutorial import tasks
from rest_framework_simplejwt.tokens import RefreshToken
import jwt

call_command('migrate', verbosity=0, interactive=False)
results = []
password = 'LocalQa2026!'
client = APIClient()
client.raise_request_exception = False

def body(response):
    return getattr(response, 'data', None)

def request(method, path, data=None, actor=None):
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(RefreshToken.for_user(actor).access_token) if actor else '')
    return getattr(client, method)(path, data, format='json')

def record(identifier, title, action):
    try:
        detail = action()
        results.append({'id': identifier, 'test': title, **detail})
    except Exception as exc:
        results.append({'id': identifier, 'test': title, 'outcome': 'BLOCKED',
                        'detail': type(exc).__name__ + ': ' + str(exc), 'traceback': traceback.format_exc()})
    print(json.dumps(results[-1], ensure_ascii=False, default=str), flush=True)

def status(response, expected, detail=''):
    return {'outcome': 'PASS' if response.status_code == expected else 'FAIL',
            'expected_status': expected, 'actual_status': response.status_code,
            'detail': detail, 'response': body(response) if response.status_code >= 400 else None}

payload = {'email': 'cliente@example.test', 'username': 'clienteqa', 'password': password,
           'name': 'Cliente', 'surname': 'Prova', 'gender': 'M', 'bday': '1990-01-01'}
record('REG-01', 'Registrazione con dati validi; email intercettata',
       lambda: status(request('post', '/auth/register/', payload), 201))
customer = User.objects.get(email=payload['email'])
record('REG-02', 'Registrazione duplicata', lambda: status(request('post', '/auth/register/', payload), 400))
record('REG-03', 'Registrazione incompleta', lambda: status(request('post', '/auth/register/', {'email':'vuoto@example.test'}), 400))
record('AUTH-01', 'Login prima della verifica email',
       lambda: status(request('post', '/auth/login/', {'email':payload['email'], 'password':password}), 401))

def activate():
    token = runtime.OUTBOX[0]['personalization'][0]['data']['token']
    response = request('get', '/auth/email-verify/?token=' + token)
    customer.refresh_from_db()
    return {**status(response, 200), 'verified_in_database': customer.is_verified,
            'local_emails': len(runtime.OUTBOX)}
record('EMAIL-01', 'Attivazione usando il token generato dalla registrazione', activate)
record('EMAIL-02', 'Token email non valido', lambda: status(request('get', '/auth/email-verify/?token=invalid'), 400))
record('EMAIL-03', 'Token email scaduto', lambda: status(request('get', '/auth/email-verify/?token=' + jwt.encode(
    {'user_id': customer.id, 'exp': datetime.now(timezone.utc)-timedelta(hours=1)}, settings.SECRET_KEY, algorithm='HS256')), 400))

def login():
    response = request('post', '/auth/login/', {'email':payload['email'], 'password':password})
    data = body(response)
    return {**status(response, 200), 'access_token_returned': bool(data.get('tokens', {}).get('access')),
            'refresh_token_returned': bool(data.get('tokens', {}).get('refresh'))}
record('AUTH-02', 'Login dopo verifica', login)
record('AUTH-03', 'Password errata', lambda: status(request('post', '/auth/login/', {'email':payload['email'],'password':'WrongPassword123'}), 401))
record('AUTH-04', 'Login con username', lambda: status(request('post', '/auth/login/', {'username':payload['username'],'password':password}), 200))

def create_user(email, trainer=False):
    user = User.objects.create_user(email.split('@')[0], email, 'Utente', 'Test', 'M', '1990-01-01', password)
    user.is_verified = True
    user.is_trainer = trainer
    user.save()
    return user
trainer = create_user('trainer@example.test', True)
other = create_user('altro@example.test')

record('SURVEY-01', 'Invio questionario senza login', lambda: status(request('post', '/survey/send/', {'survey':[]}), 401))
record('SURVEY-02', 'Invio questionario locale', lambda: status(request('post', '/survey/send/', {'survey':[
    {'question':'Altezza','answer':'175'}, {'question':'Peso','answer':'70'},
    {'question':'Quali sono i tuoi obiettivi','answer':'Migliorare resistenza'},
    {'question':"Inserisci un'immagine di te stesso",'answer':''}]}, actor=customer), 201))
record('SURVEY-03', 'Questionario vuoto autenticato: dovrebbe essere rifiutato',
       lambda: status(request('post', '/survey/send/', {'survey':[]}, actor=customer), 400))

exercise = Exercise.objects.create(name='Squat QA locale', gender='G', type='C', video='')
form_payload = {'name':'Scheda QA locale', 'user_email':customer.email,
 'weeks':[{'number':1,'name':'Settimana 1','days':[{'number':1,'name':'Giorno 1','sections':[
    {'name':'Allenamento','order':1,'exercises':[{'exe':{'id':exercise.id},'order':1,'repetitions':'10',
      'series':3,'stop':60,'load':'Corpo libero','intensity':5,'description':'Esercizio fittizio per test locale'}]}]}]}]}
record('FORM-01', 'Creazione scheda da trainer', lambda: status(request('post','/personal/form/',form_payload,actor=trainer),201))
form = FormSP.objects.get(name='Scheda QA locale')
form_id = str(form.id)
record('FORM-02', 'Bozza non visibile al proprietario', lambda: status(request('get','/personal/my-course/?scheda='+form_id,actor=customer),404))
record('FORM-03', 'Pubblicazione da trainer', lambda: status(request('put','/personal/form/publish/'+form_id+'/',actor=trainer),200))

def consult():
    response = request('get','/personal/my-course/?scheda='+form_id,actor=customer)
    data = body(response)
    observed = data['weeks'][0]['days'][0]['sections'][0]['exercises'][0]
    correct = observed['series']==3 and observed['repetitions']=='10' and observed['stop']==60
    return {**status(response,200), 'outcome':'PASS' if response.status_code==200 and correct else 'FAIL',
            'exercise': observed, 'publication_feedback_count': Feedback.objects.filter(form=form).count()}
record('FORM-04', 'Consultazione e integrità dei parametri esercizio', consult)
record('FORM-05', 'Scheda altrui non visibile tramite API personale',lambda:status(request('get','/personal/my-course/?scheda='+form_id,actor=other),404))
record('FORM-06', 'Consultazione senza login',lambda:status(request('get','/personal/my-course/?scheda='+form_id),401))
edited = copy.deepcopy(form_payload)
edited['name'] = 'Scheda QA aggiornata'
edited['weeks'][0]['days'][0]['sections'][0]['exercises'][0]['repetitions'] = '12'
record('FORM-07','Aggiornamento scheda pubblicata',lambda:status(request('put','/personal/form/'+form_id+'/',edited,actor=trainer),200))
record('FORM-08','Ritiro da trainer',lambda:status(request('put','/personal/form/publish/'+form_id+'/',actor=trainer),200))
record('FORM-09','Scheda ritirata non visibile',lambda:status(request('get','/personal/my-course/?scheda='+form_id,actor=customer),404))
record('FORM-10','Ripubblicazione da trainer',lambda:status(request('put','/personal/form/publish/'+form_id+'/',actor=trainer),200))

feed = Feedback.objects.filter(form=form).first()
feedback_payload = {'token':feed.token,'critici':'Nessuna criticità, dati fittizi','forti':'Chiarezza',
                    'ese_differenti':'Nessuno','tempistiche_ok':'Sì','altro':'Test locale'}
record('FEED-01','Validazione token feedback',lambda:status(request('get','/personal/feedback/?token='+feed.token),200))
record('FEED-02','Invio feedback con email intercettata',lambda:status(request('post','/personal/feedback/',feedback_payload),202))
record('FEED-03','Riutilizzo feedback completato',lambda:status(request('post','/personal/feedback/',feedback_payload),400))
record('FEED-04','Token feedback inesistente',lambda:status(request('get','/personal/feedback/?token=invalid'),400))

def weekly():
    Feedback.objects.create(form=form,tipo='settimanale',token='weekly-local-test',da_inviare=date.today())
    before = len(runtime.OUTBOX)
    tasks.feedback_settimanale()
    count = len(runtime.OUTBOX)-before
    return {'outcome':'PASS' if count >= 1 else 'FAIL','expected_emails_min':1,'actual_emails':count}
record('TASK-01','Invito settimanale in scadenza, esecuzione sincrona del task',weekly)

def monthly_in_weekly():
    Feedback.objects.create(user=customer,tipo='mensile',token='monthly-local-test',da_inviare=date.today())
    try:
        tasks.my_task()
        return {'outcome':'PASS','detail':'Task completo senza eccezioni'}
    except Exception as exc:
        return {'outcome':'FAIL','detail':type(exc).__name__+': '+str(exc)}
record('TASK-02','Task complessivo con feedback mensile in scadenza',monthly_in_weekly)
def monthly():
    before=len(runtime.OUTBOX)
    tasks.feedback_mensile()
    count=len(runtime.OUTBOX)-before
    return {'outcome':'PASS' if count==1 else 'FAIL','actual_emails':count}
record('TASK-03','Funzione mensile invocata separatamente',monthly)

def feedback_mail_failure():
    pending=Feedback.objects.create(form=form,tipo='settimanale',token='mailfail-local-test',da_inviare=date.today())
    data={**feedback_payload,'token':pending.token}
    runtime.SEND_STATUS='500'
    try:
        response=request('post','/personal/feedback/',data)
    finally:
        runtime.SEND_STATUS='202'
    pending.refresh_from_db()
    return {**status(response,500),'inviato':pending.inviato,'responses_persisted':bool(pending.critici)}
record('FEED-05','Errore trasporto email simulato dopo compilazione',feedback_mail_failure)

record('PERM-01','Cliente ordinario tenta creazione scheda: atteso divieto',lambda:status(request('post','/personal/form/',{**form_payload,'name':'QA non autorizzata'},actor=other),403))
record('PERM-02','Cliente ordinario legge dettaglio gestionale altrui: atteso divieto',lambda:status(request('get','/personal/form/'+form_id+'/',actor=other),403))
record('PERM-03','Cliente ordinario modifica scheda altrui: atteso divieto',lambda:status(request('put','/personal/form/'+form_id+'/',{**edited,'name':'QA modifica non autorizzata'},actor=other),403))
record('PERM-04','Cliente ordinario ritira scheda altrui: atteso divieto',lambda:status(request('put','/personal/form/publish/'+form_id+'/',actor=other),403))

def refresh():
    response=request('post','/auth/token/refresh/',{'refresh':str(RefreshToken.for_user(customer))})
    return {**status(response,200),'response_keys':list(body(response).keys())}
record('AUTH-05','Rinnovo token lato API',refresh)
def logout():
    token=str(RefreshToken.for_user(customer))
    response=request('post','/auth/logout/',{'refresh':token},actor=customer)
    retry=request('post','/auth/token/refresh/',{'refresh':token})
    return {**status(response,204),'refresh_after_logout':retry.status_code,
            'outcome':'PASS' if response.status_code==204 and retry.status_code==401 else 'FAIL'}
record('AUTH-06','Logout API e revoca refresh',logout)

# Restore one usable published form for the browser stage; fixture maintenance is explicit.
form.refresh_from_db()
form.name='Scheda QA locale'
form.published=True
form.save()
request('put','/personal/form/'+form_id+'/',edited,actor=trainer)
Feedback.objects.create(form=form,tipo='settimanale',token='browser-feedback-local',da_inviare=date.today())
session={'database':str(database) if 'sqlite' in settings.DATABASES['default']['ENGINE'] else 'MySQL:qa',
         'form_id':form_id,'customer':customer.email,'trainer':trainer.email,
         'other':other.email,'password':password,'browser_feedback_token':'browser-feedback-local'}
(runtime.ARTIFACTS/'session.json').write_text(json.dumps(session,indent=2),encoding='utf-8')
report={'run':stamp,'database_engine':settings.DATABASES['default']['ENGINE'],'transport':'APIClient / original Django URL routing',
        'emails':'MailerSend send replaced with local collector','outbox_count':len(runtime.OUTBOX),
        'external_network_attempts':runtime.BLOCKED_NETWORK,'results':results}
(runtime.ROOT/'docs/prove-locali'/os.getenv('QA_REPORT_NAME', 'api-results.json')).write_text(json.dumps(report,indent=2,ensure_ascii=False,default=str),encoding='utf-8')
print('REPORT '+str(runtime.ROOT/'docs/prove-locali'/os.getenv('QA_REPORT_NAME', 'api-results.json')),flush=True)

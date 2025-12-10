import datetime
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
import stripe
import os
import logging

from .models import CodSconto
from .serializers import CodScontoDetSer, CodScontoSer, CustomerPortalSer, PaymentSer, PaymentPersSer, ProductSer, ProductStripeSer, SessionSer
from .renderers import ViewRenderer
from scheda_tutorial.models.models_tutorial import LevelCourse, Association
from authentication.models import User
from . import services, permission_custom
import random
import string
from django.db.models import F

stripe.api_key = os.getenv("STRIPE_API_KEY", '')
logger = logging.getLogger(__name__)

protocol = os.getenv('PROTOCOL_URL', 'http://')
domain_url = os.getenv('DOMAIN_URL', 'localhost')

mail_generic = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}


def checkout(email, payment_method_id, price):
    extra_msg = ''  # add new variable to response message
    # checking if customer with provided email already exists
    customer_data = stripe.Customer.list(email=email).data

    # if the array is empty it means the email has not been used yet
    if len(customer_data) == 0:
        # creating customer
        customer = stripe.Customer.create(email=email, payment_method=payment_method_id)
    else:
        customer = customer_data[0]
        extra_msg = "Customer already existed."

    stripe.PaymentIntent.create(
        customer=customer,
        payment_method=payment_method_id,
        currency='pln',  # puoi fornire qualsiasi valuta desideri
        amount=price,
        confirm=True)
    return customer.id, extra_msg


class PaySchedeTutorial(generics.GenericAPIView):
    serializer_class = PaymentSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    @staticmethod
    def get_price(list_courses, user):
        price = 0
        level_ids = [record['id'] for record in LevelCourse.objects.filter(users__user__id=user.id).values()]
        for course in list_courses:
            level = LevelCourse.objects.get(course__title=course["title"],
                                             level=course["level"], gender=course["gender"])

            if level.id in level_ids:
                raise ValueError("Alredy Bought!")

            price += int(level.price * 100)
        return price

    def post(self, request):
        # Calcolo il prezzo totale
        try:
            price = self.get_price(request.data["products"], request.user)
        except LevelCourse.DoesNotExist:
            return Response({'details': 'Corso non presente'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'details': 'Uno dei corsi è già stato acquistato in precedenza'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Effettuo il pagamento
        if os.getenv('ALL_FREE'):
            resp_checkout = {"id": "gratuito"}
        else:
            resp_checkout = checkout(request.user.email, request.data["payment_method_id"], price)

        # Sblocco i corsi
        self.unlock_course(request.data["products"], request.user.email, resp_checkout["id"])

        return Response(status=status.HTTP_200_OK, data={'message': 'Success'
                                                         # , 'data': {'customer_id': resp_checkout[0]}
                                                         # , 'extra_msg': resp_checkout[1]
                                                         })

    @staticmethod
    def unlock_course(list_courses, email, transaction):
        user = User.objects.get(email=email)
        for course in list_courses:
            c = LevelCourse.objects.get(course__title=course["title"], level=course["level"], gender=course["gender"])
            association = Association(user=user, scheda_tutorial=c, transaction=transaction)
            association.save()

        return "OK"


class PaySchedePers(generics.GenericAPIView):
    serializer_class = PaymentPersSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # Calcolo il prezzo totale
        try:
            price = self.get_price(request.data["products"], request.user)
        except LevelCourse.DoesNotExist:
            return Response({'details': 'Corso non presente'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'details': 'Uno dei corsi è già stato acquistato in precedenza'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Effettuo il pagamento
        if os.getenv('ALL_FREE'):
            resp_checkout = {"id": "gratuito"}
        else:
            resp_checkout = checkout(request.user.email, request.data["payment_method_id"], price)


        # Sblocco i corsi
        self.unlock_course(request.data["products"], request.user.email, resp_checkout["id"])

        return Response(status=status.HTTP_200_OK, data={'message': 'Success'
                                                         # , 'data': {'customer_id': resp_checkout[0]}
                                                         # , 'extra_msg': resp_checkout[1]
                                                         })

    @staticmethod
    def unlock_course(list_courses, email, transaction):
        user = User.objects.get(email=email)
        for course in list_courses:
            c = LevelCourse.objects.get(course__title=course["title"], level=course["level"], gender=course["gender"])
            association = Association(user=user, scheda_tutorial=c, transaction=transaction)
            association.save()

        return "OK"

class CodScontoView(generics.GenericAPIView):
    serializer_class = CodScontoSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated, permission_custom.IsAdmin,)
    
    def get(self, request):
        # Recupera tutti i codici promozionali attivi
        promotion_codes = stripe.PromotionCode.list(active=True)
        logger.info(promotion_codes)

        # Crea una lista dei codici promozionali con le informazioni che ti servono
        promo_list = []
        for promo in promotion_codes['data']:
            expires_at = datetime.datetime.fromtimestamp(promo['expires_at'])
            if datetime.datetime.now() <= expires_at and promo['coupon']['max_redemptions'] is not None and promo['times_redeemed'] < promo['coupon']['max_redemptions']:
                created_f = datetime.datetime.fromtimestamp(promo['created']).strftime('%Y-%m-%d')
                expires_at_f = expires_at.strftime('%Y-%m-%d')
                
                promo_list.append({
                    'id': promo['id'],  # Il codice promozionale
                    'codice': promo['code'],  # Il codice promozionale
                    'coupon': promo['coupon']['id'],  # L'ID del coupon associato
                    'create_at': created_f,  # Data di creazione
                    'expires_at': expires_at_f,  # Data di scadenza
                })

        return Response(promo_list, status=status.HTTP_200_OK)

    def post(self, request):
        if 'codice' not in request.data or not request.data['codice']:
            while True:
                request.data['codice'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
                if not CodSconto.objects.filter(codice=request.data['codice']).exists():
                    break

        if request.data['percentuale']:
            percent_off = request.data['sconto']
            amount_off = None
            currency = None
        else:
            amount_off = float(request.data['sconto']) * 100
            amount_off = int(amount_off)
            currency = 'EUR'
            percent_off = None

        # Convert string yyyy/mm/dd to timestamp
        datetime_reedem =  datetime.datetime.strptime(request.data['fineValidita'], '%Y-%m-%d')

        coupon = stripe.Coupon.create(
            percent_off=percent_off,
            amount_off=amount_off,
            currency=currency,
            redeem_by=int(datetime_reedem.timestamp()),
            max_redemptions=request.data['massimoUsi'],
            duration="once",
        )

        stripe.PromotionCode.create(
            coupon=coupon.id,
            code= request.data['codice'],
        )
        
        return Response(request.data, status=status.HTTP_201_CREATED)
    

class CodScontoDetailView(generics.GenericAPIView):
    serializer_class = CodScontoDetSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated, permission_custom.IsAdmin)

    def get(self, request, codice):
        promotion_codes = stripe.PromotionCode.list(active=True, code=codice)
        try:
            # Se ci sono risultati, prendiamo il primo (ci dovrebbe essere solo uno con quel code)
            if promotion_codes['data']:
                promo = promotion_codes['data'][0]
                # Prepara i dati per la risposta
                expires_at = datetime.datetime.fromtimestamp(promo['expires_at'])
                if datetime.datetime.now() <= expires_at and promo['coupon']['max_redemptions'] is not None and promo['times_redeemed'] < promo['coupon']['max_redemptions']:
                    created_f = datetime.datetime.fromtimestamp(promo['created']).strftime('%Y-%m-%d')
                    expires_at_f = expires_at.strftime('%Y-%m-%d')
                    
                    if promo['coupon']['amount_off']:
                        percentuale = False
                        sconto = float(promo['coupon']['amount_off']) / 100
                    else:
                        percentuale = True
                        sconto = promo['coupon']['percent_off']
                    
                    promo_data = {
                        'id': promo['id'],  # Il codice promozionale
                        'create_at': created_f,  # Data di creazione
                        'sconto': sconto,
                        'percentuale': percentuale,
                        'fine_validita': expires_at_f,  # Data di scadenza
                        'usi_rimasti': (promo['coupon']['max_redemptions'] - promo['times_redeemed']),  # Numero di volte che è usabile
                    }
                    return Response(promo_data, status=status.HTTP_200_OK)

            return Response({'error': 'Promotion code not found'}, status=status.HTTP_404_NOT_FOUND)

        except stripe.error.InvalidRequestError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, codice):
        promotion_codes = stripe.PromotionCode.list(active=True, code=codice)
        try:
            # Se ci sono risultati, prendiamo il primo (ci dovrebbe essere solo uno con quel code)
            if promotion_codes['data']:
                promo = promotion_codes['data'][0]
                stripe.PromotionCode.modify(
                    promo['id'],
                    active=False
                )
                # Prepara i dati per la risposta
                if request.data['percentuale']:
                    percent_off = request.data['sconto']
                    amount_off = None
                    currency = None
                else:
                    amount_off = float(request.data['sconto']) * 100
                    amount_off = int(amount_off)
                    currency = 'EUR'
                    percent_off = None

                # Convert string yyyy/mm/dd to timestamp
                datetime_reedem =  datetime.datetime.strptime(request.data['fine_validita'], '%Y-%m-%d')
                coupon = stripe.Coupon.create(
                    percent_off=percent_off,
                    amount_off=amount_off,
                    currency=currency,
                    redeem_by=int(datetime_reedem.timestamp()),
                    max_redemptions=((promo['coupon']['max_redemptions'] - promo['times_redeemed']) + request.data['usi_aggiuntivi']),
                    duration="once",
                )
                new_promo = stripe.PromotionCode.create(
                    coupon=coupon.id,
                    code= codice,
                )
                promo_data = {
                    'id': new_promo['id'],  # Il codice promozionale
                    'sconto': request.data['sconto'],
                    'percentuale': request.data['percentuale'],
                    'fine_validita': request.data['fine_validita'],  # Data di scadenza
                    'usi_rimasti': coupon['max_redemptions'],  # Numero di volte che è usabile
                }
                return Response(promo_data, status=status.HTTP_200_OK)
                

            return Response({'error': 'Promotion code not found'}, status=status.HTTP_404_NOT_FOUND)

        except stripe.error.InvalidRequestError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProductsView(generics.GenericAPIView):
    serializer_class = ProductStripeSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        products = stripe.Product.list(active=True)
        products_with_prices = []
        for product in products['data']:
            prices = stripe.Price.list(product=product['id'])
            product_info = {
                'id': product['id'],
                'name': product['name'],
                'description': product.get('description', ''),
                'prices': [
                    {
                        'id': price['id'],
                        'unit_amount': price['unit_amount'],
                        'currency': price['currency'],
                        'interval': price['recurring']['interval'],
                        'interval_count': price['recurring']['interval_count'],
                    }
                    for price in prices['data']
                ]
            }
            products_with_prices.append(product_info)
        logger.info(products_with_prices)
        sorted_products = sorted(products_with_prices, key=lambda p: p['prices'][0]['unit_amount'])

        return JsonResponse({'products': sorted_products})

    def post(self, request):
        try:
            product = stripe.Product.create(name=request.data['nome'])
            price = stripe.Price.create(
                product=product.id,
                unit_amount=int(request.data['prezzo'] * 100),
                currency='eur',
                recurring={
                            'interval': 'month',
                            'interval_count': request.data['conto_mesi']
                           },

            )
            return JsonResponse({'product': product, 'price': price})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProductDetView(generics.GenericAPIView):
    serializer_class = ProductStripeSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request, product_id):
        try:

            stripe.Product.modify(product_id, metadata={"name": request.data['nome']}, )

            product = stripe.Product.retrieve(product_id)
            price = stripe.Price.create(
                product=product.id,
                unit_amount=int(request.data['prezzo'] * 100),
                currency='eur',
                recurring={
                            'interval': 'month',
                            'interval_count': request.data['conto_mesi']
                           },

            )
            return JsonResponse({'product': product, 'price': price})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, product_id):
        try:
            stripe.Product.retrieve(product_id)
            stripe.Product.modify(product_id, active=False)
            return JsonResponse({'deleted': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
 

class SubscriptionView(generics.GenericAPIView):

    def post(self, request):
        try:
            customer = stripe.Customer.create(email=request.user.email, payment_method=request.data['payment_method_id'])
            stripe.Subscription.create(
                customer=customer.id,
                items=[
                    {"price": request.data['price_id']}
                ]
            )
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateCheckoutSessionView(generics.GenericAPIView):
    serializer_class = SessionSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            price = stripe.Price.retrieve(request.data['product_price_id'])
            user = User.objects.get(email=request.user.email)
    
            if not user.id_subscription:
                # Crea il cliente su Stripe
                stripe_customer = stripe.Customer.create(
                    email=request.user.email
                )
                user.id_subscription = stripe_customer.id
                user.save()

            # Crea una sessione di checkout per l'abbonamento
            checkout_session = stripe.checkout.Session.create(
                customer=user.id_subscription,
                payment_method_types=['card'],
                line_items=[
                    {
                        'price': price.id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                allow_promotion_codes=True,
                success_url=protocol + domain_url + '/payment-succeeded/',
                cancel_url=protocol + domain_url + '/payment-failed/',
            )

            return JsonResponse({'client_secret': checkout_session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
class CustomerPortalView(generics.GenericAPIView):
    serializer_class = CustomerPortalSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        email = request.user.email
        customer = User.objects.get(email=email).id_subscription

        portalSession = stripe.billing_portal.Session.create(
            customer=customer,
            return_url=protocol + domain_url + "/profile",
        )
        return JsonResponse({'portal_session_id': portalSession.url}, status=status.HTTP_200_OK)
        

class WebhookView(generics.GenericAPIView):

    def post(self, request):
        webhook_secret = os.getenv('STRIPE_SIGNATURE_KEY', 'whsec_12345')
        if webhook_secret:
            # Recupera l'evento verificando la firma usando il corpo raw e il secret
            signature = request.headers.get('stripe-signature')
            try:
                event = stripe.Webhook.construct_event(
                    payload=request.body,  # Usa request.body qui, che è il payload raw della richiesta
                    sig_header=signature,
                    secret=webhook_secret
                )
                data = event['data']
            except stripe.error.SignatureVerificationError as e:
                # Gestisci l'errore di verifica della firma
                logger.error(f"Errore di verifica della firma: {str(e)}")
                return JsonResponse({'error': 'Invalid signature'}, status=400)
            except Exception as e:
                logger.error(f"Errore nel processare l'evento webhook: {str(e)}")
                return JsonResponse({'error': 'Webhook processing error'}, status=400)
            
            # Tipo di evento del webhook
            event_type = event['type']
        else:
            data = request.data
            event_type = data['type']

        logger.info('event ' + event_type)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            customer_id = session.get('customer')  # ID del cliente

        if event_type == 'customer.subscription.created':
            logger.info('è stata creata una sottoscrizione.')
        elif event_type == 'customer.subscription.updated':
            # Email di dati aggiornati
            logger.info('è stata aggiornata una sottoscrizione.')
        elif event_type == 'customer.subscription.deleted':
            # Email di conferma cancellazione dell'abbonamento
            logger.info('è stata cancellata una sottoscrizione.')
            
        elif event_type == 'invoice.payment_succeeded':
            invoice = event['data']['object']
            billing_reason = invoice.get('billing_reason', None)
            
            if billing_reason == "subscription_create":
                services.primo_pagamento(invoice)
            elif billing_reason == "subscription_cycle":
                services.pagamento_ricorrente(invoice)
            
        elif event_type == 'invoice.payment_failed':
            # Email di pagamento non riuscito
            logger.info('è fallito un pagamento.')

        #Logica da Rivedere
        elif event_type == 'customer.discount.created':
            discount = event['data']['object']
        
            # Recuperare il coupon e, se disponibile, il codice promozionale
            coupon = discount['coupon']
            promotion_code_id = discount.get('promotion_code')

            logger.info("Coupon applicato:", coupon['id'])
            if promotion_code_id:
                try:
                    promotion_code = stripe.PromotionCode.retrieve(promotion_code_id)
                    logger.info("Codice promozionale usato:", promotion_code['code'])
                    CodSconto.objects.filter(codice=promotion_code['code']).update(usi=F('usi') + 1)
                except Exception as e:
                    logger.info(f"Errore durante il recupero del codice promozionale: {str(e)}")
        elif event_type == 'customer.discount.delete':
            discount = event['data']['object']
        
            # Recuperare il coupon e, se disponibile, il codice promozionale
            coupon = discount['coupon']
            promotion_code_id = discount.get('promotion_code')

            logger.info("Coupon eliminato:", coupon['id'])
            if promotion_code_id:
                try:
                    promotion_code = stripe.PromotionCode.retrieve(promotion_code_id)
                    logger.info("Codice promozionale rimosso:", promotion_code['code'])
                    CodSconto.objects.filter(codice=promotion_code['code']).update(usi=F('usi') - 1)
                except Exception as e:
                    logger.info(f"Errore durante il recupero del codice promozionale: {str(e)}")

        return JsonResponse({'status': 'success'})
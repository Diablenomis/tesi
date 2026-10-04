"""Prepare six clearly named local QA users. No Stripe calls in this fixture."""
import json
from pathlib import Path
from django.db import transaction
from authentication.models import User
from coach.models import Coach
from scheda_tutorial.models.models_personal import Survey, Question
from scheda_tutorial.models.models_general import TempEmail

root = Path('/workspace')
state_path = root / '.local-test-artifacts/stripe-payment-run.json'
if state_path.exists():
    raise SystemExit('Fixture already exists; resume existing run, do not duplicate')
source = Survey.objects.filter(user__email='cliente@example.test').order_by('-created_at').first()
assert source and source.questions.exists(), 'Existing synthetic questionnaire required'
catalog = json.loads((root / '.local-test-artifacts/stripe-preflight.json').read_text())['catalog']
state = {'run': 'stripe-20261003', 'cases': []}
with transaction.atomic():
    coach, _ = Coach.objects.get_or_create(email='stripe-coach@example.test', defaults={
        'name': 'StripeQA', 'surname': 'Coach', 'bday': '1980-01-01', 'gender': 'M', 'coach_exp': 'Synthetic QA fixture'})
    for product in sorted(catalog, key=lambda p: p['name'], reverse=True):
        for price in sorted(product['prices'], key=lambda p: p['recurring']['interval_count']):
            months = price['recurring']['interval_count']
            kind = 'scheda' if product['name'] == 'scheda-personalizzata' else 'coaching'
            email = 'stripe-qa-%s-%s-20261003@example.test' % (kind, months)
            user = User.objects.create_user(email, email, 'StripeQA', '%s%s' % (kind, months), 'M', '1990-01-01', 'LocalQa2026!')
            user.is_verified = True
            user.save(update_fields=['is_verified'])
            survey = Survey.objects.create(user=user)
            Question.objects.bulk_create([Question(survey=survey, question=q.question, answer=q.answer) for q in source.questions.all()])
            if kind == 'coaching':
                TempEmail.objects.create(email=email, coach_email=coach.email)
            state['cases'].append({'kind': kind, 'months': months, 'email': email, 'user_id': user.id,
                                   'price_id': price['id'], 'amount': price['unit_amount'], 'status': 'prepared'})
state_path.write_text(json.dumps(state, indent=2))
print(json.dumps({'prepared': len(state['cases']), 'source_questions': source.questions.count(),
                  'cases': state['cases']}, indent=2))

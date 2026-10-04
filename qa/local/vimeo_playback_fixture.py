"""Dedicated local exercise/sheet for real player testing; historical fixtures untouched."""
import json
from datetime import date
from pathlib import Path
from django.db import transaction
from authentication.models import User
from scheda_tutorial.models.models_personal import FormSP
from scheda_tutorial.models.models_general import Exercise, Week, Day, Section, ExerciseInForm

with transaction.atomic():
    customer = User.objects.get(email='cliente@example.test')
    form, _ = FormSP.objects.get_or_create(name='Vimeo QA playback 20261003', user=customer,
        defaults={'published': True, 'first_published': date.today()})
    week, _ = Week.objects.get_or_create(formSP=form, number=1, defaults={'name': 'Settimana Vimeo'})
    day, _ = Day.objects.get_or_create(week=week, number=1, defaults={'name': 'Giorno Vimeo'})
    section, _ = Section.objects.get_or_create(day=day, order=1, defaults={'name': 'Video prova'})
    exercise, _ = Exercise.objects.get_or_create(name='Vimeo QA video 20261003', gender='G', type='C',
        defaults={'video': '1232641850'})
    ExerciseInForm.objects.get_or_create(section=section, order=1,
        defaults={'exe': exercise, 'repetitions': '10', 'series': 3, 'stop': 60})
report = {'form_id': str(form.id), 'video_id': exercise.video, 'customer': customer.email,
          'published': form.published, 'fixture_only': True}
Path('/workspace/docs/prove-vimeo/playback-fixture.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))

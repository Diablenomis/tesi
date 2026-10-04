"""Read-only evidence of browser actions against QA fixtures."""
import json
from pathlib import Path
from django_celery_beat.models import PeriodicTask
from scheda_tutorial.models.models_personal import Survey, FormSP, Feedback

survey = Survey.objects.filter(user__email='cliente@example.test').latest('created_at')
data = {
    'survey': {'created_at': str(survey.created_at), 'question_count': survey.questions.count(),
               'selected_answers': list(survey.questions.filter(question__in=[
                   'Altezza', 'Peso', 'Attualmente ti alleni?', 'Dove ti allenerai'
               ]).values('question', 'answer'))},
    'browser_form': list(FormSP.objects.filter(name='Scheda QA browser').values('name', 'published')),
    'browser_feedback': list(Feedback.objects.filter(token='browser-feedback-local').values(
        'inviato', 'critici', 'forti', 'ese_differenti', 'tempistiche_ok', 'altro')),
    'beat': list(PeriodicTask.objects.filter(name='QA local scheduling').values('enabled', 'total_run_count', 'last_run_at')),
}
output = Path('/workspace/docs/prove-locali/browser-db-results.json')
output.write_text(json.dumps(data, indent=2, ensure_ascii=False, default=str))
print(output.read_text())

from django.db import models
import uuid
from authentication.models import User


class FormSP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, default='Scheda X')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='form_pers', blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    first_published = models.DateField(null=True, blank=True)
    published = models.BooleanField(default=False)
    feedback = models.BooleanField(default=False)


class Feedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tipo = models.CharField(max_length=50, default='settimanale')
    critici = models.TextField(null=True, blank=True)
    forti = models.TextField(null=True, blank=True)
    ese_differenti = models.TextField(null=True, blank=True)
    tempistiche_ok = models.TextField(null=True, blank=True)
    altro = models.TextField(null=True, blank=True)
    inviato = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    da_inviare = models.DateField(null=True, blank=True)
    token = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_feedback_recived', blank=True, null=True)
    form = models.ForeignKey(FormSP, on_delete=models.CASCADE, related_name='feedback_recived', blank=True, null=True)

class Survey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='survey', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.TextField()
    answer = models.TextField(null=True, blank=True)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions', blank=True, null=True)
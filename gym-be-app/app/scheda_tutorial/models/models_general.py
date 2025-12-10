from django.db import models
import uuid
from django.core.exceptions import ValidationError
from authentication.models import User
from django.db.models import UniqueConstraint
from .models_tutorial import FormST, LevelCourse
from .models_personal import FormSP


# Create your models here.
class Exercise(models.Model):
    class Gender(models.TextChoices):
        MALE = 'M',
        FEMALE = 'F',
        GENERIC = 'G',

    class Type(models.TextChoices):
        TUTORIAL = 'T',
        CUSTOMIZED = 'C'

    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.MALE)
    type = models.CharField(max_length=10, choices=Type.choices, default=Type.CUSTOMIZED)
    video = models.CharField(max_length=255, null=True, blank=True)
    coaches = models.ManyToManyField("coach.Coach")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'gender', 'type'], name="%(app_label)s_%(class)s_unique")
        ]

    def __str__(self):
        return self.name


class Week(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    number = models.IntegerField()
    formST = models.ForeignKey(FormST, on_delete=models.CASCADE, related_name='weeks', null=True, blank=True)
    formSP = models.ForeignKey(FormSP, on_delete=models.CASCADE, related_name='weeks', null=True, blank=True)

    def clean(self):
        super().clean()
        if bool(self.formST) == bool(self.formSP):
            raise ValidationError("Devi valorizzare esattamente uno dei due campi")


class Day(models.Model):
    name = models.CharField(max_length=50)
    number = models.IntegerField(null=True, blank=True)
    week = models.ForeignKey(Week, on_delete=models.CASCADE, related_name='days', null=True, blank=True)


class Section(models.Model):
    name = models.CharField(max_length=50)
    order = models.IntegerField()
    day = models.ForeignKey(Day, on_delete=models.CASCADE, related_name='sections', null=True, blank=True)


class ExerciseInForm(models.Model):
    exe = models.ForeignKey(Exercise, on_delete=models.CASCADE, null=True, blank=True)
    order = models.IntegerField()
    repetitions = models.CharField(max_length=50)
    series = models.IntegerField()
    stop = models.IntegerField()
    load = models.CharField(max_length=50, null=True, blank=True)
    intensity = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='exercises')


class SuperSeries(models.Model):
    exe = models.ForeignKey(Exercise, on_delete=models.CASCADE, null=True, blank=True)
    order = models.IntegerField()
    repetitions = models.CharField(max_length=50)
    stop = models.IntegerField()
    load = models.CharField(max_length=50, null=True, blank=True)
    intensity = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    exercise = models.ForeignKey(ExerciseInForm, on_delete=models.CASCADE, related_name='super_series')

class TempEmail(models.Model):
    email = models.EmailField()
    personalization = models.TextField(null=True, blank=True)
    coach_email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

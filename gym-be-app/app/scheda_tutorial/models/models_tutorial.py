from django.db import models
import uuid
from authentication.models import User
from django.db.models import UniqueConstraint


class Discipline(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    image = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=255, unique=True, db_index=True)
    title_description = models.CharField(max_length=255, null=True)
    description = models.TextField()
    icon = models.CharField(max_length=255, null=True)
    image = models.CharField(max_length=255, null=True)
    discipline = models.ForeignKey(Discipline, related_name='discipline', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class LevelCourse(models.Model):
    class Level(models.TextChoices):
        PRIMI_PASSI = 'PRIMI_PASSI',
        BASE = 'BASE',
        INTERMEDIO = 'INTERMEDIO',
        AVANZATO = 'AVANZATO',
        MASTER = 'MASTER',

    class Gender(models.TextChoices):
        MALE = 'M',
        FEMALE = 'F',

    level = models.CharField(max_length=11, choices=Level.choices, default=Level.PRIMI_PASSI)
    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.MALE)
    requirements = models.TextField()
    goals = models.TextField()
    goals_video = models.CharField(max_length=255, null=True)
    frequency = models.CharField(max_length=255, default='Ogni giorno')
    duration = models.CharField(max_length=255, default='4 Settimane')
    required_items = models.TextField()
    requirements_video = models.CharField(max_length=255, null=True)
    description = models.TextField(null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    video = models.CharField(max_length=255, default="NON PRESENTE")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='levels')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['level', 'gender', 'course'], name="%(app_label)s_%(class)s_unique")
        ]

    def __str__(self):
        return self.level


class FormST(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scheda_tutorial = models.OneToOneField(LevelCourse, on_delete=models.CASCADE, related_name='form', blank=True,
                                           null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)


class Association(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schede_tutorial')
    scheda_tutorial = models.ForeignKey(LevelCourse, on_delete=models.CASCADE, related_name='users', blank=True,
                                        null=True)
    transaction = models.CharField(max_length=255)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'scheda_tutorial'], name="%(app_label)s_%(class)s_unique")
        ]

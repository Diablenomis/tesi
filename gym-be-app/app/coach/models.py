from django.db import models
from authentication.models import User
from scheda_tutorial.models.models_tutorial import Discipline, LevelCourse

# Create your models here.
class Coach(models.Model):

    class Gender(models.TextChoices):
        MALE = 'M',
        FEMALE = 'F',

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    number = models.CharField(max_length=15, null=True)
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    bday = models.DateField()
    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.MALE)
    weight = models.CharField(max_length=15, null=True)
    height = models.CharField(max_length=15, null=True)
    top_discipline = models.ForeignKey(Discipline, on_delete=models.DO_NOTHING, null=True)
    training_exp = models.CharField(max_length=255, null=True)
    coach_exp = models.TextField()
    skills = models.CharField(max_length=255, null=True)
    image = models.TextField(null=True, blank=True)
    video = models.CharField(max_length=255, null=True)
    max_coaching = models.IntegerField(default=8)
    level_course = models.ManyToManyField(LevelCourse, related_name='coaches')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'surname', 'bday'], name="%(app_label)s_%(class)s_unique")
        ]

    def __str__(self):
        return self.user
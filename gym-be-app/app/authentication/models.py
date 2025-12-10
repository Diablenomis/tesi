from django.db import models

# Create your models here.
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin)

from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken


class UserManager(BaseUserManager):

    def create_user(self, username, email, name, surname, gender, bday, password=None):
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')
        if name is None:
            raise TypeError('Users should have a Name')
        if surname is None:
            raise TypeError('Users should have a Surname')
        if gender is None:
            raise TypeError('Users should have a Gender')
        if bday is None:
            raise TypeError('Users should have a Bday')

        user = self.model(username=username, email=self.normalize_email(email), name=name, surname=surname,
                          gender=gender, bday=bday)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, name, surname, gender, bday, password=None):
        if password is None:
            raise TypeError('Password should not be none')

        user = self.create_user(username, email, name, surname, gender, bday, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


AUTH_PROVIDERS = {'facebook': 'facebook', 'google': 'google',
                  'twitter': 'twitter', 'email': 'email'}


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    bday = models.DateField()
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_trainer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    id_subscription =  models.CharField(max_length=255, blank=True, null=True)
    coach_email = models.EmailField(max_length=255, blank=True, null=True)
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('email'))

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

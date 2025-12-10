import uuid
from django.db import models
from django.utils.timezone import now


class CodSconto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codice = models.CharField(max_length=50)
    sconto = models.DecimalField(max_digits=5, decimal_places=2)
    percentuale = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    inizioValidita = models.DateField(default=now)
    fineValidita = models.DateField()
    usi = models.IntegerField(default=0)
    massimoUsi = models.IntegerField(default=1)

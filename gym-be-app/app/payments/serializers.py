from rest_framework import serializers

from .models import CodSconto


class ProductSer(serializers.Serializer):
    title = serializers.CharField(write_only=True, required=True)
    level = serializers.CharField(write_only=True, required=True)
    gender = serializers.CharField(write_only=True, required=True)

    class Meta:
        fields = ['course', 'level']


class PaymentSer(serializers.Serializer):
    payment_method_id = serializers.CharField(write_only=True, required=True)
    products = ProductSer(write_only=True, many=True, required=True)

    class Meta:
        fields = ['payment_method_id', 'products']

class PaymentPersSer(serializers.Serializer):
    payment_method_id = serializers.CharField(write_only=True, required=True)

    class Meta:
        fields = ['payment_method_id']

class CodScontoSer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    create_at = serializers.DateTimeField(read_only=True)
    codice = serializers.CharField(required=False)
    sconto = serializers.DecimalField(required=True, max_digits=5, decimal_places=2)
    percentuale = serializers.BooleanField(required=True)
    fineValidita = serializers.DateField(required=True)
    massimoUsi = serializers.IntegerField(required=True)

    class Meta:
        model = CodSconto
        fields = ['id', 'create_at', 'codice', 'sconto', 'percentuale', 'fineValidita', 'massimoUsi']

class CodScontoDetSer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    create_at = serializers.DateTimeField(read_only=True)
    sconto = serializers.DecimalField(required=True, max_digits=5, decimal_places=2)
    percentuale = serializers.BooleanField(required=True)
    fine_validita = serializers.DateField(required=True)
    usi_rimasti = serializers.IntegerField(read_only=True)
    usi_aggiuntivi = serializers.IntegerField(required=True, write_only=True)

    class Meta:
        fields = ['id', 'create_at', 'sconto', 'percentuale', 'fine_validita', 'usi_rimasti', 'usi_aggiuntivi']
        
class ProductStripeSer(serializers.Serializer):
    nome = serializers.CharField(write_only=True, required=True)
    prezzo = serializers.DecimalField(required=True, max_digits=5, decimal_places=2)
    conto_mesi = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        fields = ['nome', 'prezzo', 'conto_mesi']

class SessionSer(serializers.Serializer):
    client_secret = serializers.CharField(read_only=True)
    product_price_id = serializers.CharField(write_only=True, required=True)

    class Meta:
        fields = ['client_secret', 'product_price_id']

class CustomerPortalSer(serializers.Serializer):
    portal_session_id = serializers.CharField(read_only=True)

    class Meta:
        fields = ['portal_session_id']
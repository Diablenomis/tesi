from rest_framework import serializers
from .models import Coach


class CoachSer(serializers.ModelSerializer):

    class Meta:
        model = Coach
        fields = ['name', 'surname', 'number', 'email', 'bday', 'gender', 'weight', 'height', 'top_discipline',
                  'training_exp', 'coach_exp', 'skills', 'image', 'video']


class CoachGetSer(serializers.ModelSerializer):
    number_students = serializers.IntegerField(read_only=True)
    top_discipline_name = serializers.SlugRelatedField(source='top_discipline', many=False, read_only=True,
                                                       slug_field='name')

    class Meta:
        model = Coach
        fields = ['name', 'surname', 'number', 'email', 'bday', 'gender', 'weight', 'height', 'top_discipline_name',
                  'training_exp', 'coach_exp', 'skills', 'image', 'video', 'max_coaching', 'number_students']


class CoachExternalSer(serializers.ModelSerializer):
    top_discipline_name = serializers.CharField()

    class Meta:
        model = Coach
        fields = ['name', 'surname', 'number', 'email', 'bday', 'gender', 'weight', 'height',  'top_discipline_name',
                  'training_exp', 'coach_exp', 'skills', 'image', 'video']


class BoughtPersonalSer(serializers.Serializer):
    name = serializers.CharField(read_only=True)
    surname = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)

    class Meta:
        fields = ['name', 'surname', 'email']

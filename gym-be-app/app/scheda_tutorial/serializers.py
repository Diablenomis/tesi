import json
import logging

from django.db import transaction
from django.db.utils import IntegrityError
from django.forms.models import model_to_dict
from rest_framework import serializers

from .models.models_personal import FormSP
from .models.models_tutorial import Course, LevelCourse, Discipline, FormST, Association
from .models.models_general import Day, Exercise, Section, Week, SuperSeries, ExerciseInForm
from coach.models import Coach
from authentication.models import User
from django.db import transaction
from django.db import transaction


class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ['name', 'image']


class CoachViewSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=True)
    surname = serializers.CharField(read_only=True)
    email = serializers.CharField(required=True)
    number = serializers.CharField(required=True)
    image = serializers.CharField(required=True)

    class Meta:
        fields = ['name', 'surname', 'email', 'number', 'image']


class CoursesSerializer(serializers.ModelSerializer):
    title = serializers.CharField(read_only=True)
    title_description = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    icon = serializers.CharField(read_only=True)
    image = serializers.CharField(read_only=True)
    discipline = serializers.SlugRelatedField(many=False, read_only=True, slug_field='name')
    coaches = CoachViewSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['title', 'title_description', 'description', 'icon', 'image', 'discipline', 'coaches']


class LevelCourseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    level = serializers.CharField(read_only=True)
    gender = serializers.CharField(read_only=True)
    requirements = serializers.CharField(read_only=True)
    goals = serializers.CharField(read_only=True)
    goals_video = serializers.CharField(read_only=True)
    frequency = serializers.CharField(read_only=True)
    duration = serializers.CharField(read_only=True)
    required_items = serializers.CharField(read_only=True)
    requirements_video = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    price = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    coaches = CoachViewSerializer(many=True, read_only=True)

    class Meta:
        model = LevelCourse
        fields = ['id', 'level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'coaches']


class CourseSerializer(serializers.ModelSerializer):
    discipline = serializers.SlugRelatedField(many=False, read_only=True, slug_field='name')
    title = serializers.CharField(read_only=True)
    title_description = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    icon = serializers.CharField(read_only=True)
    image = serializers.CharField(read_only=True)
    levels = LevelCourseSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['discipline', 'title', 'title_description', 'description', 'icon', 'image', 'levels']


class CoachRequestInsertSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)

    class Meta:
        fields = ['email']


class LevelCourseInsertSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    coaches = CoachRequestInsertSerializer(many=True, required=False)

    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'video', 'course', 'coaches']


class LevelCourseInternalInsertSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'video', 'course']


class CourseInsertSerializer(serializers.ModelSerializer):
    discipline = serializers.CharField()
    levels = LevelCourseInsertSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = ['title', 'title_description', 'description', 'icon', 'image', 'discipline', 'levels']


class CourseInternalInsertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title', 'title_description', 'description', 'icon', 'image', 'discipline']


class CourseUpdateSerializer(serializers.ModelSerializer):
    discipline = serializers.CharField()

    class Meta:
        model = Course
        fields = ['title_description', 'description', 'icon', 'image', 'discipline']


class LevelCourseExternalInsertSerializer(serializers.ModelSerializer):
    level = serializers.ChoiceField(choices=LevelCourse.Level.choices, required=True)
    gender = serializers.ChoiceField(choices=LevelCourse.Gender.choices, required=True)
    requirements = serializers.CharField(required=True)
    goals = serializers.CharField(required=True)
    goals_video = serializers.CharField(required=False)
    frequency = serializers.CharField(required=False)
    duration = serializers.CharField(required=False)
    required_items = serializers.CharField(required=True)
    requirements_video = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    video = serializers.CharField(required=True)
    title_course = serializers.CharField(required=True)
    coaches = CoachRequestInsertSerializer(many=True, required=False)

    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'video', 'title_course', 'coaches']


class LevelCourseExternalUpdateSerializer(serializers.ModelSerializer):
    level = serializers.ChoiceField(choices=LevelCourse.Level.choices, required=True)
    gender = serializers.ChoiceField(choices=LevelCourse.Gender.choices, required=True)
    requirements = serializers.CharField(required=True)
    goals = serializers.CharField(required=True)
    goals_video = serializers.CharField(required=False)
    frequency = serializers.CharField(required=False)
    duration = serializers.CharField(required=False)
    required_items = serializers.CharField(required=True)
    requirements_video = serializers.CharField(required=True)
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    video = serializers.CharField(required=True)
    title_course = serializers.CharField(required=True)

    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'video', 'title_course']


class LevelCourseDelSer(serializers.ModelSerializer):
    level = serializers.ChoiceField(choices=LevelCourse.Level.choices, required=True)
    gender = serializers.ChoiceField(choices=LevelCourse.Gender.choices, required=True)
    title_course = serializers.CharField(required=True)

    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'title_course']


class LevelCourseRemoveCoach(serializers.Serializer):
    level = serializers.ChoiceField(choices=LevelCourse.Level.choices, required=True)
    gender = serializers.ChoiceField(choices=LevelCourse.Gender.choices, required=True)
    title_course = serializers.CharField(required=True)
    coach = CoachRequestInsertSerializer(many=False, required=True)

    class Meta:
        fields = ['level', 'gender', 'coach']


class CoachPkSer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    surname = serializers.CharField(read_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = Coach
        fields = ['name', 'surname', 'email']


class ExerciseSer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    gender = serializers.ChoiceField(choices=Exercise.Gender.choices, required=True)
    type = serializers.ChoiceField(choices=Exercise.Type.choices, required=True)
    video = serializers.CharField(required=False)
    coaches = CoachPkSer(many=True, required=False)

    alredy_exist_messages = {'detail': 'L\'esercizio è già presente nel database'}
    error_coach_messages = {'detail': 'Uno dei coach inseriti non è presente nel database'}

    @transaction.atomic
    def create(self, validated_data):
        coaches_data = validated_data.pop('coaches', None)
        try:
            exercise = Exercise.objects.create(**validated_data)
            if coaches_data is not None:
                coaches = set(map(lambda c: Coach.objects.get(**c), coaches_data))
                exercise.coaches.set(coaches)
        except IntegrityError:
            raise serializers.ValidationError(self.alredy_exist_messages)
        except Coach.DoesNotExist:
            raise serializers.ValidationError(self.error_coach_messages)
        return exercise

    @transaction.atomic
    def update(self, instance, validated_data):
        coaches_data = validated_data.pop('coaches', None)
        try:
            resp = super().update(instance, validated_data)
            if coaches_data is not None:
                coaches = set(map(lambda c: Coach.objects.get(**c), coaches_data))
                resp.coaches.set(coaches)
        except IntegrityError:
            raise serializers.ValidationError(self.alredy_exist_messages)
        except Coach.DoesNotExist:
            raise serializers.ValidationError(self.error_coach_messages)
        return resp

    class Meta:
        model = Exercise
        fields = '__all__'


class ExerciseSerForSchema(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    name = serializers.CharField(read_only=True)
    video = serializers.CharField(read_only=True)

    class Meta:
        model = Exercise
        fields = ['id', 'name', 'video']


class SuperSeriesListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        super_series_mapping = {super_serie.order: super_serie for super_serie in instance}
        data_mapping = {item['order']: item for item in validated_data}
        existing_super_series_numbers = set(super_series_mapping.keys())

        ret = []
        for super_serie_id, data in data_mapping.items():
            super_serie = super_series_mapping.get(super_serie_id, None)
            if super_serie is not None:
                ret.append(self.child.update(super_serie, data))
            else:
                super_series_serializer = SuperSeriesSerializer(data=data)
                super_series_serializer.is_valid(raise_exception=True)
                ret.append(super_series_serializer.save(exercise=data['exercise']))

        # Eliminazione delle superserie non presenti nei dati validati
        for super_series_id in existing_super_series_numbers:
            if super_series_id not in data_mapping:
                super_series_to_delete = super_series_mapping[super_series_id]
                super_series_to_delete.delete()  # Elimina la superserie dall'istanza
        return ret
    

class SuperSeriesSerializer(serializers.ModelSerializer):
    exe = ExerciseSerForSchema(required=True)

    @transaction.atomic
    def create(self, validated_data):
        try:
            exercise_instance = Exercise.objects.get(id=validated_data.pop('exe')['id'])
        except Exercise.DoesNotExist:
            raise serializers.ValidationError(self.error_exe_messages)
        super_serie = SuperSeries.objects.create(exe=exercise_instance, **validated_data)

        return super_serie

    @transaction.atomic
    def update(self, instance, validated_data):
        try:
            exercise_instance = Exercise.objects.get(id=validated_data.pop('exe')['id'])
        except Exercise.DoesNotExist:
            raise serializers.ValidationError(self.error_exe_messages)
        instance.exe = exercise_instance
        instance.order = validated_data.get('order', instance.order)
        instance.repetitions = validated_data.get('repetitions', instance.repetitions)
        instance.stop = validated_data.get('stop', instance.stop)
        instance.load = validated_data.get('load', instance.load)
        instance.intensity = validated_data.get('intensity', instance.intensity)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        return instance

    class Meta:
        model = SuperSeries
        list_serializer_class = SuperSeriesListSerializer
        fields = ['exe', 'order', 'repetitions', 'stop', 'load', 'intensity', 'description']


class ExerciseInFormListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        exercise_mapping = {exercise.order: exercise for exercise in instance}
        data_mapping = {item['order']: item for item in validated_data}
        existing_exercise_numbers = set(exercise_mapping.keys())

        ret = []
        for exercise_id, data in data_mapping.items():
            exercise = exercise_mapping.get(exercise_id, None)
            if exercise is not None:
                ret.append(self.child.update(exercise, data))
            else:
                excercise_serializer = ExerciseInFormSerializer(data=data)
                excercise_serializer.is_valid(raise_exception=True)
                ret.append(excercise_serializer.save(section=data['section']))

        # Eliminazione degli esercizi non presenti nei dati validati
        for exercise_id in existing_exercise_numbers:
            if exercise_id not in data_mapping:
                exercise_to_delete = exercise_mapping[exercise_id]
                exercise_to_delete.delete()  # Elimina gli esercizi dall'istanza
        return ret


class ExerciseInFormSerializer(serializers.ModelSerializer):
    exe = ExerciseSerForSchema(required=False)
    super_series = SuperSeriesSerializer(many=True, required=False)

    error_exe_messages = {'detail': 'Uno degli esercizi non è presente nel database'}
    error_exe_assente = {'detail': 'Uno tra esecizio e superserie deve essere selezionato'}

    @transaction.atomic
    def create(self, validated_data):
        global exercise
        super_series_data = validated_data.pop('super_series', None)
        exercise_id_instance = validated_data.pop('exe', None)

        if super_series_data is None and exercise_id_instance is None:
            raise serializers.ValidationError(self.error_exe_assente)
        elif exercise_id_instance is not None:
            try:
                exercise_instance = Exercise.objects.get(id=exercise_id_instance['id'])
            except Exercise.DoesNotExist:
                raise serializers.ValidationError(self.error_exe_messages)
            exercise = ExerciseInForm.objects.create(exe=exercise_instance, **validated_data)

        elif super_series_data is not None:
            exercise = ExerciseInForm.objects.create(**validated_data)
            super_series_serializer = SuperSeriesSerializer(data=super_series_data, many=True)
            super_series_serializer.is_valid(raise_exception=True)
            super_series_serializer.save(exercise=exercise)
        return exercise

    @transaction.atomic
    def update(self, instance, validated_data):
        try:
            if 'exe' in validated_data:
                exercise_instance = Exercise.objects.get(id=validated_data.pop('exe')['id'])
                instance.exe = exercise_instance
        except Exercise.DoesNotExist:
            raise serializers.ValidationError(self.error_exe_messages)
        instance.order = validated_data.get('order', instance.order)
        instance.repetitions = validated_data.get('repetitions', instance.repetitions)
        instance.series = validated_data.get('series', instance.series)
        instance.stop = validated_data.get('stop', instance.stop)
        instance.load = validated_data.get('load', instance.load)
        instance.intensity = validated_data.get('intensity', instance.intensity)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        super_series_data = validated_data.get('super_series', None)
        if super_series_data is not None:
            super_series_serializer = SuperSeriesSerializer(instance.super_series.all(), data=super_series_data, many=True)
            super_series_serializer.is_valid(raise_exception=True)
            super_series_serializer.save(exercise=instance)

        return instance

    class Meta:
        model = ExerciseInForm
        list_serializer_class = ExerciseInFormListSerializer
        fields = ['exe', 'order', 'repetitions', 'series', 'stop', 'load', 'intensity', 'description', 'super_series']


class SectionListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        section_mapping = {section.order: section for section in instance}
        data_mapping = {item['order']: item for item in validated_data}
        existing_section_numbers = set(section_mapping.keys())

        ret = []
        for section_id, data in data_mapping.items():
            section = section_mapping.get(section_id, None)
            if section is not None:
                ret.append(self.child.update(section, data))
            else:
                section_serializer = SectionSerializer(data=data)
                section_serializer.is_valid(raise_exception=True)
                ret.append(section_serializer.save(day=data['section']))

        # Eliminazione delle settimane non presenti nei dati validati
        for section_id in existing_section_numbers:
            if section_id not in data_mapping:
                section_to_delete = section_mapping[section_id]
                section_to_delete.delete()  # Elimina il giorno dall'istanza
        return ret


class SectionSerializer(serializers.ModelSerializer):
    exercises = ExerciseInFormSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises', None)
        section = Section.objects.create(**validated_data)
        if exercises_data is not None:
            exercises_serializer = ExerciseInFormSerializer(data=exercises_data, many=True)
            exercises_serializer.is_valid(raise_exception=True)
            exercises_serializer.save(section=section)
        return section

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.order = validated_data.get('order', instance.order)
        instance.save()

        exercises_data = validated_data.get('exercises', None)
        exercises_serializer = ExerciseInFormSerializer(instance.exercises.all(), data=exercises_data, many=True)
        exercises_serializer.is_valid(raise_exception=True)
        exercises_serializer.save(section=instance)

        return instance

    class Meta:
        model = Section
        list_serializer_class = SectionListSerializer
        fields = ['name', 'order', 'exercises']


class DayListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        day_mapping = {day.number: day for day in instance}
        data_mapping = {item['number']: item for item in validated_data}
        existing_day_numbers = set(day_mapping.keys())

        ret = []
        for day_id, data in data_mapping.items():
            day = day_mapping.get(day_id, None)
            if day is not None:
                ret.append(self.child.update(day, data))
            else:
                day_serializer = DaySerializer(data=data)
                day_serializer.is_valid(raise_exception=True)
                ret.append(day_serializer.save(week=data['day']))

        # Eliminazione delle settimane non presenti nei dati validati
        for day_id in existing_day_numbers:
            if day_id not in data_mapping:
                day_to_delete = day_mapping[day_id]
                day_to_delete.delete()  # Elimina il giorno dall'istanza
        
        return ret


class DaySerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        sections_data = validated_data.pop('sections', None)
        day = Day.objects.create(**validated_data)
        if sections_data is not None:
            sections_serializer = SectionSerializer(data=sections_data, many=True)
            sections_serializer.is_valid(raise_exception=True)
            sections_serializer.save(day=day)
        return day

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.number = validated_data.get('number', instance.number)
        instance.save()

        sections_data = validated_data.get('sections', None)
        sections_serializer = SectionSerializer(instance.sections.all(), data=sections_data, many=True)
        sections_serializer.is_valid(raise_exception=True)
        sections_serializer.save(section=instance)

        return instance

    class Meta:
        model = Day
        list_serializer_class = DayListSerializer
        fields = ['name', 'number', 'sections']


class WeekListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        week_mapping = {week.number: week for week in instance}
        data_mapping = {item['number']: item for item in validated_data}
        existing_week_numbers = set(week_mapping.keys())

        ret = []
        for week_id, data in data_mapping.items():
            week = week_mapping.get(week_id, None)
            if week is not None:
                ret.append(self.child.update(week, data))
            else:
                week_serializer = WeekSerializer(data=data)
                week_serializer.is_valid(raise_exception=True)
                ret.append(week_serializer.save(formSP=data['formSP']))

        # Eliminazione delle settimane non presenti nei dati validati
        for week_id in existing_week_numbers:
            if week_id not in data_mapping:
                week_to_delete = week_mapping[week_id]
                week_to_delete.delete()  # Elimina la settimana dall'istanza
        return ret

class WeekSerializer(serializers.ModelSerializer):
    days = DaySerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        days_data = validated_data.pop('days', None)
        week = Week.objects.create(**validated_data)
        if days_data is not None:
            days_serializer = DaySerializer(data=days_data, many=True)
            days_serializer.is_valid(raise_exception=True)
            days_serializer.save(week=week)
        return week

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.number = validated_data.get('number', instance.number)
        instance.save()

        days_data = validated_data.get('days', None)
        days_serializer = DaySerializer(instance.days.all(), data=days_data, many=True)
        days_serializer.is_valid(raise_exception=True)
        days_serializer.save(day=instance)

        return instance

    class Meta:
        model = Week
        list_serializer_class = WeekListSerializer
        fields = ['name', 'number', 'days']


class SchedaSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    level = serializers.CharField(required=True)
    gender = serializers.CharField(required=True)


class FormSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    scheda_tutorial = SchedaSerializer(required=True)
    weeks = WeekSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        weeks_data = validated_data.pop('weeks', None)
        scheda_tutorial_data = validated_data.pop('scheda_tutorial', None)
        validated_data['scheda_tutorial'] = LevelCourse.objects.get(course__title=scheda_tutorial_data["title"],
                                            level=scheda_tutorial_data["level"],
                                            gender=scheda_tutorial_data["gender"])
        form = FormST.objects.create(**validated_data)
        if weeks_data is not None:
            weeks_serializer = WeekSerializer(data=weeks_data, many=True)
            weeks_serializer.is_valid(raise_exception=True)
            weeks_serializer.save(formST=form)
        return form

    @transaction.atomic
    def update(self, instance, validated_data):
        weeks_data = validated_data.get('weeks', None)
        weeks_serializer = WeekSerializer(instance.weeks.all(), data=weeks_data, many=True)
        weeks_serializer.is_valid(raise_exception=True)
        weeks_serializer.save(formST=instance)

        return instance

    class Meta:
        model = FormST
        fields = ['id', 'scheda_tutorial', 'weeks']


class FormLevelSerializer(serializers.ModelSerializer):
    weeks = WeekSerializer(many=True, required=False)

    class Meta:
        model = FormST
        fields = ['weeks']


class LevelCourseBoughtSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    form = FormLevelSerializer()

    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'video', 'coaches', 'form']


class FormLevelCoachSerializer(serializers.ModelSerializer):
    weeks = WeekSerializer(many=True, required=False)

    class Meta:
        model = FormST
        fields = ['id', 'weeks']


class LevelCourseCoachSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    form = FormLevelCoachSerializer()

    class Meta:
        model = LevelCourse
        fields = ['level', 'gender', 'requirements', 'goals', 'goals_video', 'frequency', 'duration',
                  'required_items', 'requirements_video', 'description', 'price', 'video', 'coaches', 'form']


class ListSurveySerializer(serializers.Serializer):
    question = serializers.CharField(required=True)
    answer = serializers.CharField(required=True)

    class Meta:
        fields = ['question', 'answer']

class SurveySerializer(serializers.Serializer):
    survey = ListSurveySerializer(many=True, required=False)

    class Meta:
        fields = ['survey']



logger = logging.getLogger(__name__)

class FormPersSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField()
    user_email = serializers.EmailField(required=True, write_only=True)
    weeks = WeekSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        weeks_data = validated_data.pop('weeks', None)
        user_email_data = validated_data.pop('user_email', None)
        validated_data['user'] = User.objects.get(email=user_email_data)
        form = FormSP.objects.create(**validated_data)
        if weeks_data is not None:
            weeks_serializer = WeekSerializer(data=weeks_data, many=True)
            weeks_serializer.is_valid(raise_exception=True)
            weeks_serializer.save(formSP=form)
        return form


    @transaction.atomic
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        weeks_data = validated_data.get('weeks', None)
        weeks_serializer = WeekSerializer(instance.weeks.all(), data=weeks_data, many=True)
        weeks_serializer.is_valid(raise_exception=True)
        weeks_serializer.save(formSP=instance)

        return instance

    class Meta:
        model = FormSP
        fields = ['id', 'name', 'user_email', 'weeks']


class PersFormSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(read_only=True)
    weeks = WeekSerializer(read_only=True, many=True)

    class Meta:
        model = FormSP
        fields = ['id', 'name', 'weeks']


class PersFormAllSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(read_only=True)
    update_at = serializers.DateTimeField(read_only=True)
    published = serializers.BooleanField(read_only=True)

    class Meta:
        model = FormSP
        fields = ['id', 'name', 'update_at', 'published']

class RecivedFeedbackSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)   
    critici = serializers.CharField(required=True)
    forti = serializers.CharField(required=False)
    ese_differenti = serializers.CharField(required=True)
    tempistiche_ok = serializers.CharField(required=True)
    altro = serializers.CharField(required=True)

    class Meta:
        fields = ['token', 'critici', 'forti', 'ese_differenti', 'tempistiche_ok', 'altro']


class ConsigliSerializer(serializers.Serializer):
    name = serializers.CharField(write_only=True, required=True)
    email_from = serializers.EmailField(write_only=True, required=True)
    text = serializers.CharField(write_only=True, required=True)
    success = serializers.CharField(read_only=True)

    class Meta:
        fields = ['name', 'email_from', 'text']

class ChooseCoachSerializer(serializers.Serializer):
    coach_email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        fields = ['coach_email']


class ChooseNutritionistSerializer(serializers.Serializer):
    name = serializers.CharField(write_only=True, required=True)
    nutritionist_email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        fields = ['name', 'nutritionist_email']
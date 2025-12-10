from drf_yasg.utils import swagger_auto_schema
from django.db import transaction

from rest_framework import generics, status, permissions
from rest_framework.response import Response

from ..models.models_tutorial import Course, LevelCourse, Discipline, FormST
from ..renderers import ViewRenderer
from ..serializers import DisciplineSerializer, CoursesSerializer, CourseSerializer, CourseInsertSerializer, \
    CourseInternalInsertSerializer, LevelCourseInsertSerializer, LevelCourseExternalInsertSerializer, \
    CourseUpdateSerializer, LevelCourseInternalInsertSerializer, LevelCourseRemoveCoach, \
    LevelCourseExternalUpdateSerializer, LevelCourseDelSer, LevelCourseBoughtSerializer, FormSerializer, \
    LevelCourseCoachSerializer
from coach.models import Coach
from ..permission_custom import StaffAllButEditOrReadOnly


class DisciplineView(generics.ListCreateAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    renderer_classes = (ViewRenderer,)


class DisciplineDestroyView(generics.DestroyAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    renderer_classes = (ViewRenderer,)
    lookup_field = 'name'


class CoursesView(generics.GenericAPIView):
    serializer_class = CoursesSerializer
    renderer_classes = (ViewRenderer,)

    @staticmethod
    @swagger_auto_schema(tags=['courses'])
    def get(request, discipline):
        if discipline != 'all':
            courses = Course.objects.filter(discipline__name=discipline).distinct()
        else:
            courses = Course.objects.all()

        for course in courses:
            course.coaches = Coach.objects.filter(level_course__course__id=course.id).distinct()

        serializer = CoursesSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseView(generics.RetrieveDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    renderer_classes = (ViewRenderer,)
    lookup_field = 'title'


class CourseInsertView(generics.GenericAPIView):
    serializer_class = CourseInsertSerializer
    renderer_classes = (ViewRenderer,)

    @staticmethod
    @transaction.atomic
    def post(request):
        try:
            id_discipline = Discipline.objects.get(name=request.data["discipline"]).id
        except Discipline.DoesNotExist:
            return Response({'error': 'Disciplina non presente'}, status=status.HTTP_400_BAD_REQUEST)

        request.data["discipline"] = int(id_discipline)
        serializer_course = CourseInternalInsertSerializer(data=request.data)

        if serializer_course.is_valid(raise_exception=True):
            serializer_course.save()

        course = Course.objects.get(title=request.data["title"])
        for level in request.data["levels"]:
            level["course"] = int(course.id)
            serializer_level = LevelCourseInternalInsertSerializer(data=level)
            if serializer_level.is_valid(raise_exception=True):
                serializer_level.save()
            for coach in level["coaches"]:
                try:
                    coach_obj = Coach.objects.get(email=coach['email'])
                    level_obj = LevelCourse.objects.get(level=level["level"], gender=level["gender"],
                                                        course=course)
                    coach_obj.level_course.add(level_obj)
                except Coach.DoesNotExist:
                    print("Coach non presente")

            level.pop('course', None)
        request.data.pop('discipline', None)

        return Response(request.data, status=status.HTTP_201_CREATED)


class CourseUpdateView(generics.GenericAPIView):
    serializer_class = CourseUpdateSerializer
    renderer_classes = (ViewRenderer,)

    @staticmethod
    def put(request, title):
        try:
            id_discipline = Discipline.objects.get(name=request.data["discipline"]).id
            course = Course.objects.get(title=title)
        except Discipline.DoesNotExist:
            return Response({'error': 'Disciplina non presente'}, status=status.HTTP_400_BAD_REQUEST)
        except Course.DoesNotExist:
            return Response({'error': 'Corso non presente'}, status=status.HTTP_404_NOT_FOUND)

        request.data["title"] = title
        request.data["discipline"] = int(id_discipline)

        serializer_course = CourseInternalInsertSerializer(course, data=request.data)

        if serializer_course.is_valid(raise_exception=True):
            serializer_course.save()
        request.data.pop('discipline', None)
        return Response(request.data, status=status.HTTP_201_CREATED)


class CourseInsertCoachView(generics.GenericAPIView):
    serializer_class = LevelCourseRemoveCoach
    renderer_classes = (ViewRenderer,)

    @staticmethod
    def post(request):
        try:
            level_obj = LevelCourse.objects.get(level=request.data["level"], gender=request.data["gender"],
                                                course__title=request.data["title_course"])
            coach_obj = Coach.objects.get(email=request.data['coach']['email'])

            coach_obj.level_course.add(level_obj)
        except (Coach.DoesNotExist, LevelCourse.DoesNotExist) as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)

        return Response(request.data, status=status.HTTP_201_CREATED)


class CourseRemoveCoachView(generics.GenericAPIView):
    serializer_class = LevelCourseRemoveCoach
    renderer_classes = (ViewRenderer,)

    @staticmethod
    @swagger_auto_schema(request_body=LevelCourseRemoveCoach)
    def delete(request):
        try:
            course = Course.objects.get(title=request.data["title_course"])
            level_obj = LevelCourse.objects.get(level=request.data["level"], gender=request.data["gender"],
                                                course=course)
            coach_obj = Coach.objects.get(email=request.data['coach']['email'])
            coach_obj.level_course.remove(level_obj)
        except Course.DoesNotExist or LevelCourse.DoesNotExist:
            return Response({'error': 'Corso non presente'}, status=status.HTTP_404_NOT_FOUND)
        except Coach.DoesNotExist:
            return Response({'error': 'Coach non presente'}, status=status.HTTP_404_NOT_FOUND)

        return Response(request.data, status=status.HTTP_204_NO_CONTENT)


class LevelCourseInsertView(generics.GenericAPIView):
    serializer_class = LevelCourseExternalInsertSerializer
    renderer_classes = (ViewRenderer,)

    @staticmethod
    def post(request):
        try:
            course = Course.objects.get(title=request.data["title_course"])
        except Course.DoesNotExist:
            return Response({'error': 'Corso non presente'}, status=status.HTTP_400_BAD_REQUEST)

        request.data["course"] = int(course.id)
        serializer_level = LevelCourseInternalInsertSerializer(data=request.data)
        if serializer_level.is_valid(raise_exception=True):
            serializer_level.save()
        for coach in request.data["coaches"]:
            try:
                coach_obj = Coach.objects.get(email=coach['email'])
                level_obj = LevelCourse.objects.get(level=request.data["level"], gender=request.data["gender"],
                                                    course=course)
                coach_obj.level_course.add(level_obj)
            except Coach.DoesNotExist:
                print("Coach non presente")

        request.data.pop('course', None)
        return Response(request.data, status=status.HTTP_201_CREATED)


class LevelCourseUpdateView(generics.GenericAPIView):
    serializer_class = LevelCourseExternalUpdateSerializer
    renderer_classes = (ViewRenderer,)

    @staticmethod
    def put(request):
        try:
            course = Course.objects.get(title=request.data["title_course"])
            level = LevelCourse.objects.get(level=request.data["level"], gender=request.data["gender"], course=course)
        except Course.DoesNotExist:
            return Response({'error': 'Corso non presente'}, status=status.HTTP_400_BAD_REQUEST)
        except LevelCourse.DoesNotExist:
            return Response({'error': 'Livello del corso non presente'}, status=status.HTTP_404_NOT_FOUND)

        request.data["course"] = course.id

        serializer_level = LevelCourseInsertSerializer(level, data=request.data)
        if serializer_level.is_valid(raise_exception=True):
            serializer_level.save()
        request.data.pop('course', None)
        return Response(request.data, status=status.HTTP_200_OK)


class LevelCourseDeleteView(generics.GenericAPIView):
    serializer_class = LevelCourseDelSer
    renderer_classes = (ViewRenderer,)

    @staticmethod
    @transaction.atomic
    @swagger_auto_schema(request_body=LevelCourseDelSer)
    def delete(request):
        try:
            level = LevelCourse.objects.get(level=request.data["level"], gender=request.data["gender"],
                                            course__title=request.data["title_course"])
        except LevelCourse.DoesNotExist as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)

        course = level.course
        level.delete()

        if not LevelCourse.objects.filter(course=course).count():
            print("Elimino il corso essendo privo di livelli")
            course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyLevelsView(generics.GenericAPIView):
    serializer_class = CourseSerializer
    pagination_class = None
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    @staticmethod
    def get(request):
        # Recupero tutti gli id dei livelli acquistati in base all'utente e tutti i corsi
        level_ids = [record['id'] for record in LevelCourse.objects.filter(users__user__id=request.user.id).values()]
        courses = Course.objects.filter(levels__id__in=level_ids).distinct()

        # Rimuovo tutti i livelli che non sono nella lista di quelli acquistati
        serializer = CourseSerializer(courses, many=True)
        data = serializer.data
        for item in data:
            item['levels'] = [level for level in item['levels'] ]

        return Response(data, status=status.HTTP_200_OK)


class MyLevelsFormView(generics.GenericAPIView):
    serializer_class = LevelCourseBoughtSerializer
    pagination_class = None
    renderer_classes = (ViewRenderer,)
    permission_classes = (permissions.IsAuthenticated,)


    @staticmethod
    def get(request, id_level):
        level = LevelCourse.objects.get(users__user__id=request.user.id, id=id_level)
        serializer = LevelCourseBoughtSerializer(level)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyLevelsCoachFormView(generics.GenericAPIView):
    serializer_class = LevelCourseCoachSerializer
    pagination_class = None
    renderer_classes = (ViewRenderer,)
    permission_classes = (StaffAllButEditOrReadOnly, )


    @staticmethod
    def get(request, id_level):
        level = LevelCourse.objects.get(id=id_level)
        serializer = LevelCourseCoachSerializer(level)
        return Response(serializer.data, status=status.HTTP_200_OK)



class FormInsertView(generics.CreateAPIView):
    serializer_class = FormSerializer
    pagination_class = None
    queryset = FormST.objects.all()
    renderer_classes = (ViewRenderer,)


class FormView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormST.objects.all()
    serializer_class = FormSerializer
    renderer_classes = (ViewRenderer,)
    pagination_class = None
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
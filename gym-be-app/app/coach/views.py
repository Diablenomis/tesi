import logging

from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status
from rest_framework.response import Response

from .models import Coach
from .serializers import CoachSer, CoachGetSer, CoachExternalSer, BoughtPersonalSer
from .renderers import ViewRenderer
from scheda_tutorial.models.models_tutorial import Discipline

from authentication.models import User
from scheda_tutorial.permission_custom import StaffAllButEditOrReadOnly


# Create your views here.
logger = logging.getLogger(__name__)

class CoachView(generics.ListAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachGetSer
    renderer_classes = (ViewRenderer,)

    def get(self, request):
        queryset = Coach.objects.all()
        serializer = CoachGetSer(queryset, many=True)
        # Per ogni coach calcolo il numero di studenti e lo inserisco nel campo number_students
        for coach in serializer.data:
            coach['number_students'] = User.objects.filter(coach_email=coach['email']).count()
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class CoachInfoView(generics.GenericAPIView):
    serializer_class = CoachGetSer
    renderer_classes = (ViewRenderer,)

    def get_object(self, email):
        return Coach.objects.get(email=email)

    def get(self, request, email):
        try:
            serializer = CoachGetSer(self.get_object(email=email), many=False)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Coach.DoesNotExist:
            return Response({'error': 'Coach non presente'}, status=status.HTTP_404_NOT_FOUND)


class CoachInsertView(generics.GenericAPIView):
    serializer_class = CoachExternalSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (StaffAllButEditOrReadOnly, )

    @staticmethod
    def post(request):
        try:
            id_discipline = Discipline.objects.get(name=request.data["top_discipline_name"]).id
        except Discipline.DoesNotExist:
            return Response({'error': 'Disciplina non presente'}, status=status.HTTP_400_BAD_REQUEST)

        request.data["top_discipline"] = int(id_discipline)
        serializer = CoachSer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
        request.data.pop('top_discipline', None)
        return Response(request.data, status=status.HTTP_201_CREATED)


class CoachUpdateView(generics.GenericAPIView):
    serializer_class = CoachExternalSer
    renderer_classes = (ViewRenderer,)
    permission_classes = (StaffAllButEditOrReadOnly, )

    @staticmethod
    def put(request, email):

        try:
            id_discipline = Discipline.objects.get(name=request.data["top_discipline_name"]).id
            coach = Coach.objects.get(email=email)
        except Discipline.DoesNotExist:
            return Response({'error': 'Disciplina non presente'}, status=status.HTTP_400_BAD_REQUEST)
        except Coach.DoesNotExist:
            return Response({'error': 'Coach non presente'}, status=status.HTTP_404_NOT_FOUND)

        request.data["email"] = email
        request.data["top_discipline"] = int(id_discipline)

        serializer_course = CoachSer(coach, data=request.data)

        if serializer_course.is_valid(raise_exception=True):
            serializer_course.save()
        request.data.pop('email', None)
        request.data.pop('top_discipline', None)
        return Response(request.data, status=status.HTTP_201_CREATED)


class CoachDeleteView(generics.GenericAPIView):
    renderer_classes = (ViewRenderer,)
    permission_classes = (StaffAllButEditOrReadOnly, )

    @staticmethod
    def delete(request, email):
        try:
            coach = Coach.objects.get(email=email)
        except Coach.DoesNotExist:
            return Response({'error': 'Coach non presente'}, status=status.HTTP_404_NOT_FOUND)

        coach.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CoachListEmailPersonalView(generics.GenericAPIView):
    serializer_class = BoughtPersonalSer
    renderer_classes = (ViewRenderer,)
    pagination_class = None
    permission_classes = (StaffAllButEditOrReadOnly, )

    def get(self, request):
        users = User.objects.all()
        serializer = BoughtPersonalSer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

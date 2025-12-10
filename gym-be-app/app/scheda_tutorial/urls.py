from django.urls import path

from .views.view_tutorial import DisciplineView, DisciplineDestroyView, CoursesView, CourseView, CourseInsertView,\
    LevelCourseInsertView, LevelCourseUpdateView, CourseUpdateView, CourseRemoveCoachView, CourseInsertCoachView, \
    LevelCourseDeleteView, MyLevelsView, MyLevelsFormView, FormView, FormInsertView, MyLevelsCoachFormView

from .views.view_general import ExerciseView,  EsercizioOperationsView, HelpView

from .views.view_personal import CoachingOnlineView, NutrizionistView, SchedaPersFeedback, SurveyView, SchedaPersView, MyPersFormView, SchedaPersPublish, PersFormAllView, \
    SchedaPersDetView


urlpatterns = [
    path('generic/help-email/', HelpView.as_view(), name="help_view"),

    path('tutorial/discipline/', DisciplineView.as_view(), name="discipline_view"),
    path('tutorial/discipline/<name>/', DisciplineDestroyView.as_view(), name="discipline-destroy-view"),
    path('tutorial/courses/<discipline>/', CoursesView.as_view(), name="courses-view"),
    path('tutorial/course/<title>/', CourseView.as_view(), name="course-view"),
    path('tutorial/course-insert/', CourseInsertView.as_view(), name="course-insert-view"),
    path('tutorial/course-update/<title>/', CourseUpdateView.as_view()),
    path('tutorial/course-insert-coach/', CourseInsertCoachView.as_view()),
    path('tutorial/course-remove-coach/', CourseRemoveCoachView.as_view()),
    path('tutorial/course/level/insert/', LevelCourseInsertView.as_view(), name="course-level-insert-view"),
    path('tutorial/course/level/update/', LevelCourseUpdateView.as_view(), name="course-level-update-view"),
    path('tutorial/course/level/delete/', LevelCourseDeleteView.as_view(), name="course-level-delete-view"),

    path('tutorial/form/', FormInsertView.as_view(), name="form-insert-view"),
    path('tutorial/form/<str:id>/', FormView.as_view(), name="form-view"),


    path('tutorial/my-courses/', MyLevelsView.as_view(), name="my-courses-view"),
    path('tutorial/my-courses/<id_level>/', MyLevelsFormView.as_view(), name="my-courses-form-view"),

    path('tutorial/form/coach/<id_level>/', MyLevelsCoachFormView.as_view(), name="my-courses-coach-form-view"),

    path('exercise/', ExerciseView.as_view(), name="exercise-view"),
    path('exercise/<id>/', EsercizioOperationsView.as_view(), name="exercise-update-delete"),

    path('survey/send/', SurveyView.as_view(), name="survey-view"),

    path('personal/form/', SchedaPersView.as_view(), name="personal-form-insert-view"),
    path('personal/form/<id>/', SchedaPersDetView.as_view(), name="personal-form-details-view"),
    path('personal/all-forms/', PersFormAllView.as_view(), name="personal-form-list-view"),
    path('personal/form/publish/<id_form>/', SchedaPersPublish.as_view(), name="personal-form-publish-view"),
    path('personal/my-course/', MyPersFormView.as_view(), name="my-personal-form-view"),
    path('personal/feedback/', SchedaPersFeedback.as_view(), name="feedback-view"),

    path('coaching-online/choise-coach/', CoachingOnlineView.as_view(), name="coaching-view"),
    path('nutrizionist/choise-nutrizionist/', NutrizionistView.as_view(), name="nutrizionist-view"),

]
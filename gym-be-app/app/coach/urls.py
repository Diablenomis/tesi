from django.urls import path

from .views import CoachView, CoachInfoView, CoachInsertView, CoachUpdateView, CoachDeleteView, CoachListEmailPersonalView

urlpatterns = [
    path('', CoachView.as_view(), name="coach-view"),
    path('info/<email>/', CoachInfoView.as_view(), name="coach-info-view"),
    path('insert/', CoachInsertView.as_view(), name="coach-insert-view"),
    path('update/<email>/', CoachUpdateView.as_view(), name="coach-update-view"),
    path('delete/<email>/', CoachDeleteView.as_view(), name="coach-update-view"),
    path('list/email/bought/pers/', CoachListEmailPersonalView.as_view(), name="email-list-view"),
]

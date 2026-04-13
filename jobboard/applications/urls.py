from django.urls import path
from .views import (
    ApplyJobView,
    MyApplicationsView,
    JobApplicantsView,
    UpdateApplicationStatusView
)

urlpatterns = [
    path('apply/<int:job_id>/', ApplyJobView.as_view()),
    path('mine/', MyApplicationsView.as_view()),
    path('job/<int:job_id>/applicants/', JobApplicantsView.as_view()),
    path('<int:pk>/status/', UpdateApplicationStatusView.as_view()),
]
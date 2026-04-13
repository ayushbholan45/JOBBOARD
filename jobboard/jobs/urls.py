from django.urls import path
from .views import JobListView, JobDetailView, MyJobsView, CategoryListView

urlpatterns = [
    path('', JobListView.as_view()),
    path('<int:pk>/', JobDetailView.as_view()),
    path('mine/', MyJobsView.as_view()),
    path('categories/', CategoryListView.as_view()),
]
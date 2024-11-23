from django.urls import path
from .views import (
    CategoryListView,
    QuestionListView,
    AutoAssessmentView,
    AssessmentCreateView,
    AssessmentListView,
    ResponseBulkCreateView,
    AssessmentUpdateView,
)

app_name = 'special_education'

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('auto-assessment/', AutoAssessmentView.as_view(), name='auto-assessment'),
    path('assessments/create/', AssessmentCreateView.as_view(), name='assessment-create'),
    path('assessments/<int:pk>/', AssessmentUpdateView.as_view(), name='assessment-update'),
    path('assessments/', AssessmentListView.as_view(), name='assessment-list'),
    path('responses/bulk_create/', ResponseBulkCreateView.as_view(), name='response-bulk-create'),
]

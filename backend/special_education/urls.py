from django.urls import path
from .views import (
    CategoryListView,
    QuestionListView,
    RandomQuestionsView,
    AssessmentCreateView,
    AssessmentListView,
    ResponseBulkCreateView,
    AssessmentUpdateView,
)

app_name = 'special_education'

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/random/', RandomQuestionsView.as_view(), name='random-questions'),
    path('assessments/', AssessmentCreateView.as_view(), name='assessment-create'),
    path('assessments/<int:pk>/', AssessmentUpdateView.as_view(), name='assessment-update'),
    path('assessments/list/', AssessmentListView.as_view(), name='assessment-list'),
    path('responses/bulk_create/', ResponseBulkCreateView.as_view(), name='response-bulk-create'),
]

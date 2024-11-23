from django.urls import path
from .views import (
    CategoryListView,
    QuestionListView,
    AutoAssessmentView,
    AssessmentCreateView,
    AssessmentListView,
    AssessmentUpdateView,
    ResponseBulkCreateView,
    AssessmentDeleteView,
    AssessmentDetailView,
    AssessmentAnalysisView,
    RandomQuestionView
)

app_name = 'special_education'

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/random/', RandomQuestionView.as_view(), name='random-questions'),
    path('auto-assessment/', AutoAssessmentView.as_view(), name='auto-assessment'),
    path('assessments/', AssessmentListView.as_view(), name='assessment-list'),
    path('assessments/create/', AssessmentCreateView.as_view(), name='assessment-create'),
    path('assessments/<int:pk>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    path('assessments/<int:pk>/update/', AssessmentUpdateView.as_view(), name='assessment-update'),
    path('assessments/<int:pk>/delete/', AssessmentDeleteView.as_view(), name='assessment-delete'),
    path('assessments/analysis/<int:student_id>/', AssessmentAnalysisView.as_view(), name='assessment-analysis'),
    path('responses/bulk-create/', ResponseBulkCreateView.as_view(), name='response-bulk-create'),
]

from django.contrib import admin
from .models import AssessmentCategory, Question, StudentAssessment, AssessmentResponse

@admin.register(AssessmentCategory)
class AssessmentCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title', 'description')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'category', 'question_category', 'created_at')
    list_filter = ('category', 'question_category')
    search_fields = ('question_text',)

@admin.register(StudentAssessment)
class StudentAssessmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'category', 'assessor', 'date', 'completed')
    list_filter = ('completed', 'category')
    search_fields = ('student__student_info__user__first_name', 'student__student_info__user__last_name')

@admin.register(AssessmentResponse)
class AssessmentResponseAdmin(admin.ModelAdmin):
    list_display = ('assessment', 'question', 'response', 'created_at')
    list_filter = ('response', 'assessment__category')

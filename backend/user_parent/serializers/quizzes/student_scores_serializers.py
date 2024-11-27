from rest_framework import serializers
from user_teacher.models.quizzes_models import QuizScore, Quiz
from user_admin.models.account_models import StudentInfo, ParentInfo

class StudentQuizScoreSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title')
    classroom_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = QuizScore
        fields = [
            'id',
            'quiz_title',
            'classroom_name',
            'student_name',
            'status',
            'total_score',
            'total_possible',
            'percentage_score',
            'created_at'
        ]
    
    def get_classroom_name(self, obj):
        classroom = obj.classroom
        return f"Grade {classroom.grade_level} - {classroom.subject_name}"
    
    def get_student_name(self, obj):
        student = obj.student.student_info.user
        return f"{student.first_name} {student.last_name}"

class ParentStudentScoresSerializer(serializers.ModelSerializer):
    student_scores = serializers.SerializerMethodField()
    
    class Meta:
        model = ParentInfo
        fields = ['student_scores']
    
    def get_student_scores(self, obj):
        # Get all students linked to this parent
        students = obj.student_info.all()
        
        # Get all scores for these students
        all_scores = []
        for student in students:
            scores = QuizScore.objects.filter(
                student=student
            ).select_related(
                'quiz',
                'classroom',
                'student__student_info__user'
            ).order_by('-created_at')
            
            serialized_scores = StudentQuizScoreSerializer(scores, many=True).data
            all_scores.extend(serialized_scores)
            
        return all_scores
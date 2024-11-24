from django.db import transaction
from rest_framework import serializers
from ...models.quizzes_models import *
from user_admin.models.account_models import *

class QuizResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentResponse
        fields = ['quiz', 'responses', 'classroom']
        
    def validate_responses(self, responses):
        """
        Validate response format for each question type
        """
        quiz = self.context['quiz']
        for question_id, answer in responses.items():
            try:
                question = quiz.questions.get(id=question_id)
                self._validate_answer_format(question, answer)
            except Question.DoesNotExist:
                raise serializers.ValidationError(f"Question {question_id} does not exist in this quiz")
        return responses
    
    def _validate_answer_format(self, question, answer):
        """
        Validate answer format based on question type
        """
        if question.question_type == 'single':
            if not isinstance(answer, (int, str)):
                raise serializers.ValidationError(f"Single choice answer must be a single value")
        elif question.question_type == 'multi':
            if not isinstance(answer, list):
                raise serializers.ValidationError(f"Multiple choice answer must be a list")
        elif question.question_type == 'identification':
            if not isinstance(answer, str):
                raise serializers.ValidationError(f"Identification answer must be text")

    @transaction.atomic
    def create(self, validated_data):
        # Get the student from the context
        user = self.context['request'].user
        try:
            # Get the StudentInfo instance
            student = StudentInfo.objects.get(student_info=user.user_info)
        except (AttributeError, StudentInfo.DoesNotExist):
            raise serializers.ValidationError("User is not a student")
        
        # Create the student response
        student_response = StudentResponse.objects.create(
            student=student,
            **validated_data
        )
        
        # Calculate scores
        self._calculate_and_create_score(student_response)
        
        return student_response
    
    def _calculate_and_create_score(self, student_response):
        """Calculate quiz score and create QuizScore instance"""
        total_possible = student_response.quiz.questions.count()
        correct_count = 0
        
        for question_id, answer in student_response.responses.items():
            try:
                question = student_response.quiz.questions.get(id=question_id)
                if self._check_answer(question, answer):
                    correct_count += 1
            except Question.DoesNotExist:
                continue
        
        percentage = (correct_count / total_possible * 100) if total_possible > 0 else 0
        status = 'passed' if percentage >= 50 else 'failed'
        
        QuizScore.objects.create(
            student=student_response.student,
            quiz=student_response.quiz,
            classroom=student_response.classroom,
            student_response=student_response,
            total_score=correct_count,
            total_possible=total_possible,
            percentage_score=percentage,
            status=status
        )
    
    def _check_answer(self, question, answer):
        """Check if the answer is correct based on question type"""
        if question.question_type == 'single':
            # For single choice, answer should be the ID of the correct choice
            return question.choices.filter(id=answer, is_correct=True).exists()
            
        elif question.question_type == 'multi':
            # For multiple choice, answer should be a list of choice IDs
            correct_choices = set(question.choices.filter(is_correct=True).values_list('id', flat=True))
            return set(map(int, answer)) == correct_choices
            
        elif question.question_type == 'identification':
            # For identification, get the correct answer from the first choice
            correct_choice = question.choices.filter(is_correct=True).first()
            if not correct_choice:
                return False
            correct = correct_choice.text.lower().strip()
            student_answer = str(answer).lower().strip()
            return correct == student_answer
            
        return False

class QuizScoreSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    grade_level = serializers.CharField(source='student.grade_level', read_only=True)
    score_display = serializers.CharField(read_only=True)
    
    class Meta:
        model = QuizScore
        fields = [
            'id', 'student', 'student_name', 'quiz', 'quiz_title', 
            'total_score', 'total_possible', 'percentage_score', 
            'status', 'score_display', 'grade_level', 'created_at'
        ]
        read_only_fields = fields
    
    def get_student_name(self, obj):
        try:
            user = obj.student.student_info.user
            return f"{user.first_name} {user.last_name}"
        except AttributeError:
            return "Unknown Student"
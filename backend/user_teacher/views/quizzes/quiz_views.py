from django.http.response import JsonResponse
from rest_framework import generics, status, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from user_teacher.models.quizzes_models import Quiz
from user_teacher.serializers.quizzes.quiz_serializers import QuizSerializer
from user_teacher.models.classroom_models import Classroom
from user_admin.models.account_models import TeacherInfo

class QuizCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()

    def perform_create(self, serializer):
        classroom_id = self.request.data.get('classroom')
        
        if not classroom_id:
            raise serializers.ValidationError({"classroom": "Classroom ID is required"})
        
        try:
            classroom = Classroom.objects.get(
                id=classroom_id, 
                class_instructor=self.request.user.user_info.teacher_info
            )

            serializer.save(
                classroom=classroom, 
                created_by=self.request.user.user_info.teacher_info
            )

        except Classroom.DoesNotExist:
            raise serializers.ValidationError(
                {"classroom": "You do not have permission to create a quiz for this classroom"}
            )
        
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            self.perform_create(serializer)
                       
            return JsonResponse({
                'message': 'Quiz created successfully',
                'quiz': serializer.data,
                'classroom_id': serializer.data.get('classroom'),
                'created_by': serializer.data.get('created_by_name'),
                'created_at': serializer.data.get('created_at')
            }, status=status.HTTP_201_CREATED)
        
        except serializers.ValidationError as e:
            raise

        except Exception as e:
            return JsonResponse({
                'message': 'An unexpected error occurred',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuizUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()

    def get_queryset(self):
        teacher_info = self.request.user.user_info.teacher_info
        return Quiz.objects.filter(classroom__class_instructor=teacher_info)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            
            # Verify classroom permission
            classroom_id = request.data.get('classroom')
            if classroom_id:
                try:
                    classroom = Classroom.objects.get(
                        id=classroom_id,
                        class_instructor=request.user.user_info.teacher_info
                    )
                    serializer.save(classroom=classroom)
                except Classroom.DoesNotExist:
                    raise serializers.ValidationError(
                        {"classroom": "You do not have permission to update this quiz's classroom"}
                    )
            else:
                serializer.save()
            
            return JsonResponse({
                'message': 'Quiz updated successfully',
                'quiz': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return JsonResponse({
                'message': 'Quiz not found or you do not have permission to update it'
            }, status=status.HTTP_404_NOT_FOUND)
            
        except serializers.ValidationError as e:
            raise
            
        except Exception as e:
            return JsonResponse({
                'message': 'An unexpected error occurred',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuizDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()

    def get_queryset(self):
        teacher_info = self.request.user.user_info.teacher_info
        return Quiz.objects.filter(classroom__class_instructor=teacher_info)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            
            return JsonResponse({
                'message': 'Quiz deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return JsonResponse({
                'message': 'Quiz not found or you do not have permission to delete it'
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return JsonResponse({
                'message': 'An unexpected error occurred',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuizListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer

    def get_queryset(self):
        teacher_info = self.request.user.user_info.teacher_info
        classroom_id = self.request.query_params.get('classroom_id')
        
        queryset = Quiz.objects.filter(classroom__class_instructor=teacher_info)
        
        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
            
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return JsonResponse({
            'message': 'Quizzes retrieved successfully',
            'quizzes': serializer.data
        }, status=status.HTTP_200_OK)

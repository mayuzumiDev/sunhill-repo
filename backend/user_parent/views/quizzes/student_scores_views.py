from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework import status
from user_admin.models.account_models import ParentInfo
from user_parent.serializers.quizzes.student_scores_serializers import ParentStudentScoresSerializer

class ParentStudentScoresView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParentStudentScoresSerializer
    
    def get_queryset(self):
        try:
            return ParentInfo.objects.filter(
                parent_info__user=self.request.user
            ).select_related(
                'parent_info__user'
            )
        except Exception as e:
            return ParentInfo.objects.none()
    
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Parent information not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            parent_info = queryset.first()
            serializer = self.get_serializer(parent_info)
            
            return JsonResponse({
                'status': 'success',
                'message': 'Student scores retrieved successfully',
                'quiz_scores': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
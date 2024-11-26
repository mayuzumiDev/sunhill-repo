from django.http.response import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import generics, status
from user_teacher.serializers.classroom.classroom_list_serializers import *
from user_teacher.models.classroom_models import *
from rest_framework.views import APIView
from django.db.models import Count

class ClassroomListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassroomListSerializer
    # queryset = Classroom.objects.all()

    def get_queryset(self):
        try:
            teacher_info = self.request.user.user_info.teacher_info
            queryset = Classroom.objects.filter(class_instructor=teacher_info)
            
            return queryset
        except Exception as e:
            return Classroom.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        classroom_list = serializer.data

        # # Get classroom statistics
        # total_classrooms = queryset.count()
        # total_students = sum(classroom.enrolled_students.count() for classroom in queryset)
        # # active_classrooms = queryset.filter(is_active=True).count()

        return JsonResponse({
            'message': 'Classroom list retrieved successfully',
            'classroom_list': classroom_list,
            # 'statistics': {
            #     'total_classrooms': total_classrooms,
            #     # 'total_students': total_students,
            #     # 'active_classrooms': active_classrooms
            # }
        }, status=status.HTTP_200_OK)

class ClassroomCountByBranchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, branch_id=None):
        try:
            if branch_id:
                # Get count of classrooms for specific branch
                count = Classroom.objects.filter(branch_id=branch_id).count()
                print(f"Found {count} classrooms for branch {branch_id}")  # Debug print
                return Response({
                    'class_count': count,
                    'branch_id': branch_id
                })
            else:
                return Response({
                    'error': 'Branch ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error in ClassroomCountByBranchView: {str(e)}")  # Debug print
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
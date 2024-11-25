from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from rest_framework.response import Response
from user_teacher.models.classroom_models import EducationMaterial
from user_student.serializers.classroom.student_materials_serializers import StudentEducationMaterialListSerializer

class StudentEducationMaterialListView(generics.ListAPIView):
    serializer_class = StudentEducationMaterialListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroom', None)
        queryset = EducationMaterial.objects.all()
        
        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
            
        return queryset.order_by('-uploaded_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Education materials retrieved successfully',
            'materials_list': serializer.data
        }, status=status.HTTP_200_OK)
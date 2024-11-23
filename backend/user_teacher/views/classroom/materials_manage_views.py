from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from user_teacher.serializers.classroom.materials_manage_serializers import *
from user_teacher.models.classroom_models import *

class EducationMaterialUploadView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EducationMaterialUploadSerializer
    queryset = EducationMaterial.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            education_material = serializer.data

            return Response({
                'status': 'success',
                'message': 'Education material uploaded successfully',
                'education_material': education_material
            }, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'error',
            'message': 'Failed to upload education material',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()


class EducationMaterialEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EducationMaterialsEditSerializer
    queryset = EducationMaterial.objects.all()

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'status': 'success',
            'message': 'Education material updated successfully',
            'material': serializer.data
        })


class EducationMaterialDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EducationMaterialListSerializer
    queryset = EducationMaterial.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.file:
                instance.file.delete(save=False)
            self.perform_destroy(instance)
            
            return Response({
                'status': 'success',
                'message': 'Education material deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': 'Failed to delete education material',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class EducationMaterialListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EducationMaterialListSerializer
    queryset = EducationMaterial.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        classroom_id = self.request.query_params.get('classroom', None)

        if classroom_id:
            queryset = queryset.filter(classroom=classroom_id)
        return queryset.order_by('-uploaded_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        material_list = serializer.data

        return Response({
            'status': 'success',
            'message': 'Education materials retrieved successfully',
            'materials_list': material_list
        }, status=status.HTTP_200_OK)
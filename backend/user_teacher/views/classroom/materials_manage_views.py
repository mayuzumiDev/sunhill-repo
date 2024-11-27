from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from user_teacher.serializers.classroom.materials_manage_serializers import *
from user_teacher.models.classroom_models import *
import cloudinary.uploader

class EducationMaterialUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            file = request.FILES.get('file')
            classroom_id = request.data.get('classroom')  

            if not file:
                return Response({
                    'status': 'error',
                    'message': 'No file provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            if not classroom_id:
                return Response({
                    'status': 'error',
                    'message': 'Classroom ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verify classroom exists
            try:
                classroom = Classroom.objects.get(id=classroom_id)
            except Classroom.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Invalid classroom ID'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Upload to Cloudinary with the original filename
            upload_result = cloudinary.uploader.upload(
                file,
                resource_type="auto",
                public_id=f"materials/{file.name}",
                use_filename=True,
                unique_filename=True
            )

            # Create material record with all required fields
            material = EducationMaterial.objects.create(
                classroom=classroom,  # Use the classroom object
                title=request.data.get('title', file.name),
                description=request.data.get('description', ''),
                material_type=request.data.get('material_type'),
                original_filename=file.name,
                file=upload_result['secure_url'],
                cloudinary_url=upload_result['secure_url']
            )

            return Response({
                'status': 'success',
                'message': 'File uploaded successfully',
                'data': {
                    'id': material.id,
                    'title': material.title,
                    'original_filename': material.original_filename,
                    'file_url': material.cloudinary_url,
                    'classroom_id': classroom.id
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

# class EducationMaterialEditView(generics.UpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = EducationMaterialsEditSerializer
#     queryset = EducationMaterial.objects.all()

#     def partial_update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)

#         return Response({
#             'status': 'success',
#             'message': 'Education material updated successfully',
#             'material': serializer.data
#         })


class EducationMaterialDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EducationMaterialListSerializer
    queryset = EducationMaterial.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.file:
                # Get the public ID from the Cloudinary URL
                # The public ID is the part after the last '/' and before any '.' in the URL
                public_id = instance.file.public_id
                if public_id:
                    # Delete the file from Cloudinary
                    cloudinary.uploader.destroy(public_id)
            
            # Delete the model instance
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
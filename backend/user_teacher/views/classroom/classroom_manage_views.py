from django.http.response import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import generics, status
from user_teacher.serializers.classroom.classroom_manage_serializers import *
from user_teacher.models.classroom_models import *

class ClassroomCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassroomCreateSerializer
    queryset = Classroom.objects.all();

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            classroom_created = serializer.data

            return JsonResponse({'classroom_created': classroom_created}, status=status.HTTP_201_CREATED)

        return JsonResponse({
            'status': 'error',
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class ClassroomEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Classroom.objects.all()
    serializer_class = ClassroomEditSerializer
    http_method_names = ['patch'] 

    def partial_update(self, request, pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)
        
        return JsonResponse({
            'message': 'Classroom updated successfully',
            'data': response.data
        }, status=status.HTTP_200_OK)

class ClassroomDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Classroom.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)

            return JsonResponse({
                'message': 'Classroom deleted successfully'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
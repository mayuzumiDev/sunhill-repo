from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from api.models import CustomUser
from ...serializers.profile.current_teacher_serializer import *

class GetCurrentTeacherView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetCurrentTeacherSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            user_id = request.user.id
            print(user_id)
            teacher_info = CustomUser.objects.get(id=user_id)

            if teacher_info.role != 'teacher':
                return JsonResponse({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(teacher_info, context={'request': request})

            return JsonResponse({"teacher_profile": serializer.data}, status=status.HTTP_200_OK)
        
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return JsonResponse({"Error retrieving the current teacher profile": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
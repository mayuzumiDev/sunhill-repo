from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from ...serializers.profile.current_teacher_serializer import *

class GetCurrentTeacherView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetCurrentTeacherSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            user = request.user

            teacher_info = CustomUser.objects.filter(user=user, role="teacher").first()

            if not teacher_info:
                return JsonResponse({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(teacher_info, context={'request': request})
            serializer.is_valid(raise_exception=True)

            return JsonResponse({"teacher_profile": serializer.data}, status=status.HTTP_200_OK)
        
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return JsonResponse({"Error retrieving the current teacher profile": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from user_admin.models.account_models import ParentInfo
from user_parent.serializers.parent_student_serializers import ParentStudentSerializer

class ParentStudentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParentStudentSerializer
    
    def get_queryset(self):
        # Get the parent info for the current logged-in user
        return ParentInfo.objects.filter(parent_info__user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset.exists():
            parent_info = queryset.first()
            serializer = self.get_serializer(parent_info)
            return JsonResponse({"status": "success", "data": serializer.data})
        return JsonResponse({"status": "error", "detail": "Parent information not found"}, status=404)
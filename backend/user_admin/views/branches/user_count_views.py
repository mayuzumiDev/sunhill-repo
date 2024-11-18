from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import CustomUser
from ...serializers.branches.user_count_serializers import *

class BranchUserCountView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserRoleCountSerializer

    def create(self, request, *args, **kwargs):
        branch_name = request.data.get('branch_name')

        # If no branch name is provided, return all branches
        if not branch_name:
            branches = CustomUser.objects.values('branch_name').distinct()
            serializer = self.get_serializer(branches, many=True)
            return JsonResponse({
                'message': 'All branch user counts retrieved successfully',
                'status': 'success',
                'data': serializer.data
            })

        # Check if branch exists
        if not CustomUser.objects.filter(branch_name=branch_name).exists():
            return JsonResponse({
                'error': 'Branch not found',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)

        # Get counts for specific branch
        branch_data = {'branch_name': branch_name}
        serializer = self.get_serializer(branch_data)
        
        return JsonResponse({
            'message': 'Branch user counts retrieved successfully',
            'status': 'success',
            'data': serializer.data
        })
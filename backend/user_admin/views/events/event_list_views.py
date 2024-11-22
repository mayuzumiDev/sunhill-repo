from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from user_admin.models.event_models import Event
from ...serializers.events.event_list_serializers import EventListSerializer
from django.db.models import Q

class EventListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['target_audience', 'branch']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']  # Default ordering

    def get_queryset(self):
        """Filter events based on user role and branch"""
        user = self.request.user
        queryset = Event.objects.all()

        # Filter events based on visibility
        if user.role == 'admin':
            return queryset
            
        # For non-admin users, filter by target audience and branch
        return queryset.filter(
            Q(target_audience='all') | Q(target_audience=user.role),
            Q(branch='all') | Q(branch__iexact=user.branch_name)
        )

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)

            # Get user info for context
            user = request.user
            user_context = {
                'role': user.role,
                'branch': user.branch_name,
                'is_admin': user.role == 'admin'
            }

            return JsonResponse({
                'status': 'success',
                'user_context': user_context,
                'events': serializer.data,
                'total_count': queryset.count()
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error fetching events: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from user_admin.models.event_models import Event
from ...serializers.events.event_list_serializers import * 

class EventListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventListSerializer
    
    def get_queryset(self):
        from django.utils import timezone
        from django.db.models import Q
        
        now = timezone.now()
        queryset = Event.objects.all()

        # Filter by event type (upcoming/past)
        event_type = self.request.query_params.get('event_type')
        if event_type == 'upcoming':
            queryset = queryset.filter(date__gte=now)
        elif event_type == 'past':
            queryset = queryset.filter(date__lt=now)

        # Order by date
        return queryset.order_by('-date')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            return JsonResponse({
                'message': 'Events retrieved successfully',
                'events_list': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({
                'message': str(e),
                'error': True
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
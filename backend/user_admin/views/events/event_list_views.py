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

        # Get role and branch from query params
        role = self.request.query_params.get('role', '').lower()
        branch = self.request.query_params.get('branch', '').lower()

        print(f"Debug - Received params: role={role}, branch={branch}")
        print(f"Debug - Initial queryset count: {queryset.count()}")

        # For non-admin users, apply role and branch filtering
        if role and role != 'admin':
            # Role-based filtering
            role_filter = (
                Q(target_audience__iexact='all') |
                Q(target_audience__iexact=role) |
                Q(target_audience__exact='')  # Include events with empty target_audience
            )
            print(f"Debug - Applying role filter: {role_filter}")
            queryset = queryset.filter(role_filter)
            print(f"Debug - After role filter count: {queryset.count()}")

            # Branch-based filtering
            if branch:
                branch_filter = (
                    Q(branch__iexact='all') |
                    Q(branch__iexact=branch) |
                    Q(branch__exact='') |  # Include events with empty branch
                    Q(branch__isnull=True)  # Include events with null branch
                )
                print(f"Debug - Applying branch filter: {branch_filter}")
                queryset = queryset.filter(branch_filter)
                print(f"Debug - After branch filter count: {queryset.count()}")

        print(f"Debug - Final SQL query: {str(queryset.query)}")
        print(f"Debug - Final queryset count: {queryset.count()}")
        
        return queryset.order_by('-date')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'events_list': serializer.data,
                'status': 'success'
            })
        except Exception as e:
            print(f"Error in list view: {str(e)}")
            return Response({
                'events_list': [],
                'status': 'error',
                'message': str(e)
            }, status=500)
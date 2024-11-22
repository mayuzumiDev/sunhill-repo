from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_admin.models.event_models import Event
from ...serializers.events.event_create_serializers import EventCreateSerializer
from ...serializers.events.event_list_serializers import EventListSerializer

class EventCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventCreateSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            # Add user to serializer context
            serializer = self.get_serializer(data=request.data, context={'request': request})
            
            # Validate the data
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': 'Validation error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the event
            self.perform_create(serializer)

            # Return the event using the list serializer for consistency
            return Response({
                'status': 'success',
                'message': 'Event created successfully',
                'event': EventListSerializer(serializer.instance).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating event: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        event = serializer.save()
        # Create notifications for relevant users
        from user_admin.models.notification_models import EventNotification
        print(f"Creating event with target_audience: {event.target_audience}, branch: {event.branch}")
        EventNotification.create_notifications_for_event(event)

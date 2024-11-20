from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from user_admin.models.event_models import Event
from ...serializers.events.event_manage_serializers import * 

class EventCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return JsonResponse({
                'message': 'Event created successfully',
                'event_data': serializer.data
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return JsonResponse({
                'message': 'Failed to create event',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return JsonResponse({
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventUpdateView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    serializer_class = EventEditSerializer
    http_method_names = ['patch']  # Restrict to PATCH only

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return JsonResponse({
                'message': 'Event updated successfully',
                'event_data': serializer.data
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            return JsonResponse({
                'message': 'Failed to update event',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Event.DoesNotExist:
            return JsonResponse({
                'message': 'Event not found'
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return JsonResponse({
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventDeleteView(generics.DestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return JsonResponse({
                'message': 'Event deleted successfully'
            }, status=status.HTTP_200_OK)

        except Event.DoesNotExist:
            return JsonResponse({
                'message': 'Event not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return JsonResponse({
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
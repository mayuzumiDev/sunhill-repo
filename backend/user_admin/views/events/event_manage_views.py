from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from ...models.event_models import Event, get_target_audience_choices, get_branch_choices
from ...serializers.events.event_list_serializers import EventListSerializer
from ...serializers.events.event_create_serializers import EventCreateSerializer
from ...serializers.events.event_manage_serializers import EventEditSerializer
from rest_framework import serializers

class EventCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventCreateSerializer
    queryset = Event.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            # Add user to serializer context
            serializer = self.get_serializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            
            # Create the event
            event = serializer.save()

            # Return using list serializer for consistency
            return JsonResponse({
                'status': 'success',
                'message': 'Event created successfully',
                'event': EventListSerializer(event).data
            }, status=status.HTTP_201_CREATED)

        except serializers.ValidationError as e:
            return JsonResponse({
                'status': 'error',
                'message': 'Validation error',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error creating event: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Event.objects.all()
    serializer_class = EventEditSerializer
    http_method_names = ['patch']  # Restrict to PATCH only

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            user = request.user

            # Check edit permission
            if not instance.can_edit(user):
                return JsonResponse({
                    'status': 'error',
                    'message': 'You do not have permission to edit this event'
                }, status=status.HTTP_403_FORBIDDEN)

            data = request.data.copy()

            # Validate choices
            valid_audiences = [choice[0] for choice in get_target_audience_choices()]
            valid_branches = [choice[0] for choice in get_branch_choices()]

            # Non-admin users can only use their branch
            if user.role != 'admin':
                if not user.branch_name:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'You must have an assigned branch to edit events'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Force branch to user's branch
                data['branch'] = user.branch_name.lower()
            else:
                # Admin can choose branch, but validate it
                branch = data.get('branch', '').lower()
                if branch and branch not in valid_branches:
                    return JsonResponse({
                        'status': 'error',
                        'message': f'Invalid branch. Must be one of: {", ".join(valid_branches)}'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Validate target audience if provided
            target_audience = data.get('target_audience', '').lower()
            if target_audience and target_audience not in valid_audiences:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Invalid target audience. Must be one of: {", ".join(valid_audiences)}'
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_event = serializer.save()

            # Return using list serializer for consistency
            return JsonResponse({
                'status': 'success',
                'message': 'Event updated successfully',
                'event': EventListSerializer(updated_event).data
            }, status=status.HTTP_200_OK)

        except serializers.ValidationError as e:
            return JsonResponse({
                'status': 'error',
                'message': 'Validation error',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Event.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Event not found'
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(f"Error updating event: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Event.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Check delete permission
            if not instance.can_delete(request.user):
                return JsonResponse({
                    'status': 'error',
                    'message': 'You do not have permission to delete this event'
                }, status=status.HTTP_403_FORBIDDEN)

            # Perform the deletion
            instance.delete()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Event deleted successfully'
            }, status=status.HTTP_200_OK)

        except Event.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Event not found'
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(f"Error deleting event: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

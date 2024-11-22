from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_admin.models.event_models import Event, TARGET_AUDIENCE_CHOICES, BRANCH_CHOICES
from ...serializers.events.event_list_serializers import EventListSerializer

class EventCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventListSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Get data and user info
            data = request.data
            user = request.user
            
            # Get and validate target audience
            target_audience = data.get('target_audience', '').lower()
            valid_audiences = [choice[0] for choice in TARGET_AUDIENCE_CHOICES]
            if target_audience not in valid_audiences:
                return Response({
                    'status': 'error',
                    'message': f'Invalid target audience. Must be one of: {", ".join(valid_audiences)}'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get and validate branch
            branch = data.get('branch', '').lower()
            
            # For non-admin users, force their branch
            if user.role != 'admin':
                branch = user.branch_name.lower()
            else:
                # Admin can choose branch, but validate it
                valid_branches = [choice[0] for choice in BRANCH_CHOICES]
                if branch not in valid_branches:
                    return Response({
                        'status': 'error',
                        'message': f'Invalid branch. Must be one of: {", ".join(valid_branches)}'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Create event with validated data
            event = Event.objects.create(
                title=data.get('title', ''),
                description=data.get('description', ''),
                date=data.get('date'),
                target_audience=target_audience,
                branch=branch,
                location=data.get('location', ''),
                attachment=data.get('attachment'),
                expiry_date=data.get('expiry_date')
            )

            # Log event creation
            print(f"Created event: {event.title} by {user.role} for {target_audience} in {branch} branch")

            # Serialize and return the created event
            serializer = self.get_serializer(event)
            return Response({
                'status': 'success',
                'message': 'Event created successfully',
                'event': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating event: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

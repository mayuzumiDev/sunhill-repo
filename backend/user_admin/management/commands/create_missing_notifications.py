from django.core.management.base import BaseCommand
from user_admin.models.event_models import Event
from user_admin.models.notification_models import EventNotification

class Command(BaseCommand):
    help = 'Create notifications for existing events that do not have notifications'

    def handle(self, *args, **options):
        self.stdout.write('Creating missing notifications...')
        
        # Get all events
        events = Event.objects.all()
        total_events = events.count()
        
        self.stdout.write(f'Found {total_events} events')
        notifications_created = 0
        
        # Process each event
        for event in events:
            # Check if event has any notifications
            if not EventNotification.objects.filter(event=event).exists():
                self.stdout.write(f'Creating notifications for event: {event.title}')
                EventNotification.create_notifications_for_event(event)
                notifications_created += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'Successfully created notifications for {notifications_created} events'
        ))

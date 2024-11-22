from rest_framework import serializers
from user_admin.models.event_models import Event

class EventListSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()
    formatted_created_at = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'target_audience', 'location', 'expiry_date', 'created_at', 'formatted_date', 'formatted_created_at']

    def get_formatted_date(self, obj):
        return obj.date.strftime('%B %d, %Y %I:%M %p')

    def get_formatted_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %H:%M')
from rest_framework import serializers
from datetime import datetime, timezone
from user_admin.models.event_models import Event, get_target_audience_choices, get_branch_choices

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'date', 'target_audience', 'branch', 'location', 'expiry_date']
        extra_kwargs = {
            'expiry_date': {'required': False},
            'location': {'required': False},
        }

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long.")
        return value.strip()

    def validate_date(self, value):
        if value < datetime.now(timezone.utc):
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value

    def validate_target_audience(self, value):
        value = value.lower()
        valid_audiences = [choice[0] for choice in get_target_audience_choices()]
        if value not in valid_audiences:
            raise serializers.ValidationError(f"Invalid target audience. Must be one of: {', '.join(valid_audiences)}")
        return value

    def validate_branch(self, value):
        value = value.lower()
        valid_branches = [choice[0] for choice in get_branch_choices()]
        if value not in valid_branches:
            raise serializers.ValidationError(f"Invalid branch. Must be one of: {', '.join(valid_branches)}")
        return value

    def validate_expiry_date(self, value):
        if value and value < datetime.now(timezone.utc):
            raise serializers.ValidationError("Expiry date cannot be in the past.")
        return value

    def validate(self, data):
        if 'expiry_date' in data and data['expiry_date']:
            if data['expiry_date'] <= data['date']:
                raise serializers.ValidationError({
                    'expiry_date': "Expiry date must be after the event date."
                })
        return data

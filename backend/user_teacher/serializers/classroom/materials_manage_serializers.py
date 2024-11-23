from rest_framework import serializers
from user_teacher.models.classroom_models import EducationMaterial

class EducationMaterialUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationMaterial
        fields = ['classroom', 'title', 'description', 'material_type', 'file']


class EducationMaterialsEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationMaterial
        fields = ['title', 'description', 'material_type', 'file']
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False},
            'material_type': {'required': False},
            'file': {'required': False}
        }

    def update(self, instance, validated_data):
        # If a new file is uploaded, delete the old one
        if 'file' in validated_data and instance.file:
            instance.file.delete(save=False)
        return super().update(instance, validated_data)


class EducationMaterialListSerializer(serializers.ModelSerializer):
    material_type_display = serializers.CharField(source='get_material_type_display', read_only=True)
    uploaded_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = EducationMaterial
        fields = ['id', 'classroom', 'title', 'description', 'material_type', 
                 'material_type_display', 'file', 'file_url', 'uploaded_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
        return None
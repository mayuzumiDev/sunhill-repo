from rest_framework import serializers
from user_teacher.models.classroom_models import EducationMaterial

class StudentEducationMaterialListSerializer(serializers.ModelSerializer):
    material_type_display = serializers.CharField(source='get_material_type_display', read_only=True)
    uploaded_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    file_url = serializers.SerializerMethodField()
    classroom_info = serializers.SerializerMethodField()

    class Meta:
        model = EducationMaterial
        fields = ['id', 'classroom', 'classroom_info', 'title', 'description', 
                 'material_type', 'material_type_display', 'file', 'file_url', 'cloudinary_url', 
                 'uploaded_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
        return None

    def get_classroom_info(self, obj):
        return {
            'subject_name': obj.classroom.subject_name,
            'grade_level': obj.classroom.grade_level,
            'class_section': obj.classroom.class_section,
        }
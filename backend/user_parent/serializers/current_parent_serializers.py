from rest_framework import serializers
from api.models import CustomUser
from user_student.models import StudentInfo
from user_parent.models import ParentInfo

class CurrentParentSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()
    parent_info_id = serializers.IntegerField(source='user_info.parent_info.id', read_only=True)

    def get_user_info(self, instance):
        if not hasattr(instance, 'user_info') or instance.user_info is None:
            return None

        user_info = instance.user_info
        profile_image_url = None
        if user_info.profile_image:
            request = self.context.get('request')
            if request is not None:
                profile_image_url = request.build_absolute_uri(user_info.profile_image.url)

        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no,
            'profile_image': profile_image_url
        }

    def get_student_info(self, instance):
        if not hasattr(instance, 'user_info') or not hasattr(instance.user_info, 'parent_info'):
            return []

        parent_info = instance.user_info.parent_info
        student_info_list = []
        
        if parent_info and parent_info.student_info:
            for student_info in parent_info.student_info.all():
                if hasattr(student_info, 'user_info') and student_info.user_info:
                    user = student_info.user_info.user
                    student_info_list.append({
                        'student_user_id': user.id,
                        'student_info_id': student_info.id,
                        'grade_level': student_info.grade_level,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email
                    })

        return student_info_list

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'branch_name', 
                 'user_info', 'parent_info_id', 'student_info']
        read_only_fields = ['id', 'branch_name', 'parent_info_id', 'student_info']

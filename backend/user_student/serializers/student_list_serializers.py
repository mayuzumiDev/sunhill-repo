from rest_framework import serializers
from user_account.models import CustomUser
from user_student.models import StudentInfo

class StudentListSerializer(serializers.ModelSerializer):
    student_info_id = serializers.IntegerField(source='user_info.student_info.id', read_only=True)
    user_info = serializers.SerializerMethodField()
    parent_info = serializers.SerializerMethodField()

    def get_user_info(self, instance):
        user_info = instance.user_info
        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no,
            'profile_image': user_info.profile_image.url if user_info.profile_image else None
        }

    def get_parent_info(self, instance):
        student_info = instance.user_info.student_info if hasattr(instance.user_info, 'student_info') else None
        if student_info:
            parent_info_list = []
            for parent_info in student_info.parent_info.all():
                user_info = parent_info.user_info
                if user_info and user_info.user:
                    parent_info_list.append({
                        'parent_user_id': user_info.user.id,
                        'parent_info_id': parent_info.id,
                        'first_name': user_info.user.first_name,
                        'last_name': user_info.user.last_name,
                        'email': user_info.user.email
                    })
            return parent_info_list
        return []

    class Meta:
        model = CustomUser
        fields = ('id', 'student_info_id', 'first_name', 'last_name', 'username', 
                 'email', 'branch_name', 'user_info', 'parent_info')

class StudentInfoEditSerializer(serializers.ModelSerializer):
    parent_info = serializers.PrimaryKeyRelatedField(many=True, queryset=StudentInfo.objects.all())

    class Meta:
        model = StudentInfo
        fields = ['id', 'parent_info', 'grade_level']

    def update(self, instance, validated_data):
        parent_info = validated_data.pop('parent_info', None)

        if parent_info is not None:
            instance.parent_info.set(parent_info)
        return super().update(instance, validated_data)

# Generated by Django 5.1.1 on 2024-11-11 05:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_admin', '0002_alter_userinfo_contact_no'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentinfo',
            name='student_info',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='studentinfo', to='user_admin.userinfo'),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='userinfo', to=settings.AUTH_USER_MODEL),
        ),
    ]
# Generated by Django 5.1.1 on 2024-11-25 12:38

import cloudinary.models
import django.core.validators
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_teacher', '0005_alter_educationmaterial_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='educationmaterial',
            name='file',
            field=cloudinary.models.CloudinaryField(max_length=255, validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png', 'mp4', 'avi', 'doc', 'docx'])], verbose_name='education_materials'),
        ),
    ]

# Generated by Django 5.1.1 on 2024-11-27 10:03

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_teacher', '0007_alter_question_question_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='educationmaterial',
            name='cloudinary_url',
            field=models.URLField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='educationmaterial',
            name='original_filename',
            field=models.CharField(default='default_filename', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='educationmaterial',
            name='file',
            field=cloudinary.models.CloudinaryField(max_length=255, verbose_name='file'),
        ),
    ]

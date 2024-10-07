# Generated by Django 5.1.1 on 2024-10-06 11:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_remove_customuser_unique_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passwordresetcode',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='password_reset_codes', to=settings.AUTH_USER_MODEL),
        ),
    ]

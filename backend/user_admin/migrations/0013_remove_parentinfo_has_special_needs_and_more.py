# Generated by Django 5.1.1 on 2024-12-08 09:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_admin', '0012_parentinfo_has_special_needs_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parentinfo',
            name='has_special_needs',
        ),
        migrations.RemoveField(
            model_name='parentinfo',
            name='special_needs_details',
        ),
        migrations.AddField(
            model_name='studentinfo',
            name='has_special_needs',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='studentinfo',
            name='special_needs_details',
            field=models.TextField(blank=True, help_text='Details of any special needs conditions', null=True),
        ),
    ]
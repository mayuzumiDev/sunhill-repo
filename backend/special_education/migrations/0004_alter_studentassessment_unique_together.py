# Generated by Django 5.1.2 on 2024-11-19 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('special_education', '0003_alter_studentassessment_options_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='studentassessment',
            unique_together=set(),
        ),
    ]
# Generated by Django 5.1.1 on 2024-10-03 14:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_passwordresetcode_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='passwordresetcode',
            unique_together=set(),
        ),
    ]

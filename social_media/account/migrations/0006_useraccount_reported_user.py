# Generated by Django 5.0.2 on 2024-04-25 06:54

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_reported_useraccounts'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='reported_user',
            field=models.ManyToManyField(blank=True, related_name='reported_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
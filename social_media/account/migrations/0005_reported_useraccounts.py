# Generated by Django 5.0.2 on 2024-04-20 07:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_useraccount_blocked_users'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reported_userAccounts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.TextField(blank=True)),
                ('reported_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Reported_user', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Reported_user_Accounts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
# Generated by Django 5.0.2 on 2024-04-15 08:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0005_reportedpost_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reportedpost',
            name='post_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Reported_Post', to='post.posts'),
        ),
    ]
# Generated by Django 5.1.7 on 2025-05-19 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='server',
            name='ip_address',
            field=models.CharField(max_length=20),
        ),
    ]

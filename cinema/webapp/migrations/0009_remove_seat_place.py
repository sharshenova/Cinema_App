# Generated by Django 2.1 on 2019-03-06 14:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0008_seat_seat'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='seat',
            name='place',
        ),
    ]

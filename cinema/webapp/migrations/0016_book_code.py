# Generated by Django 2.1 on 2019-03-07 12:45

from django.db import migrations, models
import webapp.models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0015_auto_20190307_1747'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='code',
            field=models.CharField(default=webapp.models.generate_code, editable=False, max_length=10, unique_for_date='created_at', verbose_name='Код брони'),
        ),
    ]
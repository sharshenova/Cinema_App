# Generated by Django 2.1 on 2019-03-06 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0007_auto_20190306_2001'),
    ]

    operations = [
        migrations.AddField(
            model_name='seat',
            name='seat',
            field=models.CharField(default=222, max_length=5, verbose_name='Место'),
            preserve_default=False,
        ),
    ]

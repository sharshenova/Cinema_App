# Generated by Django 2.1 on 2019-03-04 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0004_auto_20190304_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='category',
            field=models.ManyToManyField(blank=True, related_name='movies_by_category', to='webapp.Category', verbose_name='Категория фильма'),
        ),
    ]

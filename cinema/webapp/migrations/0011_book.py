# Generated by Django 2.1 on 2019-03-07 06:59

from django.db import migrations, models
import django.db.models.deletion
import webapp.models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0010_auto_20190307_1116'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=webapp.models.generate_code, editable=False, max_length=10, unique_for_date='created_at', verbose_name='Код брони')),
                ('status', models.CharField(choices=[('created', 'Created'), ('sold', 'Sold'), ('canceled', 'Canceled')], default='created', max_length=20, verbose_name='Статус')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата изменения')),
                ('seats', models.ManyToManyField(related_name='booking', to='webapp.Seat', verbose_name='Место')),
                ('show', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='booking', to='webapp.Show', verbose_name='Сеанс')),
            ],
        ),
    ]

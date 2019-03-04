from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(max_length=2000, null=True, blank=True, verbose_name='Описание')

    def __str__(self):
        return self.name


class Movie(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(max_length=2000, null=True, blank=True, verbose_name='Описание')
    poster = models.ImageField(upload_to='posters', null=True, blank=True, verbose_name='Постер')
    release_date = models.DateField(verbose_name='Дата выхода в прокат')
    finish_date = models.DateField(null=True, blank=True, verbose_name='Дата окончания проката')
    category = models.ManyToManyField(Category, blank=True, related_name='movies_by_category', verbose_name='Категория фильма')

    def __str__(self):
        return self.name


class Hall(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')

    def __str__(self):
        return self.name


class Seat(models.Model):
    hall = models.ForeignKey(Hall, null=True, blank=True, on_delete=models.PROTECT, related_name='seats_in_hall',
                             verbose_name='Кинозал')
    row = models.IntegerField(verbose_name='Ряд')
    place = models.IntegerField(verbose_name='Место')

    def __str__(self):
        return str(self.place)


class Show(models.Model):
    movie = models.ForeignKey(Movie, null=True, blank=True, related_name='shows_of_movie', verbose_name='Фильм',
                              on_delete=models.PROTECT)
    hall = models.ForeignKey(Hall, null=True, blank=True, related_name='shows_in_hall', verbose_name='Зал',
                              on_delete=models.PROTECT)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False, verbose_name='Время начала')
    end_time = models.DateTimeField(auto_now=False, auto_now_add=False, verbose_name='Время окончания')
    price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name='Цена за билет')

    def __str__(self):
        return self.movie




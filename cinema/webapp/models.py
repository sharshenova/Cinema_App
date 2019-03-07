from django.db import models
from django.urls import reverse


class SoftDeleteManager(models.Manager):
    def active(self):
        return self.filter(is_deleted=False)

    def deleted(self):
        return self.filter(is_deleted=True)


class Movie(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(max_length=2000, null=True, blank=True, verbose_name='Описание')
    poster = models.ImageField(upload_to='posters', null=True, blank=True, verbose_name='Постер')
    release_date = models.DateField(verbose_name='Дата выхода в прокат')
    finish_date = models.DateField(null=True, blank=True, verbose_name='Дата окончания проката')
    is_deleted = models.BooleanField(default=False)
    categories = models.ManyToManyField('Category', blank=True, related_name='movies_by_category',
                                        verbose_name='Категория фильма')

    objects = SoftDeleteManager()

    # создаем url для просмотра подробной информации о фильме
    def get_absolute_url(self):
        return reverse('api_v1:movie-detail', kwargs={'pk': self.pk})

    def get_categories_display(self):
        return self.categories.all()

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(max_length=2000, null=True, blank=True, verbose_name='Описание')

    def __str__(self):
        return self.name

    # название модели во множественном числе (если не указано, Django создаст по правилу verbose_name + "s")
    class Meta:
        verbose_name_plural = "Categories"


class Hall(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(max_length=2000, null=True, blank=True, verbose_name='Описание')

    def __str__(self):
        return self.name


class Seat(models.Model):
    hall = models.ForeignKey(Hall, null=True, blank=True, on_delete=models.PROTECT, related_name='seats',
                             verbose_name='Кинозал')
    row = models.CharField(max_length=10, verbose_name='Ряд')
    seat = models.CharField(max_length=5, verbose_name='Место')

    def __str__(self):
        return "Row %s Seat %s" % (self.row, self.seat)


class Show(models.Model):
    movie = models.ForeignKey(Movie, null=True, blank=True, related_name='shows', verbose_name='Фильм',
                              on_delete=models.PROTECT)
    hall = models.ForeignKey(Hall, null=True, blank=True, related_name='shows', verbose_name='Зал',
                              on_delete=models.PROTECT)
    start_time = models.DateTimeField(auto_now=False, auto_now_add=False, verbose_name='Время начала')
    end_time = models.DateTimeField(auto_now=False, auto_now_add=False, verbose_name='Время окончания')
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='Цена за билет')

    def __str__(self):
        return "%s, %s (%s - %s)" % (self.movie, self.hall,
                                     self.start_time.strftime('%d.%m.%Y %H:%M'),
                                     self.end_time.strftime('%d.%m.%Y %H:%M'))






from django.db import models
from django.urls import reverse
import random
import string
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


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
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return self.name

    # название модели во множественном числе (если не указано, Django создаст по правилу verbose_name + "s")
    class Meta:
        verbose_name_plural = "Categories"


class Hall(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(max_length=2000, null=True, blank=True, verbose_name='Описание')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return self.name


class Seat(models.Model):
    hall = models.ForeignKey(Hall, null=True, blank=True, on_delete=models.PROTECT, related_name='seats',
                             verbose_name='Кинозал')
    row = models.CharField(max_length=10, verbose_name='Ряд')
    seat = models.CharField(max_length=5, verbose_name='Место')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return "Row %s Seat %s" % (self.row, self.seat)


class Show(models.Model):
    movie = models.ForeignKey(Movie, null=True, blank=True, related_name='shows', verbose_name='Фильм',
                              on_delete=models.PROTECT)
    hall = models.ForeignKey(Hall, null=True, blank=True, related_name='shows', verbose_name='Зал',
                              on_delete=models.PROTECT)
    start_time = models.DateTimeField(verbose_name='Время начала')
    end_time = models.DateTimeField(verbose_name='Время окончания')
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='Цена за билет')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return "%s, %s (%s - %s)" % (self.movie, self.hall,
                                     self.start_time.strftime('%d.%m.%Y %H:%M'),
                                     self.end_time.strftime('%d.%m.%Y %H:%M'))


# генерируем уникальный текстовый код из необходимого количества символов
# количество символов - BOOKING_CODE_LENGTH прописываем в настройках (settings.py)
def generate_code():
    code = ""
    for i in range(0, settings.BOOKING_CODE_LENGTH):
        code += random.choice(string.digits)
    return code


BOOKING_STATUS_CHOICES = [
    ('created', 'Created'),
    ('sold', 'Sold'),
    ('canceled', 'Canceled'),
]


class Book(models.Model):
    # значение по умолчанию - метод generate_code, который генерирует случайный код из 6 цифр
    # свойство unique_for_date делает это поле уникальным в пределах даты, указанной в поле created_at
    # editable=False означает, что код нельзя сгенерировать заново в той же брони

    # code = models.CharField(max_length=10, unique_for_date='created_at', default=generate_code,
    #                         editable=False, verbose_name='Код брони')

    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name='booking', verbose_name='Сеанс')
    seats = models.ManyToManyField(Seat, related_name='booking', verbose_name='Место')
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='created', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата изменения')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return "%s, %s" % (self.show, self.code)

    # выводим забронированные места (ряд + место)
    def get_seats_display(self):
        seats = ""
        for seat in self.seats.all():
            seats += "R%sS%s " % (seat.row, seat.seat)
        return seats.rstrip()


class Discount(models.Model):

    name = models.CharField(max_length=225, verbose_name='Название')
    discount = models.DecimalField(max_digits=5, decimal_places=2, validators=[
        MaxValueValidator(100),
        MinValueValidator(0)
    ], verbose_name='Скидка')
    start_date = models.DateField(null=True, blank=True, verbose_name='Дата начала')
    end_date = models.DateField(null=True, blank=True, verbose_name='Дата окончания')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return "%s %s %%" % (self.name, self.discount)


class Ticket(models.Model):

    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name="tickets", verbose_name="Сеанс")
    seat = models.ForeignKey(Seat, on_delete=models.PROTECT, related_name="tickets", verbose_name="Место")
    discount = models.ForeignKey(Discount, null=True, blank=True, on_delete=models.PROTECT,
                                 related_name="tickets", verbose_name="Скидка")
    exchange = models.BooleanField(verbose_name="Возврат")
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def __str__(self):
        return "%s, %s" % (self.show, self.seat)




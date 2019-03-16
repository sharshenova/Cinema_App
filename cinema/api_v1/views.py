from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from webapp.models import Movie, Category, Hall, Seat, Show, Book, Discount, Ticket
from rest_framework import viewsets
from django_filters import rest_framework as filters
from api_v1.serializers import MovieCreateSerializer, MovieDisplaySerializer, \
    CategorySerializer, HallSerializer, SeatCreateSerializer, SeatDisplaySerializer,\
    ShowCreateSerializer, ShowDisplaySerializer, BookCreateSerializer, BookDisplaySerializer,\
    DiscountSerializer, TicketCreateSerializer, TicketDisplaySerializer

# Отключаем авторизацию в ViewSet-ах API
class NoAuthModelViewSet(viewsets.ModelViewSet):
    authentication_classes = []


class MovieViewSet(NoAuthModelViewSet):
    queryset = Movie.objects.active()
    # filterset_fields = ('id',)

    # Метод, который отвечает за то,
    # какой класс сериализатора будет использоваться при обработке запроса.
    # Если запрос сделан методом GET, т.е. запрос на просмотр фильма или списка фильмов,
    # то метод возвращает класс MovieDisplaySerializer (вывод фильмов с вложенными категориями),
    # иначе - MovieCreateSerializer (вывод и сохранение фильмов с категориями в виде списка id категорий).
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MovieDisplaySerializer
        else:
            return MovieCreateSerializer

    def get_queryset(self):
        queryset = self.queryset
        # принимает параметры запроса (query_params), возвращает None если их нет
        min_release_date = self.request.query_params.get('release_date', None)
        if min_release_date is not None:
            queryset = queryset.active().filter(release_date__gte=min_release_date).order_by('-release_date')
        return queryset

    # метод, который выполняет удаление объекта instance.
    # здесь он переопределён для "мягкого" удаления объектов -
    # вместо реального удаления объекта, меняется его свойство is_deleted на True.
    # сам фильм сохраняется в базе, но при этом помечается, как удалённый.
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()



class CategoryViewSet(NoAuthModelViewSet):
    queryset = Category.objects.active().order_by('-name')
    serializer_class = CategorySerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class HallViewSet(NoAuthModelViewSet):
    queryset = Hall.objects.active().order_by('-name')
    serializer_class = HallSerializer
    filterset_fields = ('id',)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class SeatViewSet(NoAuthModelViewSet):
    queryset = Seat.objects.active().order_by('-seat')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SeatDisplaySerializer
        else:
            return SeatCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    # фильтрация через переопределение набора данных
    def get_queryset(self):
        queryset = self.queryset
        hall = self.request.query_params.get('hall', None)
        if hall is not None:
            queryset = queryset.filter(hall=hall)
        return queryset


class ShowViewSet(NoAuthModelViewSet):
    # сортируем запросы по возрастанию order_by('start_time')
    queryset = Show.objects.active().order_by('start_time')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ShowDisplaySerializer
        else:
            return ShowCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    # фильтрация через переопределение набора данных
    def get_queryset(self):
        queryset = self.queryset
        movie_id = self.request.query_params.get('movie_id', None)
        # задаем минимальную дату начала проката (чтобы затем вывести даты позже этой)
        min_start_date = self.request.query_params.get('min_start_date', None)
        max_start_date = self.request.query_params.get('max_start_date', None)
        # если минимальная дата поступила из запроса, то выводим показы, у которых дата больше (start_time__gte)
        if movie_id is not None or min_start_date is not None or max_start_date is not None:
            queryset = queryset.filter(movie__id=movie_id, start_time__gte=min_start_date,
                                       start_time__lte=max_start_date).order_by('start_time')
        return queryset



class BookViewSet(NoAuthModelViewSet):
    queryset = Book.objects.active().order_by('-status')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BookDisplaySerializer
        else:
            return BookCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class DiscountViewSet(NoAuthModelViewSet):
    queryset = Discount.objects.active().order_by('-name')
    serializer_class = DiscountSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class TicketViewSet(NoAuthModelViewSet):
    queryset = Ticket.objects.active().order_by('-discount')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TicketDisplaySerializer
        else:
            return TicketCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

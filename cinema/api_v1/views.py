from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from webapp.models import Movie, Category, Hall, Seat, Show
from rest_framework import viewsets
from api_v1.serializers import MovieCreateSerializer, MovieDisplaySerializer, \
    CategorySerializer, HallSerializer, SeatCreateSerializer, SeatDisplaySerializer,\
    ShowCreateSerializer, ShowDisplaySerializer

# Отключаем авторизацию в ViewSet-ах API
class NoAuthModelViewSet(viewsets.ModelViewSet):
    authentication_classes = []


class MovieViewSet(NoAuthModelViewSet):
    queryset = Movie.objects.active().order_by('-release_date')

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


class ShowViewSet(NoAuthModelViewSet):
    queryset = Show.objects.active().order_by('-start_time')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ShowDisplaySerializer
        else:
            return ShowCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

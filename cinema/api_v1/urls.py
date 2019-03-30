#!/usr/bin/env bash

from django.urls import include, path
from rest_framework import routers
from django.contrib import admin
from api_v1 import views


# создаём объект router, который привязывает ViewSet к путям на сайте
router = routers.DefaultRouter()
router.register(r'movies', views.MovieViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'halls', views.HallViewSet)
router.register(r'seats', views.SeatViewSet)
router.register(r'shows', views.ShowViewSet)
router.register(r'books', views.BookViewSet)
router.register(r'discounts', views.DiscountViewSet)
router.register(r'tickets', views.TicketViewSet)
router.register(r'users', views.UserDetailView)


app_name = 'api_v1'

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='api_token_auth'),
    path('admin/', admin.site.urls),
    path('register/', views.UserCreateView.as_view(), name='register'),
    # новая точка входа, куда можно прислать POST-запрос с токеном для активации нового пользователя
    path('register/activate', views.UserActivateView.as_view(), name='register_activate')
]

# если у нас нет LoginView.as_view(), то url для логина будет выглядеть так:
# path('login/', obtain_auth_token, name='api_token_auth')
# obtain_auth_token - встроенное представление в DRF,
# которое принимает логин и пароль в формате JSON в POST-запросе и возвращает JSON с токеном

# admin.site.urls - встроенное приложение для работы с админкой
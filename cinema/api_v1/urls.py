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


app_name = 'api_v1'

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls)
]
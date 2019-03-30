from django.contrib import admin
from webapp.models import Movie, Category, Hall, Seat, Show, Book, Discount, Ticket, RegistrationToken


# Register your models here.

# прописываем, какие поля будут выводиться в модели
# (токен выводится только для чтения и не подлежит изменению, даже из админки)
class RegistrationTokenAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'created_at']
    readonly_fields = ['token']


class MovieAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'release_date']
    ordering = ['-release_date']
    search_fields = ['name', 'id']


def list_admin_with_pk(*fields):
    class PkListAdmin(admin.ModelAdmin):
        list_display = ['pk'] + list(fields)
    return PkListAdmin


admin.site.register(Movie, MovieAdmin)
admin.site.register(Category, list_admin_with_pk('name'))
admin.site.register(Hall, list_admin_with_pk('name'))
admin.site.register(Seat, list_admin_with_pk('hall', 'row', 'seat'))
admin.site.register(Show, list_admin_with_pk('movie', 'hall', 'start_time', 'end_time'))
admin.site.register(Book, list_admin_with_pk('show', 'code', 'get_seats_display'))
admin.site.register(Discount, list_admin_with_pk('name', 'discount', 'start_date', 'end_date'))
admin.site.register(Ticket, list_admin_with_pk('show', 'seat', 'discount', 'exchange'))
admin.site.register(RegistrationToken, RegistrationTokenAdmin)

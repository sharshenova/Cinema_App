from webapp.models import Movie, Category, Hall, Seat, Show, Book, Discount, Ticket
from rest_framework import serializers
# импортируем стандартную модель USER
# (в django.contrib.auth находятся модели пользователя, группы и разрешения относящиеся к ним)
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # validated_data - содержит все данные, пришедшие при запросе (уже проверенные на правильность заполнения)
    def create(self, validated_data):
        # выкидываем из validated_data поле пароля и присваиваем его содержимое в переменную password
        password = validated_data.pop('password')
        # распаковываем validated_data и передаем все поля, кроме пароля, в user
        # для распаковки используется ** для словарей, * - для списков
        user = User.objects.create(**validated_data)
        # записываем пароль отдельно, чтобы он хранился в зашифрованном виде (hash), используя спец. метод set_password
        user.set_password(password)
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']


# Сериализатор для модели категорий, предназначенный для включения в сериализатор фильмов
# Не выводит ненужные в данном случае поля: description и url
class InlineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class InlineSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ('id', 'row', 'seat')

class InlineHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ('id', 'name')

class InlineMovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'name')

class InlineShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = ('id', 'movie', 'hall', 'start_time', 'end_time', 'price')

class InlineDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ("id", "name")



class CategorySerializer(serializers.ModelSerializer):
    # добавляем URL для отображения подробной информации о категории
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:category-detail')

    class Meta:
        model = Category
        fields = ('url', 'id', 'name', 'description')



# Сериализатор фильмов для создания/обновления
# выводит категории по умолчанию - в виде списка id категорий
class MovieCreateSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:movie-detail')

    class Meta:
        model = Movie
        fields = ('url', 'id', 'name', 'description', 'poster', 'release_date', 'finish_date',
                  'categories')


# Сериализатор для просмотра фильмов
# выводит категории в виде списка вложенных объектов, представленных сериализатором InlineCategorySerializer.
class MovieDisplaySerializer(MovieCreateSerializer):
    categories = InlineCategorySerializer(many=True, read_only=True)

# чтобы MovieCreateSerializer и MovieDisplaySerializer работали корректно,
# во views.py прописывается метод "def get_serializer_class"



class HallSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:hall-detail')

    # поле, представляющее обратную связь от зала к местам в зале.
    # название поля должно совпадать с related_name внешнего ключа от мест к залу (Seat.hall)
    seats = InlineSeatSerializer(many=True, read_only=True)

    class Meta:
        model = Hall
        fields = ('url', 'id', 'name', 'description', 'seats')



class SeatCreateSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:seat-detail')

    # добавляем ссылку на внешнее поле - Hall, только для чтения, источник - поле hall в модели Seat
    hall_url = serializers.HyperlinkedRelatedField(view_name='api_v1:hall-detail', read_only=True, source='hall')

    class Meta:
        model = Seat
        fields = ('url', 'id', 'hall', 'hall_url', 'row', 'seat')


class SeatDisplaySerializer(SeatCreateSerializer):
    hall = InlineHallSerializer(read_only=True)



class ShowCreateSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:show-detail')
    movie_url = serializers.HyperlinkedRelatedField(view_name='api_v1:movie-detail', read_only=True, source='movie')
    hall_url = serializers.HyperlinkedRelatedField(view_name='api_v1:hall-detail', read_only=True, source='hall')

    class Meta:
        model = Show
        fields = ('url', 'id', 'movie', 'movie_url', 'hall', 'hall_url', 'start_time', 'end_time', 'price')


class ShowDisplaySerializer(ShowCreateSerializer):
    movie = InlineMovieSerializer(read_only=True)
    hall = InlineHallSerializer(read_only=True)






class BookCreateSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:book-detail')
    # code = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = ('url', 'id', 'show', 'seats', 'status', 'created_at', 'updated_at')
        # read_only_fields = ('code',)

# Model fields which have editable=False set, and AutoField fields will be set to read-only by default,
# and do not need to be added to the read_only_fields option.

class BookDisplaySerializer(BookCreateSerializer):
    show = InlineShowSerializer(read_only=True)
    seats = InlineSeatSerializer(read_only=True, many=True)

    class Meta:
        model = Book
        fields = ('url', 'id', 'show', 'seats', 'status', 'created_at', 'updated_at', 'code')





class DiscountSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:discount-detail')

    class Meta:
        model = Discount
        fields = ('url', 'id', 'name', 'discount', 'start_date', 'end_date')



class TicketCreateSerializer(serializers.ModelSerializer):

    url = serializers.HyperlinkedIdentityField(view_name='api_v1:ticket-detail')

    class Meta:
        model = Ticket
        fields = ('url', 'id', 'show', 'seat', 'discount', 'exchange')


class TicketDisplaySerializer(TicketCreateSerializer):
    seat = InlineSeatSerializer(read_only=True)
    show = InlineShowSerializer(read_only=True)
    discount = InlineDiscountSerializer(read_only=True)



from webapp.models import Movie, Category, Hall, Seat, Show
from rest_framework import serializers

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
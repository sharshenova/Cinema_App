from rest_framework import serializers
# импортируем стандартную модель USER
# (в django.contrib.auth находятся модели пользователя, группы и разрешения относящиеся к ним)
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate
from webapp.models import Movie, Category, Hall, Seat, Show, Book, Discount, Ticket, RegistrationToken
from rest_framework.authtoken.models import Token


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    # чтобы email был обязательным
    email = serializers.EmailField(required=True)

    # общая валидация между разными полями может происходить в методе validate
    # attrs - словарь со всеми данными для модели, уже проверенными по отдельности.
    # ошибки из этого метода попадают в non_field_errors.
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise ValidationError("Passwords do not match")
        return super().validate(attrs)

    # validated_data - содержит все данные, пришедшие при запросе (уже проверенные на правильность заполнения)
    def create(self, validated_data):
        # удаляем подтверждение пароля из списка атрибутов
        validated_data.pop('password_confirm')
        # удаляем пароль из списка атрибутов и запоминаем его
        # выкидываем из validated_data поле пароля и присваиваем его содержимое в переменную password
        password = validated_data.pop('password')
        # распаковываем validated_data и передаем все поля, кроме пароля, в user
        # для распаковки используется ** для словарей, * - для списков
        user = super().create(validated_data)
        # записываем пароль отдельно, чтобы он хранился в зашифрованном виде (hash), используя спец. метод set_password
        user.set_password(password)
        # чтобы новый пользователь был неактивным
        user.is_active = False
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password_confirm', 'email']



######### заменен на UserSerializer ##############################
# class UserUpdateSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=False)
#
#     # validated_data - содержит все данные, пришедшие при запросе (уже проверенные на правильность заполнения)
#     def update(self, instance, validated_data):
#
#         instance.first_name = validated_data.get('first_name')
#         instance.last_name = validated_data.get('last_name')
#         instance.email = validated_data.get('email')
#
#         # если пароль заполнен, сохраняем его в зашифрованном виде
#         password = validated_data.get('password')
#         if password:
#             instance.set_password(password)
#         instance.save()
#         return instance
#
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email']



class UserSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:user-detail')
    # имя пользователя нельзя менять.
    username = serializers.CharField(read_only=True)
    # пароль нельзя смотреть.
    # поле пароль здесь нужно для проверки, что пользователь - тот, за кого себя выдаёт,
    # при редактировании остальных данных.
    password = serializers.CharField(write_only=True)
    # новый пароль и его подтверждение - только для записи, необязательные
    # на случай, если пользователь не хочет менять пароль.
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password_confirm = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(required=True, allow_blank=False)

    # метод для валидации поля "Пароль"
    # value - это пароль
    def validate_password(self, value):
        user = self.context['request'].user
        if not authenticate(username=user.username, password=value):
            raise ValidationError('Invalid password for your account')
        return value

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('new_password_confirm'):
            raise ValidationError("Passwords do not match")
        return super().validate(attrs)

    # user - это instance
    def update(self, instance, validated_data):
        # удаляем старый пароль из списка атрибутов
        validated_data.pop('password')
        # удаляем новый пароль из списка атрибутов и запоминаем его
        new_password = validated_data.pop('new_password')
        # удаляем подтверждение пароля из списка атрибутов
        validated_data.pop('new_password_confirm')

        # обновляем пользователя всеми оставшимися данными
        instance = super().update(instance, validated_data)

        # меняем пароль при необходимости
        if new_password:
            instance.set_password(new_password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'first_name', 'last_name', 'email',
                  'password', 'new_password', 'new_password_confirm']





# сериализатор для формы отправки токена,
# принимает токен и проверяет, что он - uuid.
# т.к. не нужен для создания/обновления/получения списка и т.д.
# не связываем его с моделью, а используем базовый Serializer с одним полем.
class RegistrationTokenSerializer(serializers.Serializer):
    token = serializers.UUIDField(write_only=True)

    # валидация поля token.
    # теперь проверки на существование и срок действия токена
    # выполняются здесь вместо представления UserActivateView.
    # метод называется validate_token, потому что сериализаторы DRF для
    # дополнительной валидации своих полей ищут методы с именами вида
    # validate_field, где field - имя этого поля в сериализаторе.
    def validate_token(self, token_value):
        try:
            token = RegistrationToken.objects.get(token=token_value)
            if token.is_expired():
                raise ValidationError("Token expired")
            return token
        except RegistrationToken.DoesNotExist:
            raise ValidationError("Token does not exist or already used")



class AuthTokenSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def validate_token(self, token):
        try:
            return Token.objects.get(key=token)
        except Token.DoesNotExist:
            raise ValidationError("Invalid credentials")





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



from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from cinema import settings
from webapp.models import Movie, Category, Hall, Seat, Show, Book, Discount, Ticket, RegistrationToken
from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from api_v1.serializers import MovieCreateSerializer, MovieDisplaySerializer, \
    CategorySerializer, HallSerializer, SeatCreateSerializer, SeatDisplaySerializer,\
    ShowCreateSerializer, ShowDisplaySerializer, BookCreateSerializer, BookDisplaySerializer,\
    DiscountSerializer, TicketCreateSerializer, TicketDisplaySerializer, UserSerializer,\
    UserRegisterSerializer, RegistrationTokenSerializer, AuthTokenSerializer
# AllowAny позволяет разрешить доступ в view всем пользователям,
# IsAuthenticated - аутентифицированным, IsAdminUser - админам
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
# стандартная view для метода Create
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token




# создаем представление для логина, наследуя его от стандартного класса ObtainAuthToken
# в нем будет возвращаться токен и данные о пользователе
class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })


# Если нам не нужна аутентификация на сайте, подключаем базовый класс NoAuthViewSet,
# который отключает все проверки аутентификации,
# и наследуем все классы ViewSet от него, например: class MovieViewSet(NoAuthViewSet)
# class NoAuthModelViewSet(viewsets.ModelViewSet):
#     authentication_classes = []


class TokenLoginView(APIView):
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        user = token.user
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })



# Добавляем требование аутентификации ко всем представлениям в API
# ________________________________________________________________
# По умолчанию классы аутентификации берутся из настроек DRF, в которых прописан класс TokenAuthentication.
# Вместо этого свойства можно добавить свойство permission_classes,
# которое содержит список классов для проверки разрешений на доступ к ViewSet'у, в т.ч. необходимость аутентификации:
class BaseViewSet(viewsets.ModelViewSet):
    # Метод, который отвечает за проверку разрешений на доступ к данному ViewSet
    def get_permissions(self):
        permissions = super().get_permissions()
        # IsAuthenticated - класс разрешения, требующий аутентификацию
        # добавляем его объект IsAuthenticated() к разрешениям только
        # для "опасных" методов - добавление, редактирование, удаление данных
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated()),
            permissions.append(IsAdminUser())
        return permissions

# если мы хотим, чтобы аутентификация требовалась для всех действий с ресурсами нашего API, включая просмотр,
# то вместо предыдущего варианта пишем:
# class BaseViewSet(viewsets.ModelViewSet):
#     permission_classes = (IsAuthenticated, )
# здесь добавляется сам класс - IsAuthenticated, а не объект класса ( IsAuthenticated() )



class MovieViewSet(BaseViewSet):
    queryset = Movie.objects.active()

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


    # переопределяем набор данных (queryset) для создания возможности фильтрации
    # фильтрация будет сделана из реакта, данные для нее передаются в URL get-запроса после "?"
    # URL + '?movie_id=' + match_params_id + '&min_start_date=' + current_date + '&max_start_date=' + next_date
    def get_queryset(self):
        queryset = Movie.objects.active()
        # movie_id = self.request.query_params.get('id', None)
        # принимает параметры запроса (query_params), возвращает None если их нет
        min_release_date = self.request.query_params.get('release_date', None)
        if min_release_date is not None:
            queryset = queryset.filter(release_date__gte=min_release_date).order_by('-release_date')
        return queryset
    # другой способ фильтрации - использование filter вместо перелпределения queryset


    # метод, который выполняет удаление объекта instance.
    # здесь он переопределён для "мягкого" удаления объектов -
    # вместо реального удаления объекта, меняется его свойство is_deleted на True.
    # сам фильм сохраняется в базе, но при этом помечается, как удалённый.
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()



class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.active().order_by('-name')
    serializer_class = CategorySerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class HallViewSet(BaseViewSet):
    queryset = Hall.objects.active().order_by('-name')
    serializer_class = HallSerializer

    def get_queryset(self):
        queryset = Hall.objects.active()
        hall_id = self.request.query_params.get('id', None)
        # задаем минимальную дату начала проката (чтобы затем вывести даты позже этой)
        # если минимальная дата поступила из запроса, то выводим показы, у которых дата больше (start_time__gte)
        if hall_id is not None:
            queryset = queryset.filter(hall_id=id).active().order_by('-id')
        return queryset


    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class SeatViewSet(BaseViewSet):
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


class ShowViewSet(BaseViewSet):
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
        queryset = Show.objects.active()
        movie_id = self.request.query_params.get('movie_id', None)
        # задаем минимальную дату начала проката (чтобы затем вывести даты позже этой)
        min_start_date = self.request.query_params.get('min_start_date', None)
        max_start_date = self.request.query_params.get('max_start_date', None)
        # если минимальная дата поступила из запроса, то выводим показы, у которых дата больше (start_time__gte)
        if movie_id is not None or min_start_date is not None or max_start_date is not None:
            queryset = queryset.filter(movie__id=movie_id, start_time__gte=min_start_date,
                                       start_time__lte=max_start_date).order_by('start_time')
        return queryset



class BookViewSet(BaseViewSet):
    queryset = Book.objects.active().order_by('-status')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BookDisplaySerializer
        else:
            return BookCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class DiscountViewSet(BaseViewSet):
    queryset = Discount.objects.active().order_by('-name')
    serializer_class = DiscountSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class TicketViewSet(BaseViewSet):
    queryset = Ticket.objects.active().order_by('-discount')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TicketDisplaySerializer
        else:
            return TicketCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()






# класс для создания нового пользователя
class UserCreateView(CreateAPIView):
    model = User
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


    # perform_create - встроенный метод CreateAPIView,
    # в котором выполняется сохранение нового ресурса в БД.
    # переопределяем его, чтобы добавить создание токена и отправку email
    def perform_create(self, serializer):
        # после создания пользователя
        user = serializer.save()
        # сохраняем токен
        token = self.create_token(user)
        # отправляем email
        self.send_registration_email(user, token)

    # токен достаточно создать в БД через свою модель
    def create_token(self, user):
        return RegistrationToken.objects.create(user=user)

    # генерируем url активации (HOST_URL - это ссылка на базовый URL фронтенда,
    # прописанный в settings.py или в settings_local.py) с токеном и вместе с
    # пояснительным текстом отправляем на email только что созданному пользователю.
    def send_registration_email(self, user, token):
        url = '%s/register/activate/?token=%s' % (settings.HOST_URL, token)
        email_text = "Your account was successfully created.\nPlease, follow the link to activate:\n\n%s" % url
        user.email_user("Registration at Cinema-App", email_text, settings.EMAIL_DEFAULT_FROM)


# Представление на базе GenericAPIView, которое принимает POST-запрос с токеном,
# десериализует его, получает токен и активирует пользователя, связанного с этим токеном.
# После активации токен удаляется, поэтому повторный запрос приводит к ошибке ObjectDoesNotExist,
# в результате обработки которой возвращается ответ 404.
class UserActivateView(GenericAPIView):
    serializer_class = RegistrationTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # активация пользователя
        user = self.perform_user_activation(serializer)
        # создание токена аутентификации и ответа, как в LoginView.
        auth_token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': auth_token.key,
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })

    # за активацию пользователя и удаление токена отвечает этот метод
    # (такого метода в view-set'ах нет, мы его сами написали и выбрали название).
    def perform_user_activation(self, serializer):
        token = serializer.validated_data.get('token')
        user = token.user
        user.is_active = True
        user.save()
        token.delete()
        return user

########  ЗАМЕНЕН НА UserViewSet ########################

# # класс для показа личного кабинета юзера (и редактирования информации о нем)
# # подключаем отдельный сериалайзер для редактирования информации (UserUpdateSerializer), без него пароль не меняется
# class UserDetailView(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#
#     model = User
#     serializer_class = UserUpdateSerializer
#     permission_classes = [IsAuthenticated]



class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated())
        return permissions

    # Метод, который проверяет права доступа к объекту - запрошенному ресурсу
    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        # если метод запроса связан с редактированием или удалением
        # и объект - это не текущий пользователь (т.е. пользователь пытается
        # редактировать чужую страницу) то запрещаем доступ.
        print(obj, request.user, '===')
        if request.method in ['PUT', 'PATCH', 'DELETE'] and obj != request.user:
            self.permission_denied(request, 'Can not edit other users data!')



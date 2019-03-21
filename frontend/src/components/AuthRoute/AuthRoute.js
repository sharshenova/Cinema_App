import React from 'react'
import {Redirect, Route} from 'react-router'


// AuthRoute - свой класс, который мы написали, чтобы проверять аутентифицирован ли пользователь, и используем вместо Route
// если токен приходит из localStorage по нашему запросу, значит пользователь авторизован -->
// осуществляем переход на запрашиваемую страницу, передавая нужные параметры во встроенный компонент Route

// если токен не приходит - отправляем пользователя на страницу "/login", при этом через state передаем путь,
// по которому пользователь хотел перейти (он сможет по нему перейти после отправки логина-пароля - свойство "next")

// props.location - это объект, хранящий текущее местоположение и его свойства
// props.location.pathname - путь до этого местоположения (содержит первый '/' после хоста и последующий текст)

// вообще location может принимать такие свойства, как путь - pathname, search - строка запроса (querystring),
// state - дополнительные данные для передачи на страницу.

const AuthRoute = (props) => {
    if(localStorage.getItem('auth-token')) {
        return <Route {...props} />
    } else {
        return <Redirect to={{
            pathname: "/login",
            state: {next: props.location.pathname}
        }}/>
    }
};

export default AuthRoute;
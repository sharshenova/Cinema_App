import React, {Component, Fragment} from 'react'
import {LOGIN_URL, REGISTER_ACTIVATE_URL} from "../../../api-urls";
import axios from 'axios';


class RegisterActivate extends Component {
    state = {
        error: null,
        success: null
    };


    performLogin = (username, password) => {
        axios.post(LOGIN_URL, {username, password}).then(response => {
            console.log(response);
            localStorage.setItem('auth-token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('is_admin', response.data.is_admin);
            localStorage.setItem('is_staff', response.data.is_staff);
            this.props.history.replace('/');
        }).catch(error => {
            console.log(error);
            console.log(error.response);
            this.props.history.replace({
                pathname: '/login/',
                state: {next: '/'}
            });
        })
    };

    componentDidMount() {
        // Чтобы достать токен из строки запроса, нужно её распарсить в объект URLSearchParams.
        const urlParams = new URLSearchParams(this.props.location.search);
        // Запрос делается только если токен есть.
        if(urlParams.has('token')) {
            const data = {token: urlParams.get('token')};
            axios.post(REGISTER_ACTIVATE_URL, data).then(response => {
                console.log(response);
                // обновляем state для вывода сообщения об успешном входе.
                this.setState({error: null, success: true});
                // в state этой страницы нет логина и пароля для входа, поэтому для автовхода
                // их приходится передавать на эту страницу через localStorage или cookie
                // т.к. в localStorage может иметь доступ любой js на странице,
                // более безопасным вариантом будет автовход со стороны API
                // или перекидывание на страницу входа для ручного входа.
                const username = localStorage.getItem('username');
                const password = localStorage.getItem('password');
                // очищаем localStorage
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                // выполняем вход (эта функция переехала сюда из Register.js)
                this.performLogin(username, password);

            }).catch(error => {
                // иначе выводим ошибку.
                console.log(error);
                console.log(error.response);
                this.setState({error: error.response.data.token[0], success: null});
            })
        }
    }

    render() {
        const urlParams = new URLSearchParams(this.props.location.search);
        return <Fragment>
            <h2 className="mt-3">Активация пользователя</h2>
            {/* Если токен есть, просим подождать, пока выполняется запрос */}
            {urlParams.has('token') ? <Fragment>
                {/* Если нет ошибки и активация не завершена, просим подождать. */}
                {!this.state.success && !this.state.error ? <p>Подтверждается активация, подождите...</p> : null}
                {/* Сообщение в случае успешной активации. */}
                {this.state.success ? <p>Регистрация завершена. Выполняется вход</p> : null}
                {/* В случае ошибки выводим ошибку. */}
                {this.state.error ? <Fragment>
                    <p>Во время активации произошла ошибка:</p>
                    <p className="text-danger">{this.state.error}</p>
                    <p>Попробуйте позже или обратитесь к администратору сайта.</p>
                </Fragment> : null}
            </Fragment> : <Fragment>
                {/* Если токена нет, просим пользователя проверить свою почту. */}
                <p>На вашу почту, указанную при регистрации, было выслано письмо для подтверждения регистрации.</p>
                <p>Для продолжения перейдите по ссылке активации, указанной в письме.</p>
            </Fragment>}
        </Fragment>
    }
}


export default RegisterActivate;
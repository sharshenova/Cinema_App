import React, {Component, Fragment} from 'react'
import {REGISTER_ACTIVATE_URL} from "../../../api-urls";
import axios from 'axios';


class RegisterActivate extends Component {
    state = {
        error: null,
    };

    componentDidMount() {
        // Чтобы достать токен из строки запроса, нужно её распарсить в объект URLSearchParams.
        const urlParams = new URLSearchParams(this.props.location.search);
        // Запрос делается только если токен есть.
        if(urlParams.has('token')) {
            const data = {token: urlParams.get('token')};
            axios.post(REGISTER_ACTIVATE_URL, data).then(response => {
                console.log(response);
                // теперь при успешном запросе API сразу присылает в UI
                // все необходимые данные, включая токен авторизации.
                localStorage.setItem('auth-token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('is_admin', response.data.is_admin);
                localStorage.setItem('is_staff', response.data.is_staff);
                this.props.history.replace('/');

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
                {/* если есть ошибка, выводим её */}
                {this.state.error ? <Fragment>
                    <p>Во время активации произошла ошибка:</p>
                    <p className="text-danger">{this.state.error}</p>
                    <p>Попробуйте позже или обратитесь к администратору сайта.</p>
                </Fragment> : <p>Подтверждается активация, подождите...</p>}}
            </Fragment> : <Fragment>
                {/* Если токена нет, просим пользователя проверить свою почту. */}
                <p>На вашу почту, указанную при регистрации, было выслано письмо для подтверждения регистрации.</p>
                <p>Для продолжения перейдите по ссылке активации, указанной в письме.</p>
            </Fragment>}
        </Fragment>
    }
}


export default RegisterActivate;
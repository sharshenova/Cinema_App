import React, {Component, Fragment} from 'react';
import {LOGIN_URL} from "../../api-urls";
import axios from 'axios';


class Login extends Component {
    state = {
        credentials: {
            username: "",
            password: ""
        },
        errors: {}
    };

    formSubmitted = (event) => {
        event.preventDefault();
        // отправляем запрос с данными: логин и пароль
        return axios.post(LOGIN_URL, this.state.credentials).then(response => {
            console.log(response);
            // сохраняем полученный токен в localStorage (первый агрумент - название нашего токена, второй - значение),
            // чтобы он был доступен на других страницах, представленных другими компонентами.
            // Также токен можно хранить в cookie страницы
            localStorage.setItem('auth-token', response.data.token);
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('is_admin', response.data.is_admin);
            localStorage.setItem('is_staff', response.data.is_staff);

            // если location содержит информацию о следующей странице, переходим на нее
            // если нет, идем назад (на ту страницу, откуда пользователь открыл форму логина)

            // this.props.location.state.next - путь, по которому пользователь хотел перейти (мы записали его в state
            // до того, как перенаправили неавторизованного пользователя на страницу авторизации)
            if (this.props.location.state) {
                this.props.history.replace(this.props.location.state.next);
            } else {
                this.props.history.goBack();
            }
        // Если отправить запрос с данными несуществующего или неактивного пользователя, вернется ответ со статусом 400,
        // запрос с таким статусом при обработке попадает в блок catch, в объект error.
            // Во время обработки достаем его и считываем из него данные через error.response.data.
        }).catch(error => {
            console.log(error, 'error');
            console.log(error.response, 'error.response');
            this.setState({
                ...this.state,
                errors: error.response.data
            })
        });
    };

    inputChanged = (event) => {
        this.setState({
            ...this.state,
            credentials: {
                ...this.state.credentials,
                [event.target.name]: event.target.value
            }
        })
    };

    // принимает имя поля (или 'non_field_errors' -  если ошибка связана не с конкретным полем, а с общей логикой формы)
    // и возвращает список элементов разметки для соответствующего набора сообщений, если они есть
    showErrors = (name) => {
        console.log(this.state.errors, 'error_info');
        if(this.state.errors && this.state.errors[name]) {
            return this.state.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };

    render() {
        const {username, password} = this.state.credentials;
        return <Fragment>
            <h2>Вход</h2>
            <form onSubmit={this.formSubmitted}>
                {/*Используем метод showErrors для вывода ошибок в разметке*/}
                {this.showErrors('non_field_errors')}
                <div className="form-row">
                    <label className="font-weight-bold">Имя пользователя</label>
                    <input type="text" className="form-control" name="username" value={username}
                           onChange={this.inputChanged}/>
                    {this.showErrors('username')}
                </div>
                <div className="form-row">
                    <label className="font-weight-bold">Пароль</label>
                    <input type="password" className="form-control" name="password" value={password}
                           onChange={this.inputChanged}/>
                    {this.showErrors('password')}
                </div>
                <button type="submit" className="btn btn-primary mt-2">Войти</button>
            </form>
        </Fragment>
    }
}


export default Login;
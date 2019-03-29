import React, {Component, Fragment} from 'react';
import {LOGIN_URL, REGISTER_URL} from "../../api-urls";
import axios from 'axios';


class Register extends Component {
    state = {
        user: {
            username: "",
            password: "",
            passwordConfirm: "",
            email: "",
        },
        errors: {}
    };

    // вызываем этот метод, если запрос на регистрацию пользователя прошел удачно
    // отправляем в запросе данные пользователя (username и password) для того, чтобы залогинить его
    performLogin = (username, password) => {
        axios.post(LOGIN_URL, {username, password}).then(response => {
            console.log(response);
            // сохраняем полученные в ответе данные в localStorage
            localStorage.setItem('auth-token', response.data.token);
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('is_admin', response.data.is_admin);
            localStorage.setItem('is_staff', response.data.is_staff);
            // перекидываем зарегестрированного пользователя на главную страницу
            this.props.history.replace('/');
        }).catch(error => {
            console.log(error);
            console.log(error.response);
            // в случае ошибки (не удалось получить данные пользователя), посетителя перекидывает на страницу входа
            // а после введения верного логина-пароля он будет перенаправлен на главную (next: '/')
            this.props.history.replace({
                pathname: '/login/',
                state: {next: '/'}
            });
        })
    };

    // Совпадение паролей требуется проверять и перед отправкой запроса,
    // иначе даже при наличии ошибки "Пароли не совпадают", форма все равно может быть отправлена
    passwordsMatch = () => {
        const {password, passwordConfirm} = this.state.user;
        return password === passwordConfirm
    };

    // событие вызывается при отправке формы регистрации
    formSubmitted = (event) => {
        event.preventDefault();
        // если введенные пароли совпадают
        if (this.passwordsMatch()) {
            // распаковываем данные всех полей, кроме подтверждения пароля
            const {passwordConfirm, ...restData} = this.state.user;
            const {username, password} = this.state.user;
            return axios.post(REGISTER_URL, restData).then(response => {
                console.log(response);
                // если запрос прошел удачно,
                this.performLogin(username, password);
            // если при запросе произошла ошибка, записываем ее в массив ошибок в стейт
            }).catch(error => {
                console.log(error);
                console.log(error.response);
                this.setState({
                    ...this.state,
                    errors: error.response.data
                })
            });
        }
    };

    // записываем в стейт изменения в полях, внесенные пользователем (событие OnChange)
    // берем event.target.name из поля "name", а event.target.value - из поля "value" в форме ввода данных
    inputChanged = (event) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                [event.target.name]: event.target.value
            }
        })
    };

    // вызывается при изменении поля "Подтверждение пароля"
    // берем новый введенный пароль и сравниваем с полем "Пароль"
    passwordConfirmChange = (event) => {
        this.inputChanged(event);
        const password = this.state.user.password;
        const passwordConfirm = event.target.value;
        // если введенные пароли совпадают, то ничего не записываем в ошибки, если нет, то пишем 'Пароли не совпадают'
        const errors = (password === passwordConfirm) ? [] : ['Пароли не совпадают'];
        // записываем ошибки в стейт
        this.setState({
            errors: {
                ...this.state.errors,
                passwordConfirm: errors
            }
        });
    };

    // показываем ошибки заполенния формы (до ее отправки)
    // если есть ошибки в данном поле, то выводим сообщение возле этого поля (ошибки записываются в виде списка)
    showErrors = (name) => {
        if(this.state.errors && this.state.errors[name]) {
            return this.state.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };

    render() {
        const {username, password, passwordConfirm, email} = this.state.user;
        return <Fragment>
            <h2 className='mt-3'>Регистрация</h2>
            <form onSubmit={this.formSubmitted}>
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
                <div className="form-row">
                    <label className="font-weight-bold">Подтверждение пароля</label>
                    <input type="password" className="form-control" name="passwordConfirm" value={passwordConfirm}
                           // блокирование вставки в поле для подтверждения пароля во время регистрации:
                           onPaste={event => event.preventDefault()}
                           onChange={this.passwordConfirmChange}/>
                    {this.showErrors('passwordConfirm')}
                </div>
                <div className="form-row">
                    <label>E-mail</label>
                    <input type="email" className="form-control" name="email" value={email}
                           onChange={this.inputChanged}/>
                    {this.showErrors('email')}
                </div>
                <button type="submit" className="btn btn-primary mt-2">Зарегистрироваться</button>
            </form>
        </Fragment>
    }
}


export default Register;
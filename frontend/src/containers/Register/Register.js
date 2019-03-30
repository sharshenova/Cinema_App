import React, {Component, Fragment} from 'react';
import {REGISTER_URL} from "../../api-urls";
import axios from 'axios';


class Register extends Component {
    state = {
        user: {
            username: "",
            password: "",
            password_confirm: "",
            email: "",
        },
        errors: {}
    };


    // событие вызывается при отправке формы регистрации
    formSubmitted = (event) => {
        event.preventDefault();
        // теперь повторный пароль пользователя проверяется со стороны API,
        // и запрос можно отправить в любом случае, а также не нужно удалять
        // поле password_confirm из данных.
        return axios.post(REGISTER_URL, this.state.user).then(response => {
            console.log(response);
            // теперь вместо автовхода следует перекинуть пользователя на страницу активации
            this.props.history.replace('/register/activate');
        }).catch(error => {
            console.log(error);
            console.log(error.response);
            this.setState({
                ...this.state,
                errors: error.response.data
            })
        });
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
        });
    };

    // показываем ошибки заполенния формы (до ее отправки)
    // если есть ошибки в данном поле, то выводим сообщение возле этого поля (ошибки записываются в виде списка)
    showErrors = (name) => {
        if (this.state.errors && this.state.errors[name]) {
            return this.state.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
    };

    render() {
        const {username, password, password_confirm, email} = this.state.user;
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
                    {/* валидация совпадения паролей со стороны UI теперь больше не требуется, */}
                    {/* т.к. она выполняется в API, и можно использовать обычный inputChanged. */}
                    <label className="font-weight-bold">Подтверждение пароля</label>
                    <input type="password" className="form-control" name="password_confirm" value={password_confirm}
                           // блокирование вставки в поле для подтверждения пароля во время регистрации:
                           onPaste={event => event.preventDefault()}
                           onChange={this.inputChanged}/>
                    {this.showErrors('passwordConfirm')}
                </div>
                <div className="form-row">
                     <label className="font-weight-bold">E-mail</label>
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
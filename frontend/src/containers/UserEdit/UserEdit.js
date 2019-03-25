import React, {Component, Fragment} from 'react'
import axios from "axios";
import {USERS_URL} from "../../api-urls";
import UserForm from "../../components/UserForm/UserForm";


class UserEdit extends Component {
    state = {
        // исходные данные фильма, загруженные из API.
        user: null,

        // сообщение об ошибке
        errors: {}

    };

    componentDidMount() {
        // match.params - переменные из пути к этому компоненту
        // match.params.id - значение переменной, обозначенной :id в свойстве path Route-а.
        axios.get(USERS_URL + this.props.match.params.id, {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                const user = response.data;
                console.log(user);
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.user = user;
                    return newState;
                });
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            });
    }

    // вывод сообщение об ошибке
    showErrorAlert = (error) => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.alert = {type: 'danger', message: `User was not added!`};
            return newState;
        });
    };

    // сборка данных для запроса
    gatherFormData = (user) => {
        let formData = new FormData();
        Object.keys(user).forEach(key => {
            const value = user[key];
            if (value) {
                if(Array.isArray(value)) {
                    // для полей с несколькими значениями (категорий)
                    // нужно добавить каждое значение отдельно
                    value.forEach(item => formData.append(key, item));
                } else {
                    formData.append(key, value);
                }
            }
        });
        return formData;
    };

    // обработчик отправки формы
    formSubmitted = (user) => {
        // сборка данных для запроса
        const formData = this.gatherFormData(user);
        const id = localStorage.getItem('id');

        // отправка запроса с токеном
        return axios.put(USERS_URL + id + '/', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                // при успешном создании response.data содержит данные фильма
                const user = response.data;
                console.log(user);
                // если всё успешно, переходим на просмотр страницы фильма с id,
                // указанным в ответе
                this.props.history.replace('/users/' + user.id);
            })
            .catch(error => {
                console.log(error, 'error');
                console.log(error.response, 'error.response');
                this.showErrorAlert(error);
                this.setState({
                    ...this.state,
                    errors: error.response.data
                });
            });
    };

    render() {
        const {errors, user} = this.state;
        return <Fragment>
            {user ? <UserForm errors={errors}  onSubmit={this.formSubmitted} user={user}/> : null}
        </Fragment>
    }
}


export default UserEdit;
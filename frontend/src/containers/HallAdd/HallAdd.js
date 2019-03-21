import React, {Component, Fragment} from 'react';
import {HALLS_URL} from "../../api-urls";
import axios from 'axios';
import HallForm from "../../components/HallForm/HallForm";


class HallAdd extends Component {
    state = {
        // сообщение об ошибке
        errors: {}
    };

    // сборка данных для запроса
    gatherFormData = (hall) => {
        let formData = new FormData();
        Object.keys(hall).forEach(key => {
            const value = hall[key];
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
    formSubmitted = (hall) => {
        // сборка данных для запроса
        const formData = this.gatherFormData(hall);

        // отправка запроса
        return axios.post(HALLS_URL, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                // при успешном создании response.data содержит данные зала
                const hall = response.data;
                console.log(hall);
                // если всё успешно, переходим на просмотр страницы фильма с id,
                // указанным в ответе
                this.props.history.replace('/halls/' + hall.id);
            })
            .catch(error => {
                console.log(error, 'error');
                console.log(error.response, 'error.response');
                this.setState({
                    ...this.state,
                    errors: error.response.data
                });
            });
    };

    render() {
        return <Fragment>
            <HallForm errors={this.state.errors} onSubmit={this.formSubmitted}/>
        </Fragment>
    }
}


export default HallAdd;
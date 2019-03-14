import React, {Component, Fragment} from 'react'
import axios from "axios";
import {HALLS_URL} from "../../api-urls";
import HallForm from "../../components/HallForm/HallForm";


class HallEdit extends Component {
    state = {
        // исходные данные фильма, загруженные из API.
        hall: null,

        // сообщение об ошибке
        alert: null,
    };

    componentDidMount() {
        // match.params - переменные из пути к этому компоненту
        // match.params.id - значение переменной, обозначенной :id в свойстве path Route-а.
        axios.get(HALLS_URL + this.props.match.params.id)
            .then(response => {
                const hall = response.data;
                console.log(hall);
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.hall = hall;
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
            newState.alert = {type: 'danger', message: `Hall was not added!`};
            return newState;
        });
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
        return axios.put(HALLS_URL + this.props.match.params.id + '/', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                // при успешном создании response.data содержит данные фильма
                const hall = response.data;
                console.log(hall);
                // если всё успешно, переходим на просмотр страницы фильма с id,
                // указанным в ответе
                this.props.history.replace('/halls/' + hall.id);
            })
            .catch(error => {
                console.log(error);
                // error.response - ответ с сервера
                // при ошибке 400 в ответе с сервера содержатся ошибки валидации
                // пока что выводим их в консоль
                console.log(error.response);
                this.showErrorAlert(error.response);
            });
    };

    render() {
        const {alert, hall} = this.state;
        return <Fragment>
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            {hall ? <HallForm onSubmit={this.formSubmitted} hall={hall}/> : null}
        </Fragment>
    }
}


export default HallEdit;
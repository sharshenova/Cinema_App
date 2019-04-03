import React, {Component, Fragment} from 'react';
import {MOVIES_URL} from "../../api-urls";
import axios from 'axios';
import MovieForm from "../../components/MovieForm/MovieForm";


class MovieAdd extends Component {
    state = {
        errors: {}
    };


    // сборка данных для запроса
    gatherFormData = (movie) => {
        let formData = new FormData();
        Object.keys(movie).forEach(key => {
            const value = movie[key];
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
    formSubmitted = (movie) => {
        // сборка данных для запроса
        const formData = this.gatherFormData(movie);

        // отправка запроса
        // заголовок Authorization следует указывать во всех запросах к ресурсам в API,
        // которые выполняются методами POST, PUT, PATCH и DELETE - изменение и удаление фильмов, залов и т.д.
        // он не даст отправить форму неавторизованному пользователю
        return axios.post(MOVIES_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                // при успешном создании response.data содержит данные фильма
                const movie = response.data;
                console.log(movie);
                // если всё успешно, переходим на просмотр страницы фильма с id,
                // указанным в ответе
                this.props.history.replace('/movies/' + movie.id);
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
            <MovieForm errors={this.state.errors} onSubmit={this.formSubmitted}/>
        </Fragment>
    }
}


export default MovieAdd;
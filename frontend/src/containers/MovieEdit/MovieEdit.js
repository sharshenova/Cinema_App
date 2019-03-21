import React, {Component, Fragment} from 'react'
import axios from "axios";
import {MOVIES_URL} from "../../api-urls";
import MovieForm from "../../components/MovieForm/MovieForm";


class MovieEdit extends Component {
    state = {
        // исходные данные фильма, загруженные из API.
        movie: null,
        errors: {}
    };

    componentDidMount() {
        // match.params - переменные из пути к этому компоненту
        // match.params.id - значение переменной, обозначенной :id в свойстве path Route-а.
        axios.get(MOVIES_URL + this.props.match.params.id)
            .then(response => {
                const movie = response.data;
                console.log(movie);
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.movie = movie;
                    newState.movie.categories = movie.categories.map(category => category.id);
                    return newState;
                });
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            });
    }

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
        return axios.put(MOVIES_URL + this.props.match.params.id + '/', formData, {
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
        const {errors, movie} = this.state;
        console.log(this.state, 'movie_edit render');
        return <Fragment>
            {movie ? <MovieForm onSubmit={this.formSubmitted} movie={movie} errors={errors}/> : null}
        </Fragment>
    }
}


export default MovieEdit;
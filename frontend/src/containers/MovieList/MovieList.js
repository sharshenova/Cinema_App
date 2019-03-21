import React, {Fragment, Component} from 'react'
import {MOVIES_URL} from "../../api-urls";
import MovieCard from "../../components/MovieCard/MovieCard";
import {NavLink} from "react-router-dom";
import axios from 'axios';


// компонент для показа списка фильмов клиенту
// фильмы запрашиваются из API в момент показа компонента на странце (mount)
class MovieList extends Component {
    state = {
        movies: [],
        alert: null
    };

    componentDidMount() {
        // требуем авторизацию
        // const headers = {
        //     Autorization: 'Token' + localStorage.getItem('auth-token')
        // };

        // axios.get(MOVIES_URL, {headers})

        axios.get(MOVIES_URL)
            .then(response => {console.log(response.data); return response.data;})
            .then(movies => this.setState({movies}))
            .catch(error => console.log(error));
    }

    // принимает имя поля (или 'non_field_errors' -  если ошибка связана не с конкретным полем, а с общей логикой формы)
    // и возвращает список элементов разметки для соответствующего набора сообщений, если они есть
    showErrors = (name) => {
        console.log(this.state.errors, 'error_info');
        if(this.state.errors && this.state.errors[name]) {
            return this.state.errors[name].map((error, index) => <p className="text-danger" key={index}>{error[name]}</p>);
        }
        return null;
    };

    movieDeleted = (movieId) => {
        if (!localStorage.getItem('auth-token')) {
            this.props.history.push("/login");
        }
        axios.delete(MOVIES_URL + movieId + '/', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
        .then(response => {
            console.log(response.data);
            this.setState(prevState => {
                let newState = {...prevState};
                let movies = [...newState.movies];
                let movieIndex = movies.findIndex(movie => movie.id === movieId);
                movies.splice(movieIndex, 1);
                newState.movies = movies;
                return newState;
            })
        })
        .catch(error => {
        console.log(error);
        let alert = {type: 'danger', message: `Delete error!`};
        this.setState({alert: alert});
        console.log(this.state.alert);
        })
    };

    render() {

        let alert = null;
        if (this.state.alert) {
            alert = <div className={"alert alert-" + this.state.alert.type}>{this.state.alert.message}</div>
        }

        return <Fragment>
            {alert}
            <p className='mt-3'><NavLink to='/movies/add'>Добавить фильм</NavLink></p>
            <div className='row'>
                {this.state.movies.map(movie => {
                    return <div className='col-xs-12 col-sm-6 col-lg-4' key={movie.id}>
                        <MovieCard movie={movie} onDelete={() => this.movieDeleted(movie.id)}/>
                    </div>
                })}
            </div>
        </Fragment>
    }
}


export default MovieList;
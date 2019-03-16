import React, {Component} from 'react'
import {MOVIES_URL} from "../../api-urls";
import {SHOWS_URL} from "../../api-urls";
import {NavLink} from "react-router-dom";
import MovieCategories from "../../components/MovieCategories/MovieCategories";
import axios from 'axios';
import Shows from "../../components/Shows/Shows";



// компонент, который выводит одну карточку с фильмом
// фильм также загружается при выводе компонента на экран (mount),
// а не при обновлении (didUpdate), т.к. компонент выводится на отдельной странице,
// и при переключении страниц исчезает с экрана, а потом снова маунтится.
class MovieDetail extends Component {
    state = {
        movie: null,
        shows: []
    };

    componentDidMount() {
        // match - атрибут, передаваемый роутером, содержащий путь к этому компоненту
        const match_params_id = this.props.match.params.id;
        console.log(match_params_id, 'match_params');

        // текущая дата
        let current_date = new Date();
        // текущая дата в ISO-формате без времени (YYYY-mm-dd) для передачи в queryString в запросе
        current_date = current_date.toISOString().slice(0, 10);
        console.log(current_date, 'current_date');

        // следующая дата
        let next_date = new Date();
        // следующая дата (+ 3 дня)
        next_date.setDate(next_date.getDate() + 3);
        // следующая дата в ISO-формате без времени.
        next_date = next_date.toISOString().slice(0, 10);
        console.log(next_date, 'next_date');


        axios.all([
            axios.get(MOVIES_URL + match_params_id + '/'),
            axios.get(SHOWS_URL + '?movie_id=' + match_params_id + '&min_start_date=' + current_date + '&max_start_date=' + next_date)
        ])
        .then(axios.spread((movieRequest, showsRequest) => {
            this.setState({
                movie: movieRequest.data,
                shows: showsRequest.data
            });
            console.log(this.state)
        }));
    }

    movieDeleted = () => {
        axios.delete(MOVIES_URL + this.props.match.params.id)
            .then(response => {
                console.log(response.data);
                this.setState(prevState => {
                    let newState = {...prevState};
                    newState.movie = null;
                    return newState;
                });
                this.props.history.replace('/movies/');
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            })
    };

    render() {
        // если movie в state нет, ничего не рисуем.
        if (!this.state.movie) return null;
        console.log('выполняется Render первый раз');

        // достаём данные из movie
        const {name, poster, description, release_date, finish_date, categories, id} = this.state.movie;

        return <div className='movie-detail-form row'>
            <div className='col col-xs-12 col-sm-12 col-md-6'>
                {/* постер, если есть */}
                {poster ? <div className='text-center mt-3'>
                    <img className="img-fluid img-thumbnail rounded" src={poster} alt='movie_poster'/>
                </div> : null}
            </div>

            <div className='col col-xs-12 col-sm-12 col-md-6'>
                {/* название фильма */}
                <h1 className='mt-3'>{name}</h1>

                {/* категории, если указаны */}
                {categories.length > 0 ? <MovieCategories categories={categories}/> : null}

                {/* даты проката c: по: (если указано)*/}
                <p className="text-secondary">В прокате c: {release_date} до: {finish_date ? finish_date : "Неизвестно"}</p>

                {/* описание */}
                {description ? <p>{description}</p> : null}

                <div className='mb-3'>
                    {/* редактировать фильм */}
                    <NavLink to={'/movies/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

                    <button type="button" className="btn btn-danger mr-2" onClick={() => this.movieDeleted()}>Delete</button>

                    {/* назад */}
                    <NavLink to='' className="btn btn-primary">Movies</NavLink>
                </div>
            </div>

            <div>
                <Shows shows={this.state.shows}/>
            </div>
        </div>;
    }
}

export default MovieDetail;
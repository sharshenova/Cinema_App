import React, {Component} from 'react'
import {NavLink} from "react-router-dom";
import MovieCategories from "../../components/MovieCategories/MovieCategories";
import Shows from "../../components/Shows/Shows";
import {loadMovieAndShows} from "../../store/actions/movie-detail";
import {connect} from "react-redux";


// компонент, который выводит одну карточку с фильмом
// фильм также загружается при выводе компонента на экран (mount),
// а не при обновлении (didUpdate), т.к. компонент выводится на отдельной странице,
// и при переключении страниц исчезает с экрана, а потом снова маунтится.
class MovieDetail extends Component {

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

        let link = '?movie_id=' + match_params_id + '&min_start_date=' + current_date + '&max_start_date=' + next_date;
        console.log(link, 'link');

        this.props.loadMovieAndShows(match_params_id, link);
    }

    // movieDeleted = () => {
    //     if (!localStorage.getItem('auth-token')) {
    //         this.props.history.push("/login");
    //     }
    //     axios.delete(MOVIES_URL + this.props.match.params.id, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Authorization': 'Token ' + localStorage.getItem('auth-token')
    //         }
    //     })
    //     .then(response => {
    //         console.log(response.data);
    //         this.setState(prevState => {
    //             let newState = {...prevState};
    //             newState.movie = null;
    //             return newState;
    //         });
    //         this.props.history.replace('/');
    //     })
    //     .catch(error => {
    //     console.log(error);
    //     let alert = {type: 'danger', message: `Delete error!`};
    //     this.setState({alert: alert});
    //     })
    // };

    render() {
        // если movie в props нет, ничего не рисуем.
        if (!this.props.movieDetail.movie) return null;
        console.log(this.props, 'this.props');

        // достаём данные из movie
        const {name, poster, description, release_date, finish_date, categories, id} = this.props.movieDetail.movie;

        const {token, is_admin} = this.props.auth;
        console.log(this.props.auth, 'AUTH!');
        const shows = this.props.movieDetail.shows;
        console.log(shows, 'shows');

        return <div>

            <div className='movie-detail-form row'>
                <div className='col col-xs-12 col-sm-12 col-md-6'>
                    {/* постер, если есть */}
                    {poster ? <div className='row'>
                    <div className="col col-xs-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
                        <img className="img-fluid rounded" src={poster} alt={"постер"}/>
                    </div>
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

                    {token && is_admin === true ? [
                        <div className='mb-3 row'>
                            <NavLink to={'/movies/' + id + '/edit'} className="btn btn-primary mr-2">Редактировать</NavLink>
                            {/*<button type="button" className="btn btn-danger mr-2" onClick={() => this.movieDeleted()}>Delete</button>*/}
                        </div>
                    ]: null}
                </div>
            </div>

            {shows ? [<div>
                <Shows shows={shows}/>
            </div>
            ] : null}

        </div>
    }
}

// ключ movieDetail приходит из root.js
const mapStateToProps = state => {
    return {
        // movieDetail - идет в root
        movieDetail: state.movieDetail,
        auth: state.auth,  // auth нужен, чтобы получить из него токен для запроса
    }
};

// loadMovie: - передается из props, используется в componentDidMount
// loadMovie() - это вызов action из actions/movie-detail
const mapDispatchToProps = (dispatch) => ({
    loadMovieAndShows: (movie_id, shows_link) => dispatch(loadMovieAndShows(movie_id, shows_link))
});

// здесь MovieDetail - название экспортируемого компонента
export default connect(mapStateToProps, mapDispatchToProps)(MovieDetail);


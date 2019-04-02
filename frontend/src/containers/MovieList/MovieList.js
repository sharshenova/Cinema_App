import React, {Fragment, Component} from 'react'
import MovieCard from "../../components/MovieCard/MovieCard";
import {loadMovies} from "../../store/actions/movie-list";
import {connect} from 'react-redux';

// компонент для показа списка фильмов клиенту
// фильмы запрашиваются из API в момент показа компонента на странце (mount)
class MovieList extends Component {

    componentDidMount() {
        //
        this.props.loadMovies();
    }


    render() {

        return <Fragment>
            <div className='row'>
                {this.props.movies.map(movie => {
                    return <div className='col-xs-12 col-sm-6 col-lg-4' key={movie.id}>
                        <MovieCard movie={movie}/>
                    </div>
                })}
            </div>
        </Fragment>
    }
}

// ключ movieList приходит из root.js
const mapStateToProps = (state) => state.movieList;

// loadMovies - это action из actions/movie-list
const mapDispatchToProps = (dispatch) => ({
    loadMovies: () => dispatch(loadMovies())
});

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
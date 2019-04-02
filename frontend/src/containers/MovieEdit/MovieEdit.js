import React, {Component, Fragment} from 'react'
import MovieForm from "../../components/MovieForm/MovieForm";
import {loadMovie, MOVIE_EDIT_SUCCESS, saveMovie} from "../../store/actions/movie-edit";
import {connect} from "react-redux";


class MovieEdit extends Component {

    componentDidMount() {
        // вызываем loadMovie из actions/movie-edit.js
        this.props.loadMovie(this.props.match.params.id);
    }

    // обработчик отправки формы
    formSubmitted = (movie) => {
        // распаковываем auth из proms
        const {auth} = this.props;
        return this.props.saveMovie(movie, auth.token).then(result => {
            // если результат запроса удачный - переходим на страницу отредактированного фильма
            if(result.type === MOVIE_EDIT_SUCCESS) {
                this.props.history.push('/movies/' + result.movie.id);
            }
        })
    };

    render() {
        const {movie, errors} = this.props.movieEdit;
        return <Fragment>
            {/* алёрт здесь больше не выводится, вместо него вывод ошибок внутри формы */}
            {movie ? <MovieForm onSubmit={this.formSubmitted} movie={movie} errors={errors}/> : null}
        </Fragment>
    }
}


const mapStateToProps = state => {
    return {
        // movieEdit - идет в root
        movieEdit: state.movieEdit,
        auth: state.auth  // auth нужен, чтобы получить из него токен для запроса
    }
};
const mapDispatchProps = dispatch => {
    return {
        loadMovie: (id) => dispatch(loadMovie(id)),  // прокидываем id в экшен-крейтор loadMovie.
        saveMovie: (movie, token) => dispatch(saveMovie(movie, token))
    }
};

export default connect(mapStateToProps, mapDispatchProps)(MovieEdit);
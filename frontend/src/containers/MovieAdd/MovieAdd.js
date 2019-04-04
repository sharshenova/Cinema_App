import React, {Component, Fragment} from 'react';
import MovieForm from "../../components/MovieForm/MovieForm";
import {MOVIE_ADD_SUCCESS, addMovie} from "../../store/actions/movie-add";
import connect from "react-redux/es/connect/connect";

class MovieAdd extends Component {


    // обработчик отправки формы
    formSubmitted = (movie) => {

        // отправка запроса
        // распаковываем auth из proms
        const {auth} = this.props;
        console.log(auth.token, 'auth.token MovieAdd');
        return this.props.addMovie(movie, auth.token).then(result => {
            // если результат запроса удачный - переходим на страницу добавленного фильма
            if(result.type === MOVIE_ADD_SUCCESS) {
                console.log(result.movie.id, 'result.movie.id');
                this.props.history.push('/movies/' + result.movie.id);
            }
        })
    };

    render() {
        const {errors} = this.props.movieAdd;
        return <Fragment>
            <MovieForm errors={errors} onSubmit={this.formSubmitted}/>
        </Fragment>
    }
}


const mapStateToProps = state => {
    return {
        // movieAdd - идет в root
        movieAdd: state.movieAdd,
        auth: state.auth  // auth нужен, чтобы получить из него токен для запроса
    }
};
const mapDispatchProps = dispatch => {
    return {
        addMovie: (movie, token) => dispatch(addMovie(movie, token))
    }
};

export default connect(mapStateToProps, mapDispatchProps)(MovieAdd);
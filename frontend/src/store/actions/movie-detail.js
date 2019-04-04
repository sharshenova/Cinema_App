import axios from "axios";
import {MOVIES_URL} from "../../api-urls";
import {SHOWS_URL} from "../../api-urls";


export const MOVIE_LOAD_SUCCESS = "MOVIE_LOAD_SUCCESS";
export const MOVIE_LOAD_ERROR = "MOVIE_LOAD_ERROR";


export const loadMovieAndShows = (movie_id, shows_link) => {
    console.log(movie_id, shows_link, '!!!!!');
    return dispatch => {
        axios.all([
            axios.get(MOVIES_URL + movie_id + '/'),
            axios.get(SHOWS_URL + shows_link),
        ])
        .then(axios.spread((movieRequest, showsRequest) => {
            return dispatch ({type: MOVIE_LOAD_SUCCESS,
                movie: movieRequest.data,
                shows: showsRequest.data
            });
        }))
        .catch(error => {
            console.log(error);
            console.log(error.response);
            return dispatch({type: MOVIE_LOAD_ERROR, errors: error});
        })
    }
};

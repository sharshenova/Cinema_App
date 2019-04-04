import {MOVIE_LOAD_SUCCESS, MOVIE_LOAD_ERROR} from "../actions/movie-detail";

const initialState = {
    movie: null,
    shows: [],
    errors: {}
};


const movieDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case MOVIE_LOAD_SUCCESS:
            return {...state, movie: action.movie, shows: action.shows};
        case MOVIE_LOAD_ERROR:
            return {...state, errors: action.errors};
        default:
            return state
    }
};


export default movieDetailReducer;
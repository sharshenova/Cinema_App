
const initialState = {
    movies: [],
    //alert: null
};

const movieListReducer = (state = initialState, action) => {
    switch (action.type) {
        case "MOVIE_LIST_REQUEST_SUCCESS":
            // возвращаем новый стейт, action.movies приходит из actions/movie-list.js (movies: response.data)
            return {...state, movies: action.movies};
        default:
            return state;
    }
};

export default movieListReducer;

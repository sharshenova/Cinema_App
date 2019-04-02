import {combineReducers} from 'redux';
import loginReducer from "./login";
import authReducer from "./auth";
import tokenLoginReducer from "./app";
import movieListReducer from "./movie-list";
import hallListReducer from "./hall-list";
import movieEditReducer from "./movie-edit";

const rootReducer = combineReducers({
    login: loginReducer,
    auth: authReducer,
    app: tokenLoginReducer,
    movieList: movieListReducer,
    hallList: hallListReducer,
    movieEdit: movieEditReducer
});

export default rootReducer;
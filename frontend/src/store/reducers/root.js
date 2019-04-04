import {combineReducers} from 'redux';
import loginReducer from "./login";
import registerReducer from "./register";
import authReducer from "./auth";
import tokenLoginReducer from "./app";
import movieListReducer from "./movie-list";
import movieEditReducer from "./movie-edit";
import movieDetailReducer from "./movie-detail";

import hallListReducer from "./hall-list";
import hallEditReducer from "./hall-edit";
import hallDetailReducer from "./hall-detail";
import hallDeleteReducer from "./hall-delete";
import hallAddReducer from "./hall-add";




const rootReducer = combineReducers({
    login: loginReducer,
    register: registerReducer,
    auth: authReducer,
    app: tokenLoginReducer,
    movieList: movieListReducer,
    movieEdit: movieEditReducer,
    movieDetail: movieDetailReducer,

    hallList: hallListReducer,
    hallEdit: hallEditReducer,
    hallDetail: hallDetailReducer,
    hallDelete: hallDeleteReducer,
    hallAdd: hallAddReducer,
});

export default rootReducer;
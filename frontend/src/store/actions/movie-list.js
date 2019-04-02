import axios, {MOVIES_URL} from "../../api-urls";

export const MOVIE_LIST_REQUEST_SUCCESS = "MOVIE_LIST_REQUEST_SUCCESS";

// loadMovies ничего не принимает, поэтому аргументов нет
export const loadMovies = () => {
    return dispatch => {
        axios.get(MOVIES_URL)
            .then(response => {
                console.log(response.data);
                // вместо данных возвращаем объект с этими данными
                return dispatch({type: MOVIE_LIST_REQUEST_SUCCESS, movies: response.data});
            })
            // возввращаем ошибку как есть, так как она не сохраняет данные в стейт, только выводит в консоль
            .catch(error => console.log(error));
    }

};
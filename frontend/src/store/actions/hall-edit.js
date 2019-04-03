import axios from "axios";
import {HALLS_URL} from "../../api-urls";

export const HALL_EDIT_REQUEST = "HALL_EDIT_REQUEST";
export const HALL_EDIT_SUCCESS = "HALL_EDIT_SUCCESS";
export const HALL_EDIT_ERROR = "HALL_EDIT_ERROR";

export const HALL_LOAD_SUCCESS = "HALL_LOAD_SUCCESS";

export const loadHall = (id) => {
    return dispatch => {
        axios.get(HALLS_URL + id).then(response => {
            console.log(response.data);
            return dispatch({type: HALL_LOAD_SUCCESS, hall: response.data});
        }).catch(error => {
            console.log(error);
            console.log(error.response);
        });
    }
};


// этот метод не является экшеном,
// но его использует saveHall, поэтому он здесь.
const gatherFormData = (hall) => {
    let formData = new FormData();
    Object.keys(hall).forEach(key => {
        const value = hall[key];
        if (value) {
            if (Array.isArray(value)) {
                value.forEach(item => formData.append(key, item));
            } else {
                formData.append(key, value);
            }
        }
    });
    return formData;
};



export const saveHall = (hall, authToken) => {
    return dispatch => {
        const url = HALLS_URL + hall.id + '/';
        const formData = gatherFormData(hall);
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + authToken
            }
        };

        dispatch({type: HALL_EDIT_REQUEST});
        // не забываем возвращать результаты,
        // чтобы в HallEdit после успешной загрузки сделать редирект
        return axios.put(url, formData, options).then(response => {
            console.log(response, 'HALL_EDIT_SUCCESS!!!!!!!!!');
            // и здесь
            return dispatch({type: HALL_EDIT_SUCCESS, hall: response.data});
        }).catch(error => {
            console.log(error);
            console.log(error.response);
            // и здесь
            return dispatch({type: HALL_EDIT_ERROR, errors: error.response.data});
        });
    }
};


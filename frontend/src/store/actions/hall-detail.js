import axios from "axios";
import {HALLS_URL} from "../../api-urls";
import {SHOWS_URL} from "../../api-urls";


export const HALL_LOAD_SUCCESS = "HALL_LOAD_SUCCESS";
export const HALL_LOAD_ERROR = "HALL_LOAD_ERROR";


export const loadHallAndShows = (hall_id, shows_link) => {
    return dispatch => {
        axios.all([
            axios.get(HALLS_URL + hall_id + '/'),
            axios.get(SHOWS_URL + shows_link),
            console.log(SHOWS_URL + shows_link)
        ])
        .then(axios.spread((hallRequest, showsRequest) => {
            return dispatch ({type: HALL_LOAD_SUCCESS,
                hall: hallRequest.data,
                shows: showsRequest.data
            });
        }))
        .catch(error => {
            console.log(error, 'ERROR!!!');
            console.log(error);
            console.log(error.response);
            return dispatch({type: HALL_LOAD_ERROR, errors: error});
        })
    }
};


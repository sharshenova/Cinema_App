import axios from "axios";
import {HALLS_URL} from "../../api-urls";
import {SHOWS_URL} from "../../api-urls";


export const HALL_LOAD_SUCCESS = "HALL_LOAD_SUCCESS";
export const HALL_LOAD_ERROR = "HALL_LOAD_ERROR";
// export const SHOWS_LIST_REQUEST_SUCCESS = "SHOWS_LIST_REQUEST_SUCCESS";

// этот экшн можно переиспользовать в HallEdit ??????????????????????????

export const loadHall = (hall_id, shows_link) => {
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
            console.log(error);
            console.log(error.response);
            return dispatch({type: HALL_LOAD_ERROR, errors: error.response.data});
        })
    }
};



// export const loadHall = (id) => {
//     return dispatch => {
//         axios.get(HALLS_URL + id).then(response => {
//             console.log(response.data);
//             return dispatch({type: HALL_LOAD_SUCCESS, hall: response.data});
//         }).catch(error => {
//             console.log(error);
//             console.log(error.response);
//             return dispatch({type: HALL_LOAD_ERROR, errors: error.response.data});
//         });
//     }
// };



// export const loadHall = (id) => {
//     return dispatch => {
//         axios.get(HALLS_URL + id).then(response => {
//             console.log(response.data);
//             return dispatch({type: HALL_LOAD_SUCCESS, hall: response.data});
//         })
//             .then(response => {
//                 return dispatch => {
//                 axios.get(SHOWS_URL)
//                     .then(response => {
//                         console.log(response.data, 'axios');
//                         return dispatch({type: SHOWS_LIST_REQUEST_SUCCESS, shows: response.data});
//                     })
//                     .catch(error => console.log(error));
//             }})
//             .catch(error => {
//             console.log(error);
//             console.log(error.response);
//         });
//     }
// };



// export const loadShows = () => {
//     return dispatch => {
//         axios.get(SHOWS_URL)
//             .then(response => {
//                 console.log(response.data, 'axios');
//                 return dispatch({type: SHOWS_LIST_REQUEST_SUCCESS, halls: response.data});
//             })
//             .catch(error => console.log(error));
//     }
// };


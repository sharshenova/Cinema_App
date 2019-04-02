import {HALL_LOAD_SUCCESS, HALL_LOAD_ERROR} from "../actions/hall-detail";

const initialState = {
    hall: null,
    shows: [],
    errors: {}
};


const hallDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case HALL_LOAD_SUCCESS:
            return {...state, hall: action.hall, shows: action.shows};
        case HALL_LOAD_ERROR:
            return {...state, errors: action.errors};
        default:
            return state
    }
};


export default hallDetailReducer;

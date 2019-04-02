
const initialState = {
    halls: [],
};

const hallListReducer = (state = initialState, action) => {
    switch (action.type) {
        case "HALL_LIST_REQUEST_SUCCESS":
            // возвращаем новый стейт, action.halls приходит из actions/hall-list.js (halls: response.data)
            return {...state, halls: action.halls};
        default:
            return state;
    }
};

export default hallListReducer;
export const LOGOUT = "LOGOUT";

// с выходом всё проще, т.к. он не делает запросов.
export const logout = () => {
    return dispatch => {
        // удаляется auth-token из localStorage при выходе
        localStorage.removeItem('auth-token');
        dispatch({type: LOGOUT});
    };
};
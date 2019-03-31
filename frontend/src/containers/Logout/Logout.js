import React, {Component} from 'react';

// для выхода достаточно удалить токен из localStorage со стороны клиента
// и вернуться на главную страницу
class Logout extends Component {
    componentDidMount() {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('is_staff');
        this.props.history.replace('/');
    };

    render() { return null; }
}

export default Logout;

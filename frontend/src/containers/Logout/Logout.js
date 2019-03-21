import React, {Component} from 'react';

// для выхода достаточно удалить токен из localStorage со стороны клиента
// и вернуться на главную страницу
class Logout extends Component {
    componentDidMount() {
        localStorage.removeItem('auth-token');
        this.props.history.push('/');
    };

    render() { return null; }
}

export default Logout;

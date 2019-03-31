import React, {Component, Fragment} from 'react'
import MenuItem from "./MenuItem/MenuItem";
import {NavLink} from "react-router-dom";


class Menu extends Component {
    state = {
        collapse: true
    };

    // активируем кнопку открытия меню (для маленьких экранов)
    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    render() {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user_id');
        const isAdmin = localStorage.getItem('is_admin');
        return <Fragment>
            <button onClick={this.toggle}
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className={(this.state.collapse ? "collapse" : "") + " navbar-collapse"}
                 id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    {/*пользователь может добавить фильм или зал, если у него есть статус админа*/}
                    <MenuItem to="/">Фильмы</MenuItem>
                    {isAdmin === "true" ? <MenuItem to="/movies/add">Добавить фильм</MenuItem> : null}
                    <MenuItem to="/halls/">Залы</MenuItem>
                    {isAdmin === "true" ? <MenuItem to="/halls/add">Добавить зал</MenuItem> : null}
                </ul>

                <ul className="navbar-nav ml-auto">
                    {username ? [
                        <li className="nav-item" key="username"><span className="navbar-text">
                            Привет, <NavLink to={"/users/" + userId}>{username}</NavLink>!
                        </span></li>,
                        <MenuItem to="/logout" key="logout">Выйти</MenuItem>
                    ] : [
                        <MenuItem to="/login" key="login">Войти</MenuItem>,
                        <MenuItem to="/register" key="register">Зарегистрироваться</MenuItem>
                    ]}
                </ul>
            </div>
        </Fragment>
    }
}


export default Menu;

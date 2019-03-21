import React, {Component, Fragment} from 'react'
import MenuItem from "./MenuItem/MenuItem";


class Menu extends Component {
    state = {
        collapse: true
    };

    // активируем кнопку открытия меню (для маленьких экранов)
    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    render() {
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
                <ul className="navbar-nav">
                    <MenuItem to="/">Фильмы</MenuItem>
                    <MenuItem to="/movies/add">Добавить фильм</MenuItem>
                    <MenuItem to="/halls/">Залы</MenuItem>
                    <MenuItem to="/halls/add">Добавить зал</MenuItem>
                    {/*запрашиваем token из localStorage, если получаем его - показываем "Выйти", если нет - "Войти"*/}
                    {localStorage.getItem('auth-token')
                        ? <MenuItem to="/logout">Выйти</MenuItem>
                        : <MenuItem to="/login">Войти</MenuItem>}
                </ul>
            </div>
        </Fragment>
    }
}


export default Menu;

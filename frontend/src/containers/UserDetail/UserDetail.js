import React, {Component} from 'react'
import {USERS_URL} from "../../api-urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';
// import Shows from "../../components/Shows/Shows";

// компонент, который выводит одну карточку с залом
// зал также загружается при выводе компонента на экран (mount),
// а не при обновлении (didUpdate), т.к. компонент выводится на отдельной странице,
// и при переключении страниц исчезает с экрана, а потом снова маунтится.
class UserDetail extends Component {
    state = {
        user: {
            username: "",
            id: "id",
            email: "",
            first_name: "",
            last_name: ""
        },
        errors: {}
    };

    componentDidMount() {

        const id = localStorage.getItem('id');

        axios.get(USERS_URL + id, {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(user => {
                this.setState({user});
            })
            .catch(error => console.log(error));
    }

    render() {
        // если hall в state нет, ничего не рисуем.
        if (!this.state.user) return null;
        console.log('выполняется Render');

        // достаём данные из hall
        const {username, id, email, first_name, last_name} = this.state.user;

        // let alert = null;
        // if (this.state.alert) {
        //     alert = <div className={"alert alert-" + this.state.alert.type}>{this.state.alert.message}</div>
        // }

        return <div>
            {/*{alert}*/}

            <h2 className='mt-3'>{username}</h2>

            {email ? <p>Email: {email}</p> : null}

            {first_name ? <p>Имя: {first_name}</p> : null}

            {last_name ? <p>Фамилия: {last_name}</p> : null}

            <div className='mb-3'>
                <NavLink to={'/users/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

                <NavLink to='/' className="btn btn-primary">На главную</NavLink>
            </div>
        </div>;
    }
}

export default UserDetail;
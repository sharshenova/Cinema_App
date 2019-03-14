import React, {Component} from 'react'
import {HALLS_URL} from "../../api-urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';

// компонент, который выводит одну карточку с залом
// зал также загружается при выводе компонента на экран (mount),
// а не при обновлении (didUpdate), т.к. компонент выводится на отдельной странице,
// и при переключении страниц исчезает с экрана, а потом снова маунтится.
class HallDetail extends Component {
    state = {
        hall: null
    };

    componentDidMount() {
        // match - атрибут, передаваемый роутером, содержащий путь к этому компоненту
        const match = this.props.match;

        // match.params - переменные из пути (:id)
        // match.params.id - значение переменной, обозначенной :id в свойстве path Route-а.
        axios.get(HALLS_URL + match.params.id)
            .then(response => {console.log(response.data); return response.data;})
            .then(hall => this.setState({hall}))
            .catch(error => console.log(error));
    }

    hallDeleted = () => {
        axios.delete(HALLS_URL + this.props.match.params.id)
            .then(response => {
                console.log(response.data);
                this.setState(prevState => {
                    let newState = {...prevState};
                    newState.hall = null;
                    return newState;
                });
                this.props.history.replace('/halls/');
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            })
    };

    render() {
        // если movie в state нет, ничего не рисуем.
        if (!this.state.hall) return null;
        console.log('выполняется Render первый раз');

        // достаём данные из movie
        const {name, description, id} = this.state.hall;

        return <div className='row'>
            <div className='col col-6'>
                {/* название зала */}
                <h1 className='mt-3'>{name}</h1>

                {/* описание */}
                {description ? <p>{description}</p> : null}

                <div className='mb-3'>
                    {/* редактировать */}
                    <NavLink to={'/halls/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

                    <button type="button" className="btn btn-danger mr-2" onClick={() => this.hallDeleted()}>Delete</button>

                    {/* назад */}
                    <NavLink to='/halls/' className="btn btn-primary">Halls</NavLink>
                </div>
            </div>
        </div>;
    }
}

export default HallDetail;
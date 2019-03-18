import React, {Component} from 'react'
import {HALLS_URL, SHOWS_URL} from "../../api-urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';
import Shows from "../../components/Shows/Shows";

// компонент, который выводит одну карточку с залом
// зал также загружается при выводе компонента на экран (mount),
// а не при обновлении (didUpdate), т.к. компонент выводится на отдельной странице,
// и при переключении страниц исчезает с экрана, а потом снова маунтится.
class HallDetail extends Component {
    state = {
        hall: null,
        shows: []
    };

    componentDidMount() {

        // match - атрибут, передаваемый роутером, содержащий путь к этому компоненту
        const match_params_id = this.props.match.params.id;
        console.log(match_params_id, 'match_params');

        // текущая дата
        let current_date = new Date();
        // текущая дата в ISO-формате без времени (YYYY-mm-dd) для передачи в queryString в запросе
        current_date = current_date.toISOString().slice(0, 10);
        console.log(current_date, 'current_date');

        // следующая дата
        let next_date = new Date();
        // следующая дата (+ 3 дня)
        next_date.setDate(next_date.getDate() + 3);
        // следующая дата в ISO-формате без времени.
        next_date = next_date.toISOString().slice(0, 10);
        console.log(next_date, 'next_date');


        axios.all([
            axios.get(HALLS_URL + match_params_id + '/'),
            axios.get(SHOWS_URL + '?movie_id=' + match_params_id + '&min_start_date=' + current_date + '&max_start_date=' + next_date)
        ])
        .then(axios.spread((hallRequest, showsRequest) => {
            this.setState({
                hall: hallRequest.data,
                shows: showsRequest.data
            });
            console.log(this.state)
        }));

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
        // если hall в state нет, ничего не рисуем.
        if (!this.state.hall) return null;
        console.log('выполняется Render первый раз');

        // достаём данные из hall
        const {name, description, id} = this.state.hall;

        return <div>
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
            <div>
                <Shows shows={this.state.shows}/>
            </div>
        </div>;
    }
}

export default HallDetail;
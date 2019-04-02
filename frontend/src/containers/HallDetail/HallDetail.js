import React, {Component} from 'react'
import {NavLink} from "react-router-dom";
import Shows from "../../components/Shows/Shows";
import {loadHall} from "../../store/actions/hall-detail";
import {connect} from "react-redux";


// компонент, который выводит одну карточку с залом
// зал также загружается при выводе компонента на экран (mount),
// а не при обновлении (didUpdate), т.к. компонент выводится на отдельной странице,
// и при переключении страниц исчезает с экрана, а потом снова маунтится.
class HallDetail extends Component {

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

        let link = '?hall_id=' + match_params_id + '&min_start_date=' + current_date + '&max_start_date=' + next_date;
        console.log(link, 'link');

        this.props.loadHall(match_params_id, link);
    }


    // TODO: Вынести удаление в Redux
    // hallDeleted = () => {
    //     if (!localStorage.getItem('auth-token')) {
    //         this.props.history.push("/login");
    //     }
    //     axios.delete(HALLS_URL + this.props.match.params.id, {
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Authorization': 'Token ' + localStorage.getItem('auth-token')
    //         }
    //     })
    //         .then(response => {
    //             console.log(response.data);
    //             this.setState(prevState => {
    //                 let newState = {...prevState};
    //                 newState.hall = null;
    //                 return newState;
    //             });
    //             this.props.history.replace('/halls/');
    //         })
    //         .catch(error => {
    //         console.log(error);
    //         let alert = {type: 'danger', message: `Delete error!`};
    //         this.setState({alert: alert});
    //         })
    // };


    render() {
        // если hall в props нет, ничего не рисуем.
        if (!this.props.hall) return null;
        console.log('выполняется Render первый раз');

        // достаём данные из hall
        const {name, description, id} = this.props.hall;

        // let alert = null;
        // if (this.state.alert) {
        //     alert = <div className={"alert alert-" + this.state.alert.type}>{this.state.alert.message}</div>
        // }

        return <div>
            {/*{ alert}*/}
            {/* название зала */}
            <h1 className='mt-3'>{name}</h1>

            {/* описание */}
            {description ? <p>{description}</p> : null}

            <div className='mb-3'>
                {/* редактировать */}
                <NavLink to={'/halls/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

                {/*<button type="button" className="btn btn-danger mr-2" onClick={() => this.hallDeleted()}>Delete</button>*/}

                {/* назад */}
                <NavLink to='/halls/' className="btn btn-primary">Halls</NavLink>
            </div>
            <div>
                <Shows shows={this.props.shows}/>
            </div>
        </div>;
    }
}

// ключ hallDetail приходит из root.js
const mapStateToProps = (state) => state.hallDetail;

// loadHall: - передается из props, используется в componentDidMount
// loadHall() - это вызов action из actions/hall-detail
const mapDispatchToProps = (dispatch) => ({
    loadHall: (hall_id, shows_link) => dispatch(loadHall(hall_id, shows_link))
});

// здесь HallDetail - название экспортируемого компонента
export default connect(mapStateToProps, mapDispatchToProps)(HallDetail);
import React, {Component} from 'react'
import {NavLink} from "react-router-dom";
import Shows from "../../components/Shows/Shows";
import {loadHallAndShows} from "../../store/actions/hall-detail";
import {connect} from "react-redux";
import {deleteHall, HALL_DELETE_SUCCESS} from "../../store/actions/hall-delete";


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

        this.props.loadHallAndShows(match_params_id, link);
    }


    // TODO: Вынести удаление в Redux
    hallDeleted = (hall_id) => {
        // распаковываем auth из proms
        const {auth} = this.props;
        console.log(this.props.deleteHall, 'auth!');
        return this.props.deleteHall(hall_id, auth.token).then(result => {
            // если результат запроса удачный - переходим на страницу списка залов
            if(result.type === HALL_DELETE_SUCCESS) {
                this.props.history.push('/halls/');
            }
        })
    };


    render() {

        // если hall в props нет, ничего не рисуем.
        console.log(this.props, 'props hd');
        if (!this.props.hallDetail.hall) return null;
        console.log('выполняется Render первый раз');

        // достаём данные из hall
        const {name, description, id} = this.props.hallDetail.hall;
        const {token} = this.props.auth;
        const shows = this.props.hallDetail.shows;
        console.log(shows, 'shows');

        return <div>
            {/* название зала */}
            <h1 className='mt-3'>{name}</h1>

            {/* описание */}
            {description ? <p>{description}</p> : null}

            {token ? [
            <div className='row'>
                <NavLink to={'/halls/' + id + '/edit'} className="btn btn-primary mr-3">Редактировать</NavLink>
                <button type="button" className="btn btn-danger" onClick={() => this.hallDeleted(id)}>Удалить</button>
            </div>
            ] : null}

            {shows ? [<div>
                <Shows shows={shows}/>
            </div>
            ] : null}

        </div>;
    }
}

// ключ hallDetail приходит из root.js
const mapStateToProps = state => {
    return {
        // hallDetail - идет в root
        hallDetail: state.hallDetail,
        auth: state.auth,  // auth нужен, чтобы получить из него токен для запроса,
    }
};

// loadHall: - передается из props, используется в componentDidMount
// loadHall() - это вызов action из actions/hall-detail
const mapDispatchToProps = (dispatch) => ({
    loadHallAndShows: (hall_id, shows_link) => dispatch(loadHallAndShows(hall_id, shows_link)),
    deleteHall: (hall_id, token) => dispatch(deleteHall(hall_id, token))
});

// здесь HallDetail - название экспортируемого компонента
export default connect(mapStateToProps, mapDispatchToProps)(HallDetail);
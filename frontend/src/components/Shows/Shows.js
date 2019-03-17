import React, {Component, Fragment} from 'react';
import Show from './Show/Show';
import {NavLink} from "react-router-dom";


class Shows extends Component {
    state = {
        shows: {
            today: [],
            tomorrow: [],
            after_tomorrow: []
        },
        keys : ['today', 'tomorrow', 'after_tomorrow'],
    };


    componentDidMount() {
        // принимаем данные о сеансах из props (shows)
        const showsData = this.props.shows;

        // // объявляем пустой объект shows
        let shows = {};

        // // добавляем в него пустые объекты для каждого дня (сегодня, завтра, послезавтра)
        this.state.keys.forEach(key => shows[key] = []);

        console.log(showsData, 'showsData');

        // проходим по всем сеансам, полученным из state, и добавляем эти сеансы в объект shows,
        // в соответствующий список сеансов (на сегодня, на завтра или послезавтра)
        showsData.forEach(show => {

            let start_time = show.start_time;
            console.log(start_time, 'start_time');
            let start_day = start_time.split('T')[0];
            console.log(start_time, 'start_day');

            // сегодня
            let today = new Date().toISOString().slice(0, 10);

            // завтра
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow = tomorrow.toISOString().slice(0, 10);

            // послезавтра
            let after_tomorrow = new Date();
            after_tomorrow.setDate(after_tomorrow.getDate() + 2);
            after_tomorrow = after_tomorrow.toISOString().slice(0, 10);

            if (start_day === today) {
                shows.today.push(show);
                console.log(start_day);
                console.log(today);
            } else if (start_day === tomorrow) {
                shows.tomorrow.push(show);
            } else if (start_day === after_tomorrow) {
                shows.after_tomorrow.push(show);
            };

        });
        this.setState({shows});
    }


    render() {
        return <Fragment>
            <div><NavLink to={'/tasks/add'} className="btn btn-success my-2 py-0 px-2">Add</NavLink></div>
            <div className='row'>
                {this.state.keys.map(key => {
                    return <div className="col col-4" key={key}>
                        <h2 className="text-center">{key}</h2>
                        <div className="row">
                            {this.state.shows[key].map(show => {
                                return <div className="col col-12" key={show.id}>
                                    <Show show={show}/>
                                </div>
                            })}
                        </div>
                    </div>
                })}
            </div>
        </Fragment>
    }
}

export default Shows;










// Компонент, который выводит сеансы в зале
// const Shows = (props) => {
//     const {shows} = props;
//
//     return <div className='row'>{shows.map(show =>
//         <Show key={show.id} show={show}/>
//     )}</div>;
// };
//
// export default Shows;
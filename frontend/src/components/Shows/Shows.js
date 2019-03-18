import React, {Component, Fragment} from 'react';
import Show from './Show/Show';



class Shows extends Component {
    state = {
        shows: {
            today: [],
            tomorrow: [],
            after_tomorrow: []
        },
        days : [
            ['today', 'Сегодня'],
            ['tomorrow', 'Завтра'],
            ['after_tomorrow', 'Послезавтра']
        ]
    };

    componentDidMount() {
        // принимаем данные о сеансах из props (stateShows)
        const propsShows = this.props.shows;
        console.log(propsShows, 'propsShows');

        // объявляем пустой объект stateShows
        let stateShows = {};

        // // добавляем в него пустые объекты для каждого дня (сегодня, завтра, послезавтра)
        let days = this.state.days;

        // заполняем stateShows, берем название дня из days
        days.forEach(day => stateShows[day[0]] = []);
        console.log(stateShows, 'stateShows');

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

        let actualDates = {
            today: today,
            tomorrow: tomorrow,
            after_tomorrow: after_tomorrow
        };
        console.log(actualDates);


        // проходим по всем сеансам, полученным из props, и добавляем эти сеансы в объект stateShows,
        // в соответствующий список сеансов (на сегодня, на завтра или послезавтра)
        propsShows.forEach(show => {

            let startTime = show.start_time;
            console.log(startTime, 'startTime');
            let startDay = startTime.split('T')[0];
            console.log(startDay, 'startDay');

            if (startDay === actualDates.today) {
                stateShows.today.push(show);
                console.log(startDay);
                console.log(today);
            } else if (startDay === actualDates.tomorrow) {
                stateShows.tomorrow.push(show);
            } else if (startDay === actualDates.after_tomorrow) {
                stateShows.after_tomorrow.push(show);
            }
        });

        console.log(this.state.shows.today, 'this.state.shows.today');

        this.setState({shows: stateShows});
    };

    render() {
        return <Fragment>
            <div className='row mt-3'>
                {this.state.days.map(day => {
                    console.log(day[0], 'render_day_0');
                    console.log(day[1], 'render_day_1');
                    return <div className="col col-4" key={day[0]}>
                        <h2 className="text-center">{day[1]}</h2>
                        <div className="row">
                            {this.state.shows[day[0]].map(show => {
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


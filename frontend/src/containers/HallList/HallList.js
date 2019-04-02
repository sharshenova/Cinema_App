import React, {Fragment, Component} from 'react'
import {HALLS_URL} from "../../api-urls";
import HallCard from "../../components/HallCard/HallCard";
import axios from 'axios';

// компонент для показа списка залов
// залы запрашиваются из API в момент показа компонента на странце (mount)
class HallList extends Component {
    state = {
        halls: [],
        alert: null
    };

    componentDidMount() {
        axios.get(HALLS_URL)
            .then(response => {console.log(response.data, 'axios'); return response.data;})
            .then(halls => this.setState({halls}))
            .catch(error => console.log(error));
    }


    render() {

        return <Fragment>
            <div className='row'>
                {this.state.halls.map(hall => {
                    return <div className='col-xs-12 col-sm-6 col-lg-4' key={hall.id}>
                        <HallCard hall={hall}/>
                    </div>
                })}
            </div>
        </Fragment>
    }
}


export default HallList;
import React, {Fragment, Component} from 'react'
import HallCard from "../../components/HallCard/HallCard";
import {loadHalls} from "../../store/actions/hall-list";
import {connect} from 'react-redux';

// компонент для показа списка залов
// залы запрашиваются из API в момент показа компонента на странце (mount)
class HallList extends Component {

    componentDidMount() {
        // loadHalls() берется из const mapDispatchToProps
        this.props.loadHalls();
    }

    render() {

        return <Fragment>
            <div className='row'>
                {this.props.halls.map(hall => {
                    return <div className='col-xs-12 col-sm-6 col-lg-4' key={hall.id}>
                        <HallCard hall={hall}/>
                    </div>
                })}
            </div>
        </Fragment>
    }
}


// ключ hallList приходит из root.js
const mapStateToProps = (state) => state.hallList;

// loadHalls: - используется в props
// loadHalls() - это вызов action из actions/hall-list
const mapDispatchToProps = (dispatch) => ({
    loadHalls: () => dispatch(loadHalls())
});

// здесь HallList - название экспортируемого компонента
export default connect(mapStateToProps, mapDispatchToProps)(HallList);
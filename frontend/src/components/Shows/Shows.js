import React from 'react';
import Show from './Show/Show';


// Компонент, который выводит сеансы в зале
const Shows = (props) => {
    const {shows} = props;
    return <div className='row'>{shows.map(show =>
        <Show key={show.id} show={show}/>
    )}</div>;
};

export default Shows;
import React from 'react';



// Компонент, который выводит сеансы в зале
const HallShows = (props) => {
    const {shows} = props;
    return <p>{shows.map(
        show => <span key={show.movie}>
            {show.start_time}
        </span>
    )}</p>;
};


export default HallShows;
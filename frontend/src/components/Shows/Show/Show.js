import React from 'react';
import {NavLink} from "react-router-dom";

// Компонент, который выводит сеансы в зале
const Show = (props) => {
    const {show} = props;
    const {movie, hall, start_time, end_time, price} = show;

    // создаём объект с данными (текстом и url) для ссылки
    const link = {
        text: 'All movies',
        url: '/movies/'
    };

    return <div className={"card mt-3 text-center text-sm-left col col-4"}>
        {movie ? <div className="card-body">
                {movie ? <h5 className="card-title">{movie.name}</h5> : null}
                 <div className="card-text">
                    {hall ? <p>Зал: {hall.name}</p> : null}
                    {start_time ? <p>Начало: {start_time}</p> : null}
                    {end_time ? <p>Конец: {end_time}</p> : null}
                    {price ? <p>Цена билета: {price}</p> : null}
                </div>
            {/* ссылка NavLink (из роутера) для навигации между "страницами" */}
            {/* принимает два параметра в одном "флаконе": link = {url, text}.  */}
            {link ? <NavLink to={link.url} className="btn btn-primary mr-2">
                {link.text}
            </NavLink> : null}
        </div> : null}
    </div>
};

export default Show;
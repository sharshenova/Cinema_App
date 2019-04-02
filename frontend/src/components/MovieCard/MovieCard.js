import React from 'react';
import Card from "../UI/Card/Card";


// Компонент, который рисует карточку для фильма: постер, название и ссылку,
// используя компонент UI/Card (карточка), основанный на стилях bootstrap.
const MovieCard = props => {
    const {movie, onDelete} = props;

    // достаём данные из movie
    const {name, poster, id} = movie;

    // создаём объект с данными (текстом и url) для ссылки
    const link = {
        text: 'Read more',
        url: '/movies/' + id,
    };

    // возвращаем (рисуем) карточку с данными из movie и ссылкой.
    return <Card header={name} image={poster} link={link} className='h-100'/>;
};


export default MovieCard;
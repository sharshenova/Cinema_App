import React from 'react';
import Card from "../UI/Card/Card";


// Компонент, который рисует карточку для зала: постер, название и ссылку,
// используя компонент UI/Card (карточка), основанный на стилях bootstrap.
const HallCard = props => {
    const {hall, onDelete} = props;

    // достаём данные из hall
    const {name, description, id} = hall;

    // создаём объект с данными (текстом и url) для ссылки
    const link = {
        text: 'Read more',
        url: '/halls/' + id
    };

    // возвращаем (рисуем) карточку с данными из movie и ссылкой.
    return <Card header={name} text={description} link={link} className='h-100'/>;
};


export default HallCard;
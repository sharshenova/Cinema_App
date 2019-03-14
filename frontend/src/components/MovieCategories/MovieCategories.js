import React from 'react';
import './MovieCategories.css';


// Компонент, который выводит кнопки категорий для фильма.
const MovieCategories = (props) => {
    const {categories} = props;
    return <p>{categories.map(
        category => <span key={category.id} className="badge badge-success category-badge">
            {category.name}
        </span>
    )}</p>;
};


export default MovieCategories;
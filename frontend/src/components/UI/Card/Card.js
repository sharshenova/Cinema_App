import React from 'react';
import {NavLink} from 'react-router-dom'


// компонент, который представляет собой карточку, основанную на стилях Bootstrap,
// и рисует карточку с указанным хедером, картинкой и ссылкой.
// проверки нужны на тот случай, чтобы в разметке не появлялись лишние отступы,
// если данные для какой-то части карточки не переданы и она выводится пустая.
// props.className позволяет принимать дополнительные классы для карточки по нуждам использующего компонента.
const Card = props => {
    return <div className={"card mt-3 text-center text-sm-left " + (props.className ? props.className : "")}>
        {props.image ? <img className="card-img-top" src={props.image} alt="poster"/> : null}
        {props.header || props.text || props.link ? <div className="card-body">
            {props.header ? <h5 className="card-title">{props.header}</h5> : null}
            {props.text ? <p className="card-text">{props.text}</p> : null}
            {/* ссылка NavLink (из роутера) для навигации между "страницами" */}
            {/* принимает два параметра в одном "флаконе": link = {url, text}.  */}
            {props.link ? <NavLink to={props.link.url} className="btn btn-primary mr-2">
                {props.link.text}
            </NavLink> : null}
            {props.del ? <button onClick={props.del.onDelete} className="btn btn-danger">
                {props.del.text}
            </button> : null}
        </div> : null}
    </div>
};


export default Card;
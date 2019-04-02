import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// стили для дэйтпикера (без них он не выводится)
// нужно установить react-datepicker через консоль, в папке frontend:
// npm install --save react-datepicker
import "react-datepicker/dist/react-datepicker.css";
// там же нужно установить react-select:
// npm install --save react-select

import {createStore, applyMiddleware} from 'redux'
import rootReducer from './store/reducers/root'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk';

// TODO: убрать, как только все запросы "переедут" в actions.js
import axios from 'axios';
import {BASE_URL} from "./api-urls";
// задаем дефолтный baseURL, чтобы при axios-запросах его не прописывать
axios.defaults.baseURL = BASE_URL;

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducer from './reducers'

import Root from './_root'


const initialState = {
    myAccount: null,
    meta: null,
    members: null,
    messages: null
};
let store = createStore(reducer,initialState)

//scss
import '../scss/style.scss'

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('app')
);

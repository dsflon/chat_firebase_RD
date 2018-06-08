import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducer from './reducers'

import Root from './_root'


const initialState = {
    myAccount: null,
    meta: null,
    messages: null
};
let store = createStore(reducer,initialState)

//scss
import '../scss/style.scss'


window.onload = () => {
    initFirebase()
    ReactDOM.render(
        <Provider store={store}>
            <Root />
        </Provider>,
        document.getElementById('app')
    );
};

function initFirebase() {

    checkSetup();

    window.auth = firebase.auth();
    window.database = firebase.database();
    window.storage = firebase.storage();

};

function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        console.error('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
    }
};

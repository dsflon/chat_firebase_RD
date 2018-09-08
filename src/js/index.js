import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducer from './reducers'

import Root from './_root'
import FireInit from './fireinit';

//scss
import '../scss/style.scss'

window.LOADING_IMAGE = 'https://www.google.com/images/spin-32.gif';

/*
** Create Store
*/
const initialState = {
    myAccount: null,
    meta: null,
    messages: null
};
let store = createStore(reducer,initialState);

/*
** Check Network
*/
const CheckNetwork = () => {
    let tagHtml = document.getElementsByTagName('html')[0];
    if( !navigator.onLine ) {
        tagHtml.classList.add("offline");
    } else {
        tagHtml.classList.remove("offline");
    }
}

/*
** Onload
*/
window.onload = () => {

    /* Firebase Initialize */
    window.auth = firebase.auth();
    window.database = firebase.database();
    window.storage = firebase.storage();

    window.usersRef = window.database.ref('users');
    window.metaRef = window.database.ref('meta');
    window.messagesRef = window.database.ref('messages');
    /* Firebase Initialize */

    window.CheckNetwork = CheckNetwork;

    /*
    ** React
    */
    ReactDOM.render(
        <Provider store={store}>
            <Root />
        </Provider>,
        document.getElementById('app')
    );

};

/*
** Service Worker
*/
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker
    .register('./sw.js')
    .then(function() {
        console.log('Service Worker Registered');
    });
}

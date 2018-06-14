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

import ChatIndexDB from './common/_indexedDB'

//scss
import '../scss/style.scss'

window.LOADING_IMAGE = 'https://www.google.com/images/spin-32.gif';

/* Firebase Initialize */
const config = {
  apiKey: "AIzaSyDHqPAR21LP_y8MTQttOUl2rZR_EP0atcQ",
  authDomain: "chat-3f1a7.firebaseapp.com",
  databaseURL: "https://chat-3f1a7.firebaseio.com",
  projectId: "chat-3f1a7",
  storageBucket: "chat-3f1a7.appspot.com",
  messagingSenderId: "1092855635066"
};
firebase.initializeApp(config);
/* Firebase Initialize */



const initialState = {
    myAccount: null,
    meta: null,
    messages: null
};
let store = createStore(reducer,initialState)

window.ChatIndexDB = new ChatIndexDB();

window.onload = () => {

    /* Firebase Initialize */
    window.auth = firebase.auth();
    window.database = firebase.database();
    window.storage = firebase.storage();
    /* Firebase Initialize */

    ReactDOM.render(
        <Provider store={store}>
            <Root />
        </Provider>,
        document.getElementById('app')
    );

};

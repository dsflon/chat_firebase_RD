import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Items from './_items';

import Log from '../../common/_login_out';
import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';
import GetUniqueStr from '../../common/_getUniqueStr';

let prevId;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.userBtn = <button className="logout"></button>;
    }

    componentDidMount() {
        this.CheckLogin();

    }

    componentDidUpdate() {

        if(this.state.myAccount && !this.state.meta) Fetch(this.actions);

        if( this.state.meta ) {

            // this.ChatIndexDB.chatDB.onsuccess = (e) => {
            //
            //     this.ChatIndexDB.db = e.target.result;
            //
            //     let stores = e.target.result.objectStoreNames;
            //         stores = Object.values(stores);
            //
            //     for (var roomId in this.state.meta) {
            //         if (stores.indexOf(roomId) == -1){
            //             this.ChatIndexDB.Set(roomId);
            //         }
            //     }
            //
            // }

        }

    }

    CheckLogin() {

        window.auth.onAuthStateChanged( (user) => {

            if (user) { // User is signed in!

                this.userBtn = <button onClick={Log.Out} className="logout" style={ user.photoURL ? { "backgroundImage": "url("+ user.photoURL +")" } : null }></button>;
                this.actions.Login({
                    uid: user.uid,
                    name: user.displayName,
                    thumb: user.photoURL
                });

                this.name = user.displayName;
                this.uid = user.uid;
                this.thumb = user.photoURL;

            } else { // User is signed out!

                this.userBtn = <button onClick={Log.In} className="login">login</button>;
                this.actions.Login(null);

            }

        })
    }

    ShowTalk(e) {

        e.preventDefault();

        let id = e.currentTarget.id;
        if( id !== prevId ) this.actions.Messages(null);
        this.history.push("/talk/"+id);

        window.ChatIndexDB.Set(id);

        prevId = id;

    }

    CreateNewTalk(e) {

        e.preventDefault();

        let id = e.currentTarget.id;

        ////トーク一覧用のMetaを新しく生成
        let metaRef = window.database.ref( 'meta/' + id );
        let metaData = {
            "lastMessage": "こんにちは、はじめまして。",
            "timestamp": new Date().getTime(),
            "members": {
                "qIGf0AzOcIgsTOF1uhYOjEMACZm1": {
                    "name": "斎藤大輝",
                    "thumb": "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg",
                    "readed": false
                }
            }
        };
        metaData["members"][this.uid] = {
            "name": this.name,
            "thumb": this.thumb,
            "readed": false
        }

        metaRef.set(metaData).then( () => {
            console.log("new Talk Room");
        }).catch( (error) => {
            console.error('Error writing new message to Firebase Database', error);
        });


        ////トークの初期データを生成
        let messagesRef = window.database.ref( 'messages/' + id );
        messagesRef.push({
            "name": "斎藤大輝",
            "uid": "qIGf0AzOcIgsTOF1uhYOjEMACZm1",
            "thumb": "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg",
            "message": "こんにちは、はじめまして。",
            "timestamp": new Date().getTime()
        }).then( () => {
            console.log("new Talk Room");
        }).catch( (error) => {
            console.error('Error writing new message to Firebase Database', error);
        });

        this.history.push("/talk/"+id);

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        return (
            <div className="page" ref="page">

                <header>
                    <h1>Talk</h1>
                    <div className="user">
                        {this.userBtn}
                    </div>
                </header>

                <div className="page-scroll" ref="page_scroll">

                    <section className="f-inner">

                        <div className="page-inner">

                            <Items
                                ShowTalk={this.ShowTalk.bind(this)}
                                CreateNewTalk={this.CreateNewTalk.bind(this)}
                                state={this.state}
                                actions={this.actions} />

                        </div>

                    </section>

                </div>
            </div>
        );

    }

}

const MapStateToProps = (state,ownProps) => {
    return { state: state };
}
const MapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(ActionCreators, dispatch) };
}

const Home = connect(
    MapStateToProps,
    MapDispatchToProps
)(App);

export default Home;

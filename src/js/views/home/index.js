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
        this.userBtn = <button className="logout log"></button>;
    }

    componentDidMount() {
        this.CheckLogin();

    }

    componentDidUpdate() {

        if(this.state.myAccount && !this.state.meta) Fetch(this.actions);

    }

    OpenLogout(e) {

        let target = document.getElementById('logout_wrap');
        if( target.style.display == "block" ) {
            target.style.display = "none";
        } else {
            target.style.display = "block";
        }

    }

    CheckLogin() {

        const LogOutWrap = (user) => {
            return (
                <div>
                    <button onClick={this.OpenLogout.bind(this)} className="logout log" style={ user.photoURL ? { "backgroundImage": "url("+ user.photoURL +")" } : null }></button>
                    <ul className="logout_wrap" id="logout_wrap">
                        <li><button onClick={Log.Out}>ログアウト</button></li>
                        <li><button onClick={Log.Remove}>アカウント削除</button></li>
                    </ul>
                </div>
            );
        }

        window.auth.onAuthStateChanged( (user) => {

            if (user) { // User is signed in!

                this.userBtn = LogOutWrap(user);
                this.actions.Login({
                    uid: user.uid,
                    name: user.displayName,
                    thumb: user.photoURL
                });

                this.name = user.displayName;
                this.uid = user.uid;
                this.thumb = user.photoURL;

            } else { // User is signed out!

                this.userBtn = <button onClick={Log.In} className="login log">login</button>;
                this.actions.Login(null);

            }

        })
    }

    ShowTalk(e) {

        e.preventDefault();

        let id = e.currentTarget.id;
        if( id !== prevId ) this.actions.Messages(null);

        window.ChatIndexDB.Set(id,() => {
            this.history.push("/talk/"+id);
        });

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

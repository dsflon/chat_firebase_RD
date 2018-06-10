import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';
import GetUniqueStr from '../../common/_getUniqueStr';

let prevId;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.userBtn = <button className="logout"></button>;
    }

    componentWillMount() {
    }
    componentDidMount() {

        // if(!this.state.myAccount) Fetch(this.actions);

        window.auth.onAuthStateChanged( (user) => {

            if (user) { // User is signed in!
console.log(user);
                this.userBtn = <button onClick={this.Logout.bind(this)} className="logout" style={ user.photoURL ? { "backgroundImage": "url("+ user.photoURL +")" } : null }></button>;
                this.actions.Login({
                    uid: user.uid,
                    thumb: user.photoURL
                });

                this.name = user.displayName;
                this.uid = user.uid;
                this.thumb = user.photoURL;

            } else { // User is signed out!

                this.userBtn = <button onClick={this.Login.bind(this)} className="login">login</button>;
                this.actions.Login(null);

            }

        })

    }

    componentWillUpdate() {
    }
    componentDidUpdate() {
        if(this.state.myAccount && !this.state.meta) Fetch(this.actions);
    }

    ShowTalk(e) {

        e.preventDefault();

        let id = e.currentTarget.id;
        if( id !== prevId ) this.actions.Messages(null);
        this.history.push("/talk/"+id);

        prevId = id;

    }

    CreateNewTalk(e) {

        e.preventDefault();

        let id = e.currentTarget.id;
        let metaRef = window.database.ref( 'meta/' + id );

        let metaData = {
            "lastMessage": "こんにちは、はじめまして。",
            "timestamp": new Date().getTime(),
            "members": {
                "qIGf0AzOcIgsTOF1uhYOjEMACZm1": {
                    "name": "斎藤大輝",
                    "thumb": "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg"
                }
            }
        };
        metaData["members"][this.uid] = {
            "name": this.name,
            "thumb": this.thumb
        }

        metaRef.set(metaData).then( () => {
            console.log("new Talk Room");
        }).catch( (error) => {
            console.error('Error writing new message to Firebase Database', error);
        });

        ////

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

    GetMyRoomList(meta) {

        let myRoomlist = [];

        for (var roomId in meta) {

            let roomData = meta[roomId],
                roomUsers = roomData.members;

            if( roomUsers.hasOwnProperty(this.state.myAccount.uid) ) {

                for (var uid in roomUsers) {

                    if( uid !== this.state.myAccount.uid ) {

                        let member = roomUsers[uid];

                        myRoomlist.push(

                            <li key={roomId} className="roomlist-item">
                                <button id={roomId} className="roomlist-btn" onClick={this.ShowTalk.bind(this)}>
                                    <figure className="roomlist-thumb" style={ member.thumb ? { "backgroundImage": "url("+ member.thumb +")" } : null }></figure>
                                    <div className="roomlist-wrap">
                                        <p className="roomlist-name">{member.name}</p>
                                        <p className="roomlist-mess">{roomData.lastMessage}</p>
                                        <p className="roomlist-time">{TimeStamp(roomData.timestamp)}</p>
                                    </div>
                                </button>
                            </li>

                        );

                    }//if

                }//for

            }//if

        }//for

        return myRoomlist;

    }

    GetNewTalk(roomId,member) {

        return (
            <li key={roomId} className="roomlist-item">
                <button id={roomId} className="roomlist-btn" onClick={this.CreateNewTalk.bind(this)}>
                    <figure className="roomlist-thumb" style={ member.thumb ? { "backgroundImage": "url("+ member.thumb +")" } : null }></figure>
                    <div className="roomlist-wrap">
                        <p className="roomlist-name">{member.name + "と会話を始める"}</p>
                    </div>
                </button>
            </li>
        )

    }

    Login() {

        let provider = new firebase.auth.GoogleAuthProvider();
        window.auth.signInWithPopup(provider).then( (result) => {

            let user = result.user;
            this.actions.Login({
                uid: user.uid,
                thumb: user.photoURL
            });
            console.log("ログインしました。");

        }).catch( (error) => {
            alert(error.message);
        });

    }

    Logout() {

        let res = confirm("ログアウトしますか？");
        if( res == true ) {
            window.auth.signOut().then( () => {
                console.log("ログアウトしました。");
            });
        } else {
            console.log("キャンセル");
        }

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        let myRoomList = null;

        if( this.state.myAccount && this.state.meta ) {
            myRoomList = this.GetMyRoomList(this.state.meta);

            if( !myRoomList[0] && this.uid !== "qIGf0AzOcIgsTOF1uhYOjEMACZm1" ) {

                myRoomList = this.GetNewTalk(
                    "room_" + GetUniqueStr(),
                    {
                        "name": "斎藤大輝",
                        "thumb": "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg"
                    }
                )

            }

        }

        // console.log(this.state);

        return (
            <div className="page" ref="page">
                <header>
                    <h1>Talk</h1>
                    <div className="user">
                        {this.userBtn}
                    </div>
                </header>
                <div className="page-scroll" ref="page_scroll">

                    <section id="page-select" className="f-inner">

                        <div className="page-inner">

                            <ul className="roomlist">{myRoomList}</ul>

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

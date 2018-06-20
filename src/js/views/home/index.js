import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Items from './_items';
import Header from './_header';

import Log from '../../common/_login_out';
import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';
import GetUniqueStr from '../../common/_getUniqueStr';

let prevId;

class App extends React.Component {

    constructor(props) {
        super(props);

        this.usersRef = null,
        this.myRooms = [];
    }

    componentDidMount() {
        this.CheckLogin();
    }

    componentDidUpdate() {

        if(this.state.myAccount && !this.state.meta) Fetch(this.actions);

        if( this.state.myAccount ) {
            this.name = this.state.myAccount.name;
            this.uid = this.state.myAccount.uid;
            this.thumb = this.state.myAccount.thumb;
        }

    }

    CheckLogin() {

        window.auth.onAuthStateChanged( (user) => {

            if (user) { // User is signed in!

                this.actions.Login({
                    uid: user.uid,
                    name: user.displayName,
                    thumb: user.photoURL
                });

                this.usersRef = window.database.ref('users');
                this.usersRef.child(this.uid).on("value", (snapshot) => {
                    let data = snapshot.val();
                    if(data && data.rooms) {
                        this.myRooms = data.rooms;
                        this.actions.Login({
                            uid: user.uid,
                            name: user.displayName,
                            thumb: user.photoURL,
                            rooms: data.rooms
                        });
                    }
                });
                this.usersRef.on('child_removed', (e) => {
                    let rooms = this.state.myAccount.rooms;
                    if( rooms ) {
                        for (var roomId in rooms) {
                            window.ChatIndexDB.RemoveStore(roomId);
                        }
                    }
                });

            } else { // User is signed out!

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

        let roomId = e.currentTarget.id;
        let partnerData = {
            "uid": "qIGf0AzOcIgsTOF1uhYOjEMACZm1",
            "name": "斎藤大輝",
            "thumb": "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg",
        }

        ////トーク一覧用のMetaを新しく生成
        let metaRef = window.database.ref( 'meta/' + roomId );
        let metaData = {
            "lastMessage": "こんにちは、はじめまして。",
            "timestamp": new Date().getTime(),
            "members": {}
        };
        metaData["members"][partnerData.uid] = {
            "name": partnerData.name,
            "thumb": partnerData.thumb,
            "readed": false
        }
        metaData["members"][this.uid] = {
            "name": this.name,
            "thumb": this.thumb,
            "readed": false
        }
        metaRef.set(metaData).then( () => {
            console.log("new Talk Room : meta");
        });


        ////トークの初期データを生成
        let messagesRef = window.database.ref( 'messages/' + roomId );
        messagesRef.push({
            "name": partnerData.name,
            "uid": partnerData.uid,
            "thumb": partnerData.thumb,
            "message": "こんにちは、はじめまして。",
            "timestamp": new Date().getTime()
        }).then( () => {
            console.log("new Talk Room : messages");
        });


        //データベースuserにroomsに追加（自分の分）r
        this.usersRef.child(this.uid).once('value').then( (snapshot) => {
            let data = snapshot.val();
            let updates = {};
            updates['/rooms/' + roomId] = true;
            this.usersRef.child(this.uid).update(updates);
        });

        //データベースuserにroomsに追加（相手の分）
        this.usersRef.child(partnerData.uid).once('value').then( (snapshot) => {
            let data = snapshot.val();
            let updates = {};
            updates['/rooms/' + roomId] = true;
            this.usersRef.child(partnerData.uid).update(updates);
        });


        //ページ遷移
        window.ChatIndexDB.Set(roomId,() => {
            this.history.push("/talk/"+roomId);
        });

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        return (
            <div className="page" ref="page">

                <Header
                    login={this.login}
                    state={this.state}
                    actions={this.actions} />

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

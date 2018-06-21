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
        this.usersRef = null;
    }

    componentDidMount() {
        if( !this.myAccount ) this.CheckLogin();
    }

    componentDidUpdate() {
        if(this.myAccount && !this.meta) Fetch(this.actions);
        if( this.meta ) {
            this.UpdateMeta();
            this.CheckIndexedDB();
        }
    }

    CheckIndexedDB() { // IndexedDBをチェックして利用していないものは削除する
        let stores = window.ChatIndexDB.stores,
            metaKey = Object.keys(this.meta);
        for (var i = 0; i < stores.length; i++) {
            if( metaKey.indexOf(stores[i]) === -1 ) {
                window.ChatIndexDB.RemoveStore(stores[i]);
            }
        }
    }

    UpdateMeta() {

        let messagesRef = window.database.ref('messages'),
            metaRef = window.database.ref('meta');

        let SetMeta = (roomId,data) => {
            let updates = {};
                updates['/lastMessage'] = data.message ? data.message : "画像を送信しました";
                updates['/timestamp'] = data.timestamp;
            metaRef.child(roomId).update(updates);
        }

        messagesRef.once('value').then( (snapshot) => {
            let data = snapshot.val();
            let meta = this.meta;

            for (var roomId in meta) {

                let keys = Object.keys(data[roomId]),
                    length = keys.length,
                    lastMessage = data[roomId][keys[length - 1]];

                lastMessage = lastMessage ? lastMessage : {
                    message: "メッセージがありません", timestamp : null
                }
                SetMeta(roomId,lastMessage);

            }
        })

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
                this.usersRef.child(user.uid).once('value').then( (snapshot) => {
                    let data = snapshot.val();
                    if(data && data.rooms) {
                        this.actions.Login({
                            uid: user.uid,
                            name: user.displayName,
                            thumb: user.photoURL,
                            rooms: data.rooms
                        });
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
        metaData["members"][this.myAccount.uid] = {
            "name": this.myAccount.name,
            "thumb": this.myAccount.thumb,
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
        this.usersRef.child(this.myAccount.uid).once('value').then( (snapshot) => {
            let data = snapshot.val();
            let updates = {};
            updates['/rooms/' + roomId] = true;
            this.usersRef.child(this.myAccount.uid).update(updates);
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

        this.meta = this.state.meta;
        this.myAccount = this.state.myAccount;

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

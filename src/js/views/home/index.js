import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Items from './_items';
import Header from './_header';
import SearchDetail from './_search_detail';

import ChatIndexDB from '../../common/_indexedDB'
import Log from '../../common/_login_out';
import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';
import GetUniqueStr from '../../common/_getUniqueStr';
import UpdateLastMessage from '../../common/_updateLastMessage';

let prevId;

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        let chatStorageUser = localStorage.getItem("ChatStorageUser"),
            chatStorageMeta = localStorage.getItem("ChatStorageMeta");

        if( !this.myAccount ) {
            if( chatStorageUser && chatStorageMeta ){
                this.actions.Login( JSON.parse(chatStorageUser) );
                this.actions.Meta( JSON.parse(chatStorageMeta) );
                Fetch(this.actions,JSON.parse(chatStorageUser));
            }
            this.ShowLoading();
            this.CheckLogin();
        }
        if(this.meta) {
            UpdateLastMessage(this.meta);
        }

    }

    componentDidUpdate() {
        if(this.meta) {
            UpdateLastMessage(this.meta);
            this.CheckIndexedDB();
            this.CheckLocalStorage();
        } else {
            Fetch(this.actions,this.myAccount);
        }

        window.CheckNetwork();
    }

    CheckIndexedDB() { // IndexedDBをチェックして利用していないものは削除する

        if(!window.ChatIndexDB) return false;

        let stores = window.ChatIndexDB.stores,
            metaKeys = Object.keys(this.meta);

        for (var i = 0; i < stores.length; i++) {
            if( metaKeys.indexOf(stores[i]) === -1 ) {
                window.ChatIndexDB.RemoveStore(stores[i]);
            }
        }

    }

    CheckLocalStorage() { // Local Storageをチェックして利用していないものは削除する

        let metaKeys = Object.keys(this.meta);

        for(var key in localStorage) {
            if( key.indexOf("ChatStorageMess_") !== -1 ) {
                let roomId = key.split("ChatStorageMess_")[1];
                if( metaKeys.indexOf(roomId) === -1 ) {
                    localStorage.removeItem("ChatStorageMess_"+roomId);
                }
            }
        }

    }

    UpdateUsers(data) {
        let val = data.val();
        let updateFriends = this.myAccount;
        if( data.key == this.myAccount.uid ) {
            updateFriends['rooms'] = val.rooms;
            updateFriends['friends'] = val.friends;
            this.actions.Login(updateFriends);
            localStorage.setItem("ChatStorageUser", JSON.stringify(updateFriends));
        }
    }

    CheckLogin() {

        /*
        ** Indexed DB
        */
        window.ChatIndexDB = new ChatIndexDB("ChatDatabase",()=>{
            this.HideLoading();
        });

        window.auth.onAuthStateChanged( (user) => {
            if (user) { // User is signed in!
                this.actions.Login({
                    uid: user.uid,
                    name: user.displayName,
                    thumb: user.photoURL,
                    rooms: {},
                    friends: {}
                });
                window.usersRef.child(user.uid).once('value').then( (snapshot) => {
                    if(!snapshot.val()) {
                        window.usersRef.child(user.uid).set({
                            name: user.displayName,
                            thumb: user.photoURL
                        });
                        console.log("Added new user: " + user.uid);
                    }
                });
                window.usersRef.off();
                window.usersRef.on('child_added', this.UpdateUsers.bind(this));
                window.usersRef.on('child_changed', this.UpdateUsers.bind(this));
            } else { // User is signed out!
                this.actions.Login(null);
                this.HideLoading();
            }
        })
    }

    ShowLoading() { this.refs.page_scroll.classList.add("loading"); }
    HideLoading() { this.refs.page_scroll.classList.remove("loading"); }

    ShowTalk(e) {

        e.preventDefault();

        this.ShowLoading();

        let id = e.currentTarget.id;
        if( id !== prevId ) this.actions.Messages(null);

        let timer;

        let SetDB = () => {
            timer = setTimeout( () => { location.reload() }, 5000);
            return new Promise((resolve, reject) => {
                window.ChatIndexDB.Set(id,resolve);
            });
        }
        let GetAllDB = () => {
            return new Promise((resolve, reject) => {
                window.ChatIndexDB.GetAll(id,(e) => {

                    let result = e.target ? e.target.result : e.result,
                        imagesDB = {};

                    if (!!result == false) return;

                    for (var i = 0; i < result.length; i++) {
                        let blob = result[i].arraybuffer ? new Blob([result[i].arraybuffer]) : result[i].blob,
                            URL = window.URL || window.webkitURL,
                            imgURL = URL.createObjectURL(blob);
                        imagesDB[result[i].talkId] = imgURL;
                        URL.revokeObjectURL(blob);
                    }

                    this.actions.ImagesDB(imagesDB);
                    this.HideLoading();
                    this.history.push("/talk/"+id);

                    clearTimeout(timer)

                });
            });
        }

        Promise.resolve()
        .then(SetDB) // DBをセットし
        .then(GetAllDB); // FB内容を取得できたら

        prevId = id;

    }

    CreateNewTalk(partnerData,e) {

        e.preventDefault();
        this.ShowLoading();

        let roomId = e.currentTarget.id;
        let def = {
            message: "こんにちは、" + partnerData.name + "です。",
            timestamp: new Date().getTime()
        }

        ////トーク一覧用のMetaを新しく生成
        let metaRef = window.metaRef.child(roomId);
        let metaData = {
            lastMessage: def.message,
            timestamp: def.timestamp,
            members: {}
        };
        metaData["members"][partnerData.uid] = {
            name: partnerData.name,
            thumb: partnerData.thumb,
            readed: false
        }
        metaData["members"][this.myAccount.uid] = {
            name: this.myAccount.name,
            thumb: this.myAccount.thumb,
            readed: false
        }
        metaRef.set(metaData).then( () => {
            console.log("new Talk Room : meta");
        });


        ////トークの初期データを生成
        let messagesRef = window.messagesRef.child(roomId);
        messagesRef.push({
            uid: partnerData.uid,
            name: partnerData.name,
            thumb: partnerData.thumb,
            message: def.message,
            timestamp: def.timestamp
        }).then( () => {
            console.log("new Talk Room : messages");
        });


        //データベースuserにroomsに追加（自分の分）
        window.usersRef.child(this.myAccount.uid).once('value').then( (snapshot) => {
            let data = snapshot.val();
            let updates = {};
            updates['/rooms/' + roomId] = true;
            updates['/friends/' + partnerData.uid] = {
                name: partnerData.name,
                thumb: partnerData.thumb,
            };
            window.usersRef.child(this.myAccount.uid).update(updates);
        });

        //データベースuserにroomsに追加（相手の分）
        window.usersRef.child(partnerData.uid).once('value').then( (snapshot) => {
            let data = snapshot.val();
            let updates = {};
            updates['/rooms/' + roomId] = true;
            updates['/friends/' + this.myAccount.uid] = {
                name: this.myAccount.name,
                thumb: this.myAccount.thumb,
            };
            window.usersRef.child(partnerData.uid).update(updates);
        });

        //ページ遷移
        window.ChatIndexDB.Set(roomId,() => {
            this.HideLoading();
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

                <SearchDetail
                    CreateNewTalk={this.CreateNewTalk.bind(this)}
                    actions={this.actions}
                    state={this.state} />

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

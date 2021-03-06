import React from 'react';
import { NavLink } from 'react-router-dom'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';

import Input from './_input';
import Items from './_items';
import ImageDetail from './_image_detail';
import UserDetail from './_user_detail';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.roomId = this.props.match.params.id;
        this.messagesRef = window.messagesRef.child(this.roomId);
        this.metaRef = window.metaRef.child(this.roomId);
    }
    componentDidMount() {

        let chatStorageMess = localStorage.getItem("ChatStorageMess_"+this.roomId);

        if( !this.state.meta ) {
            this.history.push("/");
        } else {
            this.ShowLoading();

            if(chatStorageMess) {
                let messageData = JSON.parse(chatStorageMess);
                for (var talkId in messageData) {
                    if (this.imagesDB.hasOwnProperty(talkId)) {
                        messageData[talkId].image = this.imagesDB[talkId];
                    }
                }
                this.actions.Messages( messageData );
                this.HideLoading();
            }
            setTimeout(this.GetMessageData.bind(this),1);

            for (var roomId in this.state.meta) { // 前回データが残らないようにここで全部リセット
                window.messagesRef.child(roomId).off();
                window.metaRef.child(roomId).off();
            }
        }

    }

    componentDidUpdate() {
        this.Readed();
        window.CheckNetwork();
    }

    ShowLoading() { if(this.refs.page_scroll) this.refs.page_scroll.classList.add("loading"); }
    HideLoading() { if(this.refs.page_scroll) this.refs.page_scroll.classList.remove("loading"); }

    Readed() {
        //相手のアカウントに対して "readed" をつける必要がある。
        if(this.state.meta && this.state.messages && window.auth.currentUser) {
            let members = this.state.meta[this.roomId].members;
            for (var uid in members) {
                if( uid !== window.auth.currentUser.uid ) {
                    var updates = {};
                    updates['/members/' + uid + "/readed"] = true;
                    this.metaRef.update(updates);
                }
            }
        }
    }

    SetScroll() {
        if(!this.refs.page_scroll) return true;
        this.refs.page_scroll.scrollTop = this.refs.page_scroll.scrollHeight;
    }

    UploadArrayBuffer(data) {

        // // 画像パスから blob を取得
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onload = (e) => {

            let arraybuffer = e.target.response,
                blob = new Blob([arraybuffer]);

            window.ChatIndexDB.Put(this.roomId,{
                talkId: data.talkId,
                timestamp: data.timestamp,
                arraybuffer: arraybuffer
            });

            let URL = window.URL || window.webkitURL,
                imgURL = URL.createObjectURL(blob);
            let messages = this.state.messages;
                messages[data.talkId]["image"] = imgURL;
            this.actions.Messages(messages);

            URL.revokeObjectURL(blob);

        };
        xhr.open('GET', data.image);
        xhr.send();

    }

    GetMessageData() {

        let Message = {}, timer;

        let SetMessages = (data) => {
            Message[data.key] = data.val();
            if( Message[data.key].image && Message[data.key].image != "pre_upload" ) {
                if (this.imagesDB.hasOwnProperty(data.key)) {
                    Message[data.key].image = this.imagesDB[data.key];
                } else {
                    this.UploadArrayBuffer({
                        image: Message[data.key].image,
                        talkId: data.key,
                        timestamp: Message[data.key].timestamp
                    })
                }
            }
            clearTimeout(timer);
            timer = setTimeout( () => {
                this.HideLoading();
                this.actions.Messages(Message);
                this.SetScroll();
                localStorage.setItem("ChatStorageMess_"+this.roomId, JSON.stringify(Message));
            },1)
        };

        let RemoveMessages = (data) => {
            delete Message[data.key];
            this.actions.Messages(Message);
            this.SetScroll();
            localStorage.setItem("ChatStorageMess_"+this.roomId, JSON.stringify(Message));
        };

        this.messagesRef.off();
        this.messagesRef.on('child_added', SetMessages);
        this.messagesRef.on('child_changed', SetMessages);
        this.messagesRef.on('child_removed', RemoveMessages);

        // 使用していない画像をIndexDBから削除する
        this.messagesRef.once("value").then( (snapshot) => {

            let data = snapshot.val(),
                talkIds = this.imagesDB ? Object.keys(this.imagesDB) : [];

            for (var i = 0; i < talkIds.length; i++) {
                if( !data[talkIds[i]] ) {
                    window.ChatIndexDB.Delete(this.roomId,talkIds[i]);
                }
            }

        })

    }

    GetMyRoomData(meta) {
        let roomMember = meta.members;
        for (var userId in roomMember) {
            if( this.state.myAccount.uid !== userId ) {
                roomMember = roomMember[userId]
            }
        }
        return roomMember;
    }

    GetRoomName() {
        if( this.state.meta ) {
            let roomData = this.GetMyRoomData(this.state.meta[this.roomId]);
            this.roomName = roomData.name;
            return roomData.name;
        }
    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        this.imagesDB = this.state.imagesDB;

        let roomName = this.GetRoomName();
        let myMeta = this.state.meta ? this.state.meta[this.roomId] : null

        return (
            <div className="page" ref="page">

                <header>
                    <div className="back">
                        <NavLink to='/'>←</NavLink>
                    </div>
                    <h1>{roomName}</h1>
                </header>

                <div className="page-scroll" ref="page_scroll">

                    <section className="f-inner">
                        <div className="page-inner">

                            <Items
                                setScroll={this.SetScroll.bind(this)}
                                actions={this.actions}
                                state={this.state}
                                roomId={this.roomId}
                                metaRef={this.metaRef}
                                messagesRef={this.messagesRef} />

                        </div>
                    </section>

                </div>

                <UserDetail
                    actions={this.actions}
                    state={this.state} />
                <ImageDetail
                    actions={this.actions}
                    state={this.state} />

                <Input
                    roomId={this.roomId}
                    setScroll={this.SetScroll.bind(this)}
                    meta={myMeta}
                    metaRef={this.metaRef}
                    messagesRef={this.messagesRef} />

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

const Talk = connect(
    MapStateToProps,
    MapDispatchToProps
)(App);

export default Talk;

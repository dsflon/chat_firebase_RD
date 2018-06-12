import React from 'react';
import { NavLink } from 'react-router-dom'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';

import Input from './_input';
import Items from './_items';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        // リロードしたときの処理
        if( !this.state.meta ) Fetch(this.actions);

        // ログアウト時のリダイレクト
        window.auth.onAuthStateChanged( (user) => {

            if(user) {
                this.actions.Login({
                    uid: user.uid,
                    thumb: user.photoURL
                });
            } else {
                this.history.push("/");
            }

        });

        this.GetMessageData();
        this.Readed();

    }

    componentDidUpdate() {
        this.Readed();
    }

    Readed() {

        //相手のアカウントに対して "readed" をつける必要がある。
        if(this.state.meta && window.auth.currentUser) {
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

    GetMessageData() {

        this.messagesRef = window.database.ref( 'messages/' + this.roomId );
        this.metaRef = window.database.ref( 'meta/' + this.roomId );

        let Message = {}, timer;

        let SetMeta = ( text, timestamp) => {
            let updates = {};
                updates['/lastMessage'] = text ? text : "画像を送信しました";
                updates['/timestamp'] = timestamp;
            this.metaRef.update(updates);
        }

        let SetMessages = (data) => {
            Message[data.key] = data.val();
            clearTimeout(timer);
            timer = setTimeout( () => {
                this.actions.Messages(Message);
                this.SetScroll();

                // Metaに追加
                SetMeta( Message[data.key].message, Message[data.key].timestamp );
            },1)
        };

        let RemoveMessages = (data) => {

            delete Message[data.key];
            this.actions.Messages(Message);
            this.SetScroll();

            let keys = Object.keys(Message),
                length = keys.length,
                lastMessage = Message[keys[length - 1]];

            // Metaに追加
            SetMeta( lastMessage.message, lastMessage.timestamp );
        };

        this.messagesRef.off();
        this.messagesRef.on('child_added', SetMessages);
        this.messagesRef.on('child_changed', SetMessages);
        this.messagesRef.on('child_removed', RemoveMessages);

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

        if( this.state.messages ) {

            let roomData = this.GetMyRoomData(this.state.meta[this.roomId]);
            this.roomName = roomData.name;
            return roomData.name;

        }

    }

    ShowThumb(e) {
        let thumb = e.currentTarget.dataset.thumb,
            name = e.currentTarget.dataset.name;
        this.refs.user_thumb.style.backgroundImage = "url(" + thumb + ")";
        this.refs.user_name.innerHTML = name;
        this.refs.user_detail.classList.add("show");
    }
    HideThumb(e) {
        this.refs.user_detail.classList.remove("show");
    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        this.roomId = this.props.match.params.id;

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
                                ShowThumb={this.ShowThumb.bind(this)}
                                actions={this.actions}
                                state={this.state}
                                metaRef={this.metaRef}
                                messagesRef={this.messagesRef} />

                        </div>
                    </section>

                </div>

                <div className="user-detail" ref="user_detail">
                    <div className="user-bg" onClick={this.HideThumb.bind(this)}></div>
                    <div className="user-wrap" ref="user_wrap">
                        <figure className="user-thumb" ref="user_thumb"></figure>
                        <p className="user-name" ref="user_name">user name</p>
                    </div>
                </div>

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

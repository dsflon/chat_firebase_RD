import React from 'react';
import { NavLink } from 'react-router-dom'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';
import nl2br from '../../common/_nl2br';

import Input from './_input';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {}
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

        this.GetMessageData()

    }

    componentWillUpdate() {}
    componentDidUpdate() {}

    SetScroll() {
        this.refs.page_scroll.scrollTop = this.refs.page_scroll.scrollHeight;
    }

    GetMessageData() {

        this.messagesRef = window.database.ref( 'messages/' + this.roomId );
        this.metaRef = window.database.ref( 'meta/' + this.roomId );

        let Message = {}, timer;

        let SetMessages = (data) => {
            Message[data.key] = data.val();
            clearTimeout(timer);
            timer = setTimeout( () => {
                this.actions.Messages(Message);
                this.SetScroll();
            },1)
        };

        this.messagesRef.off();
        this.messagesRef.on('child_added', SetMessages);
        this.messagesRef.on('child_changed', SetMessages);

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
    GetMessages() {

        if( this.state.myAccount && this.state.messages ) {

            let messageItem = []

            for (var talkId in this.state.messages) {

                let thisTalk = this.state.messages[talkId];
                let own = thisTalk.uid === this.state.myAccount.uid;

                let thumb = !own ? <figure className="messages-thumb" style={ thisTalk.thumb ? { "backgroundImage": "url("+ thisTalk.thumb +")" } : null }></figure> : null;

                if( !thisTalk.uid ) return true;

                messageItem.push(

                    <div
                        id={talkId}
                        key={talkId}
                        className={"messages-item" + (own ? " own" : "")}>

                        {thumb}

                        <div className="messages-wrap">
                            <div className="messages-inner">
                                <p className="messages-mess">{nl2br(thisTalk.message)}</p>
                                <span className="messages-time">{TimeStamp(thisTalk.timestamp)}</span>
                            </div>
                        </div>

                    </div>

                );

            }

            return messageItem;

        }

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.match = this.props.match;
        this.history = this.props.history;

        this.roomId = this.match.params.id;
        this.messages = this.state.messages;

        let roomName = this.GetRoomName(),
            messages = this.GetMessages();

        return (
            <div className="page" ref="page">

                <header>
                    <div className="back">
                        <NavLink to='/'>←</NavLink>
                    </div>
                    <h1>{roomName}</h1>
                </header>

                <div className="page-scroll" ref="page_scroll">

                    <section id="page-select" className="f-inner">

                        <div className="page-inner">
                            <div id="messages">
                                {messages}
                            </div>
                        </div>

                    </section>

                </div>

                <Input
                    setScroll={this.SetScroll.bind(this)}
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

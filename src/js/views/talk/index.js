import React from 'react';
import { NavLink } from 'react-router-dom'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Fetch from '../../common/_fetch';
import TimeStamp from '../../common/_timestamp';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }
    componentDidMount() {
        // リロードしたときの処理
        if( !this.state.messages || !this.state.messages.uid ) Fetch(this.actions,this.roomId);
    }

    componentWillUpdate() {
    }
    componentDidUpdate() {
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

        if( this.state.myAccount && this.state.messages ) {

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
                        id={thisTalk.uid}
                        key={thisTalk.uid}
                        className={"messages-item" + (own ? " own" : "")}>

                        {thumb}

                        <div className="messages-wrap">
                            <div className="messages-inner">
                                <p className="messages-mess">{thisTalk.message}</p>
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

        this.roomId = this.match.params.id;

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

                <footer id="from">
                    <form id="from-image" action="#">
                        <input id="image-input" ref="image_input" type="file" accept="image/*,capture=camera" />
                        <label id="image-btn" htmlFor="image-input"><span>Image</span></label>
                    </form>
                    <form id="from-mess" action="#">
                        <label id="mess-input-wrap">
                            <textarea id="mess-input" ref="mess_input" type="text" placeholder="Message..." />
                        </label>
                        <button id="mess-submit" disabled type="submit">Send</button>
                    </form>
                </footer>

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

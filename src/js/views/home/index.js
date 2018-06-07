import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';

import Fetch from '../../_fetch';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }
    componentDidMount() {
        Fetch(this.actions);
    }

    componentWillUpdate() {
    }
    componentDidUpdate() {
    }

    ShowTalk(e) {

        e.preventDefault();

        let id = e.currentTarget.id;
        this.actions.Messages(this.state.messages[id]);
        this.history.push("/talk/"+id);

    }

    GetMyRoomId(members) {

        let myRoomId = [];

        for (var roomId in members) {

            let users = members[roomId];

            if( users.hasOwnProperty(this.state.myAccount) ) {
                myRoomId.push(roomId)
            }

        }

        return myRoomId;

    }

    TimeStamp(num) {

        const data = new Date(num);
        var year = data.getFullYear();
        var month = data.getMonth()+1;
        var day = data.getDate();
        var hour = data.getHours();
        var minute = data.getMinutes();

        return month + "/" + day + " " + hour + ":" + String(minute).padStart(2, "0")

    }

    GetMyRoomList(myRoomId,meta) {

        let myRoomlist = [];

        for (var i = 0; i < myRoomId.length; i++) {

            let roomData = meta[myRoomId[i]];
            let roomMember = roomData.members;

            for (var userId in roomMember) {
                if( this.state.myAccount !== userId ) {
                    roomMember = roomMember[userId]
                }
            }

            myRoomlist.push(

                <li key={myRoomId[i]} className="roomlist-item">
                    <button id={myRoomId[i]} className="roomlist-btn" onClick={this.ShowTalk.bind(this)}>
                        <figure className="roomlist-thumb" style={ roomMember.thumb ? { "backgroundImage": "url("+ roomMember.thumb +")" } : null }></figure>
                        <div className="roomlist-wrap">
                            <p className="roomlist-name">{roomMember.name}</p>
                            <p className="roomlist-mess">{roomData.lastMessage}</p>
                            <p className="roomlist-time">{this.TimeStamp(roomData.timestamp)}</p>
                        </div>
                    </button>
                </li>

            );
        }

        return myRoomlist;

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        let myRoomList;
        if( this.state.members && this.state.meta ) {
            let myRoomId = this.GetMyRoomId(this.state.members);
                myRoomList = this.GetMyRoomList(myRoomId,this.state.meta);
        }

        return (
            <div className="page" ref="page">
                <header>
                    <h1>トーク一覧</h1>
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

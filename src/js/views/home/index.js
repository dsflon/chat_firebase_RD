import React from 'react';

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
        if(this.state.myAccount) Fetch(this.actions);
    }

    componentWillUpdate() {
    }
    componentDidUpdate() {
        if(this.state.myAccount && !this.state.meta) Fetch(this.actions);
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

            if( users.hasOwnProperty(this.state.myAccount.uid) ) {
                myRoomId.push(roomId)
            }

        }

        return myRoomId;

    }

    GetMyRoomList(myRoomId,meta) {

        let myRoomlist = [];

        for (var i = 0; i < myRoomId.length; i++) {

            let roomData = meta[myRoomId[i]];
            let roomMember = roomData.members;

            for (var userId in roomMember) {
                if( this.state.myAccount.uid !== userId ) {
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
                            <p className="roomlist-time">{TimeStamp(roomData.timestamp)}</p>
                        </div>
                    </button>
                </li>

            );
        }

        return myRoomlist;

    }

    Login() {

        this.actions.Login({
            uid: "4946YwuQf0Qzw6NNnmElkKugZlp1",
            thumb: "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg"
        });

    }

    Logout() {

        var res = confirm("ログアウトしますか？");
        if( res == true ) {
            console.log("ログアウトしました。");
            this.actions.Login(null);
        } else {
            console.log("キャンセル");
        }

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;

        let myRoomList;
        if( this.state.myAccount && this.state.meta ) {
            let myRoomId = this.GetMyRoomId(this.state.members);
                myRoomList = this.GetMyRoomList(myRoomId,this.state.meta);
        }

        let logoutBtn = this.state.myAccount ? <button onClick={this.Logout.bind(this)} className="logout" style={ this.state.myAccount.thumb ? { "backgroundImage": "url("+ this.state.myAccount.thumb +")" } : null }></button> : null;
        let loginBtn = !this.state.myAccount ? <button onClick={this.Login.bind(this)} className="login">login</button> : null;

        return (
            <div className="page" ref="page">
                <header>
                    <h1>Talk</h1>
                    <div className="user">
                        {logoutBtn}
                        {loginBtn}
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

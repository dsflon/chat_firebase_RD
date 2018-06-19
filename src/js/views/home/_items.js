import firebase from 'firebase/app';
import React from 'react';

import TimeStamp from '../../common/_timestamp';
import GetUniqueStr from '../../common/_getUniqueStr';


class Items extends React.Component {

    constructor(props) {
        super(props);
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

                            <li key={roomId} className="roomlist-item" index={roomData.timestamp}>
                                <button id={roomId} className={"roomlist-btn" + ( member.readed ? " readed" : "" )} onClick={this.ShowTalk.bind(this)}>
                                    <figure className="roomlist-thumb" style={ member.thumb ? { "backgroundImage": "url("+ member.thumb +")" } : null }></figure>
                                    <div className="roomlist-wrap">
                                        <p className="roomlist-name">{member.name}</p>
                                        <p className="roomlist-mess">{roomData.lastMessage}</p>
                                        <p className="roomlist-time">{roomData.timestamp ? TimeStamp(roomData.timestamp) : null}</p>
                                    </div>
                                </button>
                            </li>

                        );

                    }//if

                }//for

            }//if

        }//for

        //タイムスタンプ順に並べる
        myRoomlist.sort(
            function(a,b){
                return (a.props.index < b.props.index ? 1 : -1);
            }
        );

        return myRoomlist;

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;

        this.ShowTalk = this.props.ShowTalk;
        this.CreateNewTalk = this.props.CreateNewTalk;

        let myRoomList = [];

        if( this.state.myAccount && this.state.meta ) {

            myRoomList = this.GetMyRoomList(this.state.meta);

            if( !myRoomList[0] && this.state.myAccount.uid !== "qIGf0AzOcIgsTOF1uhYOjEMACZm1" ) {

                myRoomList = this.GetNewTalk(
                    "room_" + GetUniqueStr(),
                    {
                        "name": "斎藤大輝",
                        "thumb": "https://lh3.googleusercontent.com/-UNIWopLLAu4/AAAAAAAAAAI/AAAAAAAAKVo/TLHxya8I6UE/photo.jpg"
                    }
                )

            }

        }

        return (
            <ul className="roomlist">
                {myRoomList}
            </ul>
        );

    }

}

export default Items;

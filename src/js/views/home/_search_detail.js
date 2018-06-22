import React from 'react';
import GetUniqueStr from '../../common/_getUniqueStr';

class SearchDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getUserData();
    }
    componentDidUpdate() {
        this.getUserData();
    }

    getUserData() {
        if(!this.state.myAccount) return false;

        window.usersRef.once('value').then( (snapshot) => {
            this.data = snapshot.val();
        });
    }

    Click(partnerData,e) {
        this.CreateNewTalk(partnerData,e);
        this.HideSearchDetail(e);
    }

    HideSearchDetail(e) {
        let showDetail = this.state.showDetail;
        showDetail["search"]["show"] = false;
        this.actions.ShowDetail(showDetail);
    }

    GetUsers() {

        let userItem = [];

        let myFriends = this.state.myAccount.friends ? Object.keys(this.state.myAccount.friends) : [];
        myFriends.push(this.state.myAccount.uid);

        for (var uid in this.data) {

            if( myFriends.indexOf(uid) === -1 ) {

                let member = this.data[uid];

                let partnerData = {
                    uid: uid,
                    name: member.name,
                    thumb: member.thumb
                }

                userItem.push(

                    <li key={uid} className="roomlist-item">
                        <button id={"room_" + GetUniqueStr()} className="roomlist-btn readed" onClick={this.Click.bind(this,partnerData)}>
                            <figure className="roomlist-thumb" style={ member.thumb ? { "backgroundImage": "url("+ member.thumb +")" } : null }></figure>
                            <div className="roomlist-wrap">
                                <p className="roomlist-name">{member.name + "と会話を始める"}</p>
                            </div>
                        </button>
                    </li>

                );
            }

        }

        if(userItem.length == 0){
            userItem = [];
            userItem.push(
                <li key={"no"} className="roomlist-item">あなたにはもう、誰とも友達になれません。</li>
            )
        }

        return userItem;

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.CreateNewTalk = this.props.CreateNewTalk;

        let search = this.state.showDetail ? this.state.showDetail.search : null;
        let users = search && search.show ? this.GetUsers() : null;

        return (
            <div className={"search-detail" + (search && search.show ? " show" : "") }>
                <div className="bg" onClick={this.HideSearchDetail.bind(this)}></div>
                <div className="search-wrap">
                    <ul className="roomlist">{users}</ul>
                </div>
            </div>
        );

    }

}

export default SearchDetail;

import React from 'react';

import Log from '../../common/_login_out';

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}
    componentDidUpdate() {}

    ShowSearchDetail(e) {
        let showDetail = this.state.showDetail || {};

        window.usersRef.once('value').then( (snapshot) => {
            showDetail["search"] = {
                show: true,
                data: snapshot.val()
            }
            this.actions.ShowDetail(showDetail);
        });

    }

    OpenLogout(e) {

        let target = document.getElementById('logout_wrap');
        if( target.style.display == "block" ) {
            target.style.display = "none";
        } else {
            target.style.display = "block";
        }

    }

    LogOutWrap(user) {

        const OpenLogout = (e) => {

            let target = document.getElementById('logout_wrap');
            if( target.style.display == "block" ) {
                target.style.display = "none";
            } else {
                target.style.display = "block";
            }

        }

        return (
            <div>
                <button onClick={OpenLogout} className="logout log" style={ user.thumb ? { "backgroundImage": "url("+ user.thumb +")" } : null }></button>
                <ul className="logout_wrap" id="logout_wrap">
                    <li><button onClick={Log.Out}>ログアウト</button></li>
                    <li><button onClick={Log.Remove}>アカウント削除</button></li>
                </ul>
            </div>
        );
    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;

        let myAccount = this.state.myAccount,
            userBtn = myAccount ? this.LogOutWrap(myAccount) : <button onClick={Log.In} className="login log">login</button>,
            searchBtn = myAccount ? <button onClick={this.ShowSearchDetail.bind(this)} className="search">Search</button> : null;

        return (
            <header>
                <h1>Talk</h1>
                {searchBtn}
                <div className="user">{userBtn}</div>
            </header>
        );

    }

}

export default Header;

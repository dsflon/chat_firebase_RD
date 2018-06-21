import React from 'react';

import Log from '../../common/_login_out';

class Header extends React.Component {

    constructor(props) {
        super(props);
        // this.userBtn = <button className="logout log"></button>;
        // this.userBtn = null;
    }

    componentDidMount() {
        // this.CheckLoginBtn();
    }

    componentDidUpdate() {
        // this.CheckLoginBtn();
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

    // CheckLoginBtn() {
    //
    //     window.auth.onAuthStateChanged( (user) => {
    //         if (user) { // User is signed in!
    //             this.userBtn = this.LogOutWrap(user);
    //         } else { // User is signed out!
    //             this.userBtn = <button onClick={Log.In} className="login log">login</button>;
    //         }
    //     })
    //
    // }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;

        let myAccount = this.state.myAccount,
            userBtn = myAccount ? this.LogOutWrap(myAccount) : <button onClick={Log.In} className="login log">login</button>;

        return (
            <header>
                <h1>Talk</h1>
                <div className="user">
                    {userBtn}
                </div>
            </header>
        );

    }

}

export default Header;

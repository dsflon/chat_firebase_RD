import React from 'react';

class UserDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    HideUserDetail(e) {
        let showDetail = this.state.showDetail;
        showDetail["user"]["show"] = false;
        this.actions.ShowDetail(showDetail);
    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;

        let user = this.state.showDetail ? this.state.showDetail.user : null,
            thumb = { "backgroundImage": "url(" + (user && user.thumb ? user.thumb : "/images/profile_placeholder.png") + ")" },
            name = user && user.name ? user.name : "user name";

        return (
            <div className={"user-detail" + (user && user.show ? " show" : "") }>
                <div className="bg" onClick={this.HideUserDetail.bind(this)}></div>
                <div className="user-wrap">
                    <figure className="user-thumb" style={thumb}></figure>
                    <p className="user-name">{name}</p>
                </div>
            </div>
        );

    }

}

export default UserDetail;

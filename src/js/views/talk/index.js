import React from 'react';
import { NavLink } from 'react-router-dom'

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
        // リロードしたときの処理
        if( !this.state.messages ) Fetch(this.actions,this.id);
    }

    componentWillUpdate() {
    }
    componentDidUpdate() {
    }

    GetMyRoomData(meta) {

        let roomMember = meta.members;

        for (var userId in roomMember) {
            if( this.state.myAccount !== userId ) {
                roomMember = roomMember[userId]
            }
        }

        return roomMember;

    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;
        this.history = this.props.history;
        this.location = this.props.location;
        this.match = this.props.match;

        this.id = this.match.params.id;

        let roomName;
        if( this.state.messages ) {
            let roomData = this.GetMyRoomData(this.state.meta[this.id]);
                roomName = roomData.name;
        }
        console.log(this.state.messages);

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

const Talk = connect(
    MapStateToProps,
    MapDispatchToProps
)(App);

export default Talk;

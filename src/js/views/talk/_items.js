import React from 'react';

import TimeStamp from '../../common/_timestamp';
import nl2br from '../../common/_nl2br';

class Input extends React.Component {

    constructor(props) {
        super(props);
    }

    GetMessages() {

        if( this.state.myAccount && this.state.messages ) {

            let messageItem = []

            for (var talkId in this.state.messages) {

                let thisTalk = this.state.messages[talkId];
                let own = thisTalk.uid === this.state.myAccount.uid;

                let thumbStyle = thisTalk.thumb ? { "backgroundImage": "url("+ thisTalk.thumb +")" } : null;
                let thumb = !own ? <button className="messages-thumb" data-name={thisTalk.name} data-thumb={thisTalk.thumb} style={ thumbStyle } onClick={this.props.ShowThumb}></button> : null;

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

        let message = this.GetMessages();

        return (
            <div id="messages">
                {message}
            </div>
        );

    }

}

export default Input;

import React from 'react';

import TimeStamp from '../../common/_timestamp';
import nl2br from '../../common/_nl2br';

class Input extends React.Component {

    constructor(props) {
        super(props);
        this.removeTimer = null;
    }

    Remove(e) {

        let talkId = e.currentTarget.dataset.id,
            own = e.currentTarget.dataset.own;

        if(own === "false") return true;

        this.removeTimer = setTimeout( () => {
            let res = confirm("削除しますか？");
            if( res == true ) {
                this.messagesRef.child(talkId).remove();
            }
        }, 1000);

    }

    CreateImg(imageUri,talkId) {

        let imgSrc;

        if( imageUri.startsWith('gs://') ) {
            imgSrc = window.LOADING_IMAGE;
            window.storage.refFromURL(imageUri).getDownloadURL().then( (src) => {
                let update = this.state.messages;
                    update[talkId]["image"] = src;
                this.actions.Messages(update);
            });
        } else {
            imgSrc = imageUri;
        }

        return (
            <figure className="messages-img"><img src={imgSrc} onLoad={this.setScroll} /></figure>
        );

    }

    GetMessages() {

        if( this.state.myAccount && this.state.messages ) {

            let messageItem = []

            for (var talkId in this.state.messages) {

                let thisTalk = this.state.messages[talkId];
                let own = thisTalk.uid === this.state.myAccount.uid;

                let thumbStyle = thisTalk.thumb ? { "backgroundImage": "url("+ thisTalk.thumb +")" } : null;
                let thumb = !own ? <button
                                        className="messages-thumb"
                                        data-name={thisTalk.name}
                                        data-thumb={thisTalk.thumb}
                                        style={ thumbStyle }
                                        onClick={this.props.ShowThumb}></button> : null;

                let remove = own ? <button
                                        className="messages-remove"
                                        onClick={this.Remove.bind(this)}
                                        data-own={own}
                                        data-id={talkId}
                                        data-timestamp={thisTalk.timestamp}></button> : null;


                let message = null;
                if( thisTalk.message ) message = <p className="messages-mess" ref={"mess_"+talkId}>{nl2br(thisTalk.message)}</p>
                if( thisTalk.image ) message = this.CreateImg(thisTalk.image,talkId);


                if( !thisTalk.uid ) return true;

                messageItem.push(

                    <div
                        id={talkId}
                        key={talkId}
                        className={"messages-item" + (own ? " own" : "")}>

                        {thumb}

                        <div className="messages-wrap">
                            <div className="messages-inner">
                                {remove}
                                {message}
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

        this.setScroll = this.props.setScroll;
        this.actions = this.props.actions;
        this.state = this.props.state;
        this.messagesRef = this.props.messagesRef;
        this.metaRef = this.props.metaRef;

        let message = this.GetMessages();

        return (
            <div id="messages">
                {message}
            </div>
        );

    }

}

export default Input;

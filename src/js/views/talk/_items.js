import React from 'react';

import TimeStamp from '../../common/_timestamp';
import nl2br from '../../common/_nl2br';

class Input extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    componentDidUpdate() {
    }

    Remove(thisTalk,e) {

        let talkId = e.currentTarget.dataset.id;

        let res = confirm("削除しますか？");
        if( res == true ) {

            this.messagesRef.child(talkId).remove();
console.log(thisTalk.filePath);
            if(thisTalk.filePath) {
                let desertRef = window.storage.ref(thisTalk.filePath);
                desertRef.delete().then( () => {
                    console.log("画像を削除しました。");
                }).catch( (error) => {
                    console.error(error);
                });
            }

        }

    }

    CreateImg(imageUri,talkId) {

        let img = imageUri != "pre_upload" ? <img onClick={this.props.ShowImageDetail} src={imageUri} onLoad={this.setScroll} /> : null;

        return <figure className="messages-img">{img}</figure>;

    }

    GetMessages() {

        if( this.state.myAccount && this.state.messages ) {

            let messageItem = []

            for (var talkId in this.state.messages) {

                let thisTalk = this.state.messages[talkId];
                let own = thisTalk.uid === this.state.myAccount.uid;

                let thumb = !own ? <button
                                        className="messages-thumb"
                                        data-name={thisTalk.name}
                                        data-thumb={thisTalk.thumb}
                                        style={ thisTalk.thumb ? { "backgroundImage": "url("+ thisTalk.thumb +")" } : null }
                                        onClick={this.props.ShowUserDetail}></button> : null;

                let remove = own ? <button
                                        className="messages-remove"
                                        onClick={this.Remove.bind(this,thisTalk)}
                                        data-id={talkId}></button> : null;

                let message = thisTalk.message ? <p className="messages-mess" ref={"mess_"+talkId}>{nl2br(thisTalk.message)}</p> : null,
                    image = thisTalk.image ? this.CreateImg(thisTalk.image,talkId) : null;


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
                                {image}
                                <span className="messages-time">{thisTalk.timestamp ? TimeStamp(thisTalk.timestamp) : null}</span>
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
        this.roomId = this.props.roomId;

        let message = this.state.messages ? this.GetMessages() : null;

        return (
            <div id="messages">
                {message}
            </div>
        );

    }

}

export default Input;

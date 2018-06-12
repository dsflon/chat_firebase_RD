import React from 'react';

import TimeStamp from '../../common/_timestamp';


class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = { disabled: "disabled" }
    }

    componentDidMount() {

        this.refs.mess_input.oninput = (e) => {
            if( e.currentTarget.value ) {
                this.setState({ disabled: false });
            } else {
                this.setState({ disabled: "disabled" });
            }
        }

        this.winheight = window.innerHeight / 2;

    }

    Post(e) {

        e.preventDefault();

        let value = this.refs.mess_input.value;

        if (value) {

            this.messagesRef.push({
                name: window.auth.currentUser.displayName,
                uid: window.auth.currentUser.uid,
                message: value,
                thumb: window.auth.currentUser.photoURL || '/images/profile_placeholder.png',
                timestamp: new Date().getTime()
            }).then( () => {
                console.log("post!");
                this.refs.mess_input.value = "";
                this.setScroll();
                this.setState({ disabled: "disabled" });
            }).catch( (error) => {
                console.error('Error writing new message to Firebase Database', error);
            });


            if( this.meta ) {

                //// Meta Update
                let updates = {};
                    // updates['/lastMessage'] = value;
                    // updates['/timestamp'] = new Date().getTime();
                    for (var uid in this.meta.members) {
                        updates['/members/' + uid + '/readed'] = false;
                    }

                this.metaRef.update(updates);

            }

        }

    }

    Input() {
        //iOSの予測変換分の位置調整
        window.scroll( 0, this.winheight );
    }

    render() {

        this.setScroll = this.props.setScroll;
        this.meta = this.props.meta;
        this.messagesRef = this.props.messagesRef;
        this.metaRef = this.props.metaRef;

        return (
            <footer id="from">
                <form id="from-image">
                    <input id="image-input" ref="image_input" type="file" accept="image/*,capture=camera" />
                    <label id="image-btn" htmlFor="image-input"><span>Image</span></label>
                </form>
                <form id="from-mess">
                    <label id="mess-input-wrap">
                        <textarea
                            id="mess-input"
                            ref="mess_input"
                            type="text"
                            placeholder="Message..."
                            onInput={this.Input.bind(this)} />
                    </label>
                    <button
                        id="mess-submit"
                        ref="mess_submit"
                        type="button"
                        disabled={this.state.disabled}
                        onClick={this.Post.bind(this)}>
                        Send
                    </button>
                </form>
            </footer>
        );

    }

}

export default Input;

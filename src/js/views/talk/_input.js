import React from 'react';

import TimeStamp from '../../common/_timestamp';


class Input extends React.Component {

    constructor(props) {
        super(props);

        this.state = { disabled: "disabled" }
    }

    componentWillMount() {}
    componentDidMount() {
        this.refs.mess_input.oninput = (e) => {
            if( e.currentTarget.value ) {
                this.setState({ disabled: false });
            } else {
                this.setState({ disabled: "disabled" });
            }
        }
    }
    componentWillUpdate() {}
    componentDidUpdate() {}

    Post(e) {

        e.preventDefault();

        let value = this.refs.mess_input.value

        if (value) {

            var currentUser = window.auth.currentUser;

            this.messagesRef.push({
                name: currentUser.displayName,
                uid: currentUser.uid,
                message: value,
                thumb: currentUser.photoURL || '/images/profile_placeholder.png',
                timestamp: new Date().getTime()
            }).then( () => {
                console.log("post!");
                this.refs.mess_input.value = "";
                this.setScroll();
            }).catch( (error) => {
                console.error('Error writing new message to Firebase Database', error);
            });

            this.metaRef.update({
                lastMessage: value,
                timestamp: new Date().getTime()
            })

        }

    }

    render() {

        this.setScroll = this.props.setScroll;
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
                        <textarea id="mess-input" ref="mess_input" type="text" placeholder="Message..." />
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

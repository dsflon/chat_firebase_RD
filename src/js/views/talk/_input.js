import React from 'react';
import ImgTrim from '../../common/_img_trimming';

import Ua from '../../libs/j_ua';

class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = { disabled: "disabled" }
        this.UA = new Ua();
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

    Post(obj,file,fileName) {

        let postData = {
            name: window.auth.currentUser.displayName,
            uid: window.auth.currentUser.uid,
            thumb: window.auth.currentUser.photoURL || '/images/profile_placeholder.png',
            timestamp: new Date().getTime()
        }
        postData = Object.assign(obj, postData);

        this.messagesRef.push(postData).then( (data) => {

            //テキストのとき
            if( postData.message ) {
                this.refs.mess_input.value = "";
                console.log("post message!");
            }

            //画像のとき
            if( postData.image && file ) {

                // let filePath = this.roomId + '/' + window.auth.currentUser.uid + '/' + Date.now() + '/' + file.name,
                let filePath = this.roomId + '/' + window.auth.currentUser.uid + '/' + Date.now() + '/' + fileName,
                    storageRef = window.storage.ref(filePath),
                    uploadTask = storageRef.put(file, {'contentType': file.type});

                uploadTask.on('state_changed', null, (error) => {
                    console.error('There was an error uploading a file to Firebase Storage:', error);
                }, () => {
                    storageRef.getDownloadURL().then( (src) => {
                        data.update({ image: src, filePath: filePath });
                    });
                    console.log("post image!");
                });

            }

            this.setScroll();
            this.setState({ disabled: "disabled" });

        }).catch( (error) => {
            console.error('Error writing new message to Firebase Database', error);
        });

        ////

        if( this.meta ) { // Meta Update

            let updates = {};
            for (var uid in this.meta.members) {
                updates['/members/' + uid + '/readed'] = false;
            }

            this.metaRef.update(updates);

        }

    }

    PostMessage(e) {

        e.preventDefault();
        this.refs.mess_input.focus();
        let value = this.refs.mess_input.value;
        if (value) this.Post({ message: value })

    }

    PostImage(e) {

        e.preventDefault();
        let file = e.target.files[0];

        if (!file.type.match('image.*')) return true;

        //画像トリミングしてからアップロード
        ImgTrim(file,(blob) => {
            this.Post({ image: "pre_upload" },blob,file.name);
        });

    }

    Input() {
        //iOSの予測変換分の位置調整
        window.scroll( 0, this.winheight );
    }

    render() {

        this.setScroll = this.props.setScroll;
        this.meta = this.props.meta;
        this.roomId = this.props.roomId;
        this.messagesRef = this.props.messagesRef;
        this.metaRef = this.props.metaRef;

        let inputAcc = this.UA.GetAndroidVersion() > 6 ? "image/*,capture=camera" : "image/*,application/pdf,capture=camera";

        return (
            <footer id="from">
                <form id="from-image">
                    <input id="image-input" ref="image_input" onChange={this.PostImage.bind(this)} type="file" accept={inputAcc} />
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
                        onClick={this.PostMessage.bind(this)}>
                        Send
                    </button>
                </form>
            </footer>
        );

    }

}

export default Input;

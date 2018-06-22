import React from 'react';

class ImageDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    HideImageDetail(e) {
        let showDetail = this.state.showDetail;
        showDetail["image"]["show"] = false;
        this.actions.ShowDetail(showDetail);
    }

    render() {

        this.state = this.props.state;
        this.actions = this.props.actions;

        let image = this.state.showDetail ? this.state.showDetail.image : null,
            src = image && image.src ? { "backgroundImage": "url(" + image.src + ")" } : null;

        return (
            <div className={"image-detail" + (image && image.show ? " show" : "") }>
                <button className="close" onClick={this.HideImageDetail.bind(this)}></button>
                <a className="download" download target="_blank">download</a>
                <div className="bg"></div>
                <figure className="image-src"><span style={src}></span></figure>
            </div>
        );

    }

}

export default ImageDetail;

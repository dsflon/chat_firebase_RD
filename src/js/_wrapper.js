import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class Wrapper extends React.Component {

    constructor(props) {
        super(props);
        this.animation = "next";
    }

    componentDidMount() {
    }

    render() {

        let { children } = this.props;
        let key = children.key;
        this.animation = children.props.state.pageAnim;

        return (
            <TransitionGroup>
                <CSSTransition
                    key={key}
                    timeout={500}
                    classNames={"page-" + this.animation}>

                    {children}

                </CSSTransition>
            </TransitionGroup>
        );
    }
}


export default Wrapper

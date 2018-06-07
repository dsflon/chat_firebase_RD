import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Home from './views/home'
import Talk from './views/talk'

// const GetPages = ({props,page}) => {
//
//     switch (page) {
//
//         case 'talk':
//         return <Talk props={props} />
//
//         default:
//         return <Home />;
//
//     }
//
// }
//
// const Animation = (props) => {
//
//     const {
//         match: { params: { page } }
//     } = props;
//
//     return (
//         <TransitionGroup>
//             <CSSTransition
//                 key={page}
//                 timeout={500}
//                 classNames={"contents"}>
//
//                 <GetPages props={props} page={page} />
//
//             </CSSTransition>
//         </TransitionGroup>
//     )
//
// }
//
// const Root = ({ store }) => (
//
//         <Router>
//             <Route path="/:page?" component={Animation} />
//         </Router>
//
// )

const Root = () => (
    <Router>
        <div>
            <Route exact path="/" component={Home} />
            <Route path="/talk/:id?" component={Talk} />
        </div>
    </Router>
)

export default Root;

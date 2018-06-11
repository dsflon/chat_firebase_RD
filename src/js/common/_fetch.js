// const Fetch = (actions,roomId) => {
//
//     // Fetchはローカル用
//     fetch('/initial_messages.json')
//     .then( (response) => {
//         return response.json();
//     })
//     .then( (json) => {
//         actions.Members(json.members);
//         actions.Meta(json.meta);
//
//         let messages = roomId ? json.messages[roomId] : json.messages;
//         actions.Messages(messages);
//     });
//
// }

const Fetch = (actions,roomId) => {

    GetMetaData(actions);

}

function GetMetaData(actions) {

    // let metaRef = window.metaRef = window.database.ref('meta');
    let metaRef = window.metaRef = window.database.ref('meta').orderByChild('timestamp'); //orderByChildは昇順になる

    let meta = {}, timer;

    let SetMeta = (data) => {
        meta[data.key] = data.val();
        clearTimeout(timer);
        timer = setTimeout( () => {
            actions.Meta(meta);
        },1)
    };

    metaRef.off();
    metaRef.on('child_added', SetMeta);
    metaRef.on('child_changed', SetMeta);

}


export default Fetch;

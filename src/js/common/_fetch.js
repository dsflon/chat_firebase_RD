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

    window.auth.onAuthStateChanged( (user) => {
        actions.Login({
            uid: user.uid,
            thumb: user.photoURL
        });
    })

    GetMetaData(actions);
    // GetMessageData(actions,roomId);

}

function GetMetaData(actions) {

    let metaRef = window.database.ref('meta');

    let meta = {}

    let SetMeta = (data) => {
        meta[data.key] = data.val();
        actions.Meta(meta);
    };

    metaRef.off();
    metaRef.on('child_added', SetMeta);
    metaRef.on('child_changed', SetMeta);

}
function GetMessageData(actions,roomId) {

    let MessageRef = window.database.ref( 'messages' + (roomId ? "/" + roomId : "") );

    let Message = {}

    let SetMessages = (data) => {
        Message[data.key] = data.val();
        actions.Messages(Message);
    };

    MessageRef.off();
    MessageRef.on('child_added', SetMessages);
    MessageRef.on('child_changed', SetMessages);

}


export default Fetch;

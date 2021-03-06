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

const Fetch = (actions,myAccount) => {

    if(!myAccount) return false;

    GetMetaData(actions,myAccount);

}

function GetMetaData(actions,myAccount) {

    let meta = {}, timer;

    let SetMeta = (data) => {
        let val = data.val();
        if (val.members && val.members.hasOwnProperty(myAccount.uid)) {
            meta[data.key] = data.val();
        }
        clearTimeout(timer);
        timer = setTimeout( () => {
            actions.Meta(meta);
            localStorage.setItem("ChatStorageMeta", JSON.stringify(meta));
        },1)
    };

    window.metaRef.off();
    window.metaRef.on('child_added', SetMeta);
    window.metaRef.on('child_changed', SetMeta);
    window.metaRef.on('child_removed', (data) => {
        delete meta[data.key];
        actions.Meta(meta);
    });
    window.metaRef.once('value').then( (snapshot) => {
        // DBにMetaがなくても実行できるように
        let data = snapshot.val();
        if( !data ) actions.Meta({});
    });


}


export default Fetch;

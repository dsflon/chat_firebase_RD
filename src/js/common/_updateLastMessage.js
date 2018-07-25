/**
 * トーク一覧のラストメッセージを更新する
 * @param {object} meta - 自分が関連しているルームID
 */
const UpdateLastMessage = (meta) => {

    let SetMeta = (roomId,data) => {
        let updates = {};
            updates['/lastMessage'] = data.message ? data.message : "画像を送信しました";
            updates['/timestamp'] = data.timestamp;
        window.metaRef.child(roomId).update(updates);
    }

    window.messagesRef.once('value').then( (snapshot) => {
        let data = snapshot.val();

        for (var roomId in meta) {

            let keys = Object.keys(data[roomId]),
                length = keys.length,
                lastMessage = data[roomId][keys[length - 1]];

            lastMessage = lastMessage ? lastMessage : {
                message: "メッセージがありません", timestamp : null
            }
            SetMeta(roomId,lastMessage);

        }
    })

}

export default UpdateLastMessage;

import firebase from 'firebase/app';

const Log = {

    In: () => {

        let provider = new firebase.auth.GoogleAuthProvider();
        // let users = {}, myData, timer;
        //
        // let SetUsers = (data) => {
        //     users[data.key] = data.val();
        //     clearTimeout(timer);
        //     timer = setTimeout( () => {
        //         if ( !users.hasOwnProperty(myData.uid) ) {
        //             window.usersRef.child(myData.uid).set({
        //                 name: myData.displayName,
        //                 thumb: myData.photoURL
        //             });
        //         }
        //     },1)
        // };

        window.auth.signInWithRedirect(provider);

    },

    Out: () => {

        let res = confirm("ログアウトしますか？");
        if( res == true ) {
            localStorage.removeItem("ChatStorageUser");
            window.auth.signOut().then( () => {
                console.log("ログアウトしました。");
                location.reload(); //都合悪いからリロード
            });
        }

    },

    Remove: () => {
        let res = confirm("アカウントを削除しますか？");

        if( res == true ) {

            let myData = window.auth.currentUser;

            window.usersRef.once('value').then( (snapshot) => {

                let data = snapshot.val();

                if( !data[myData.uid] ) return true;

                let myRooms = data[myData.uid].rooms,
                    myFriends = data[myData.uid].friends;

                for (var uid in data) {
                    if( uid !== myData.uid ) {
                        let rooms = data[uid].rooms,
                            friends = data[uid].friends;// 他の人の友達

                        // 全ユーザーから該当するroomsを削除
                        for (var roomId in myRooms) {
                            if (rooms && rooms.hasOwnProperty(roomId)) {
                                delete rooms[roomId];
                                let updates = {};
                                updates['/rooms'] = rooms;
                                window.usersRef.child(uid).update(updates);
                            }
                        }
                        // 全ユーザーから自分を削除
                        for (var friendId in myFriends) {
                            if (friends && friends.hasOwnProperty(myData.uid)) {
                                delete friends[myData.uid];
                                let updates = {};
                                updates['/friends'] = friends;
                                window.usersRef.child(uid).update(updates);
                            }
                        }
                    }
                }
            });

            // databaseのusersからroomsを抽出
            let usersRef = window.usersRef.child(myData.uid);
            usersRef.once('value').then( (snapshot) => {

                let data = snapshot.val();

                if(data && data.rooms) {

                    for (var roomId in data.rooms) {

                        let messages = window.database.ref('messages').child(roomId),
                            meta = window.database.ref('meta').child(roomId);

                        messages.on("value", (snapshot) => {
                            let data = snapshot.val();
                            for (var talkId in data) { // ストレージから画像を削除
                                if( data[talkId].filePath ) {
                                    let desertRef = window.storage.ref(data[talkId].filePath);
                                    desertRef.delete();
                                }
                            }
                            messages.remove();
                        });

                        meta.remove();
                        localStorage.removeItem("ChatStorageMess_"+roomId);

                    }
                }

                usersRef.remove();

                window.indexedDB.deleteDatabase("ChatDatabase");
                localStorage.removeItem("ChatStorageUser");
                localStorage.removeItem("ChatStorageMeta");

                myData.delete().then( () => { //Authentication から削除
                    location.reload(); //都合悪いからリロード
                }).catch( (error) => {
                    console.error(error);
                    window.auth.signOut().then( () => {
                        console.log("ログアウトしました。");
                        location.reload(); //都合悪いからリロード
                    });
                });

            });

        }

    }

}

export default Log;

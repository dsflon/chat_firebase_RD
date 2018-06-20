import firebase from 'firebase/app';

const Log = {

    In: () => {

        let provider = new firebase.auth.GoogleAuthProvider();

        let usersRef = window.database.ref('users');
        let users = {}, myData, timer;

        let SetUsers = (data) => {
            users[data.key] = data.val();
            clearTimeout(timer);
            timer = setTimeout( () => {
                if ( !users.hasOwnProperty(myData.uid) ) {
                    usersRef.child(myData.uid).set({
                        name: myData.displayName,
                        thumb: myData.photoURL,
                        rooms: []
                    });
                }
            },1)
        };

        window.auth.signInWithPopup(provider).then( (result) => {

            myData = result.user;

            usersRef.off();
            usersRef.on('child_added', SetUsers);

            console.log("ログインしました。");

        }).catch( (error) => {
            alert(error.message);
        });

    },

    Out: () => {

        let res = confirm("ログアウトしますか？");
        if( res == true ) {
            window.auth.signOut().then( () => {
                console.log("ログアウトしました。");
            });
        }

    },

    Remove: () => {
        let res = confirm("アカウントを削除しますか？");

        if( res == true ) {

            let usersRef = window.database.ref('users');
            let myData = window.auth.currentUser;

            // 全ユーザーから該当するroomsを削除
            usersRef.once('value').then( (snapshot) => {
                let data = snapshot.val();
                let myRooms = data[myData.uid].rooms;
                for (var uid in data) {
                    if( uid !== myData.uid ) {
                        // console.log(uid, myData.uid);
                        let rooms = data[uid].rooms;
                        for (var roomId in myRooms) {
                            if (rooms.hasOwnProperty(roomId)) {
                                delete rooms[roomId];
                                let updates = {};
                                updates['/rooms'] = rooms;
                                usersRef.child(uid).update(updates);
                            }
                        }
                    }
                }
            });
            // databaseのusesからroomsを抽出
            usersRef.child(myData.uid).once('value').then( (snapshot) => {

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

                    }

                }

                window.database.ref('users').child(myData.uid).remove();

                setTimeout( () => {
                    window.auth.signOut();
                    location.reload(); //都合悪いからリロード
                },500 )

            });

        }

    }

}

export default Log;

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

            usersRef.child(myData.uid).on("value", (snapshot) => {

                let data = snapshot.val();

                if(data && data.rooms) {
                    for (var i = 0; i < data.rooms.length; i++) {
                        window.database.ref('messages').child(data.rooms[i]).remove();
                        window.database.ref('meta').child(data.rooms[i]).remove();

                        // let desertRef = window.storage.ref(data.rooms[i]+"/");
                        // console.log(data.rooms[i]);
                        // console.log(desertRef);
                        // desertRef.delete();
                    }
                }

                window.database.ref('users').child(myData.uid).remove();
                // console.log("アカウントを削除しました。");

                setTimeout( () => {
                    window.auth.signOut();
                    location.reload(); //都合悪いからリロード
                },500 )

            });

        }

    }

}

export default Log;

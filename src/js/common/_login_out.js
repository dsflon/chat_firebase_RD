import firebase from 'firebase/app';

const Log = {

    In: () => {

        let provider = new firebase.auth.GoogleAuthProvider();
        
        window.auth.signInWithPopup(provider).then( (result) => {
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

    }

}

export default Log;

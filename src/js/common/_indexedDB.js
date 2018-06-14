class ChatIndexDB {

    constructor(storeName) {

        this.dataBaseName = "ChatDatabase";

        this.chatDB = null;
        this.db = null;
        this.dbVersion = 0;

        this.stores = [];

    }

    Set(storeName) {

        if(this.db) this.db.close();

        if( this.stores.indexOf(storeName) == -1 ) {
            this.dbVersion += 1;

            this.chatDB = window.indexedDB.open(this.dataBaseName,this.dbVersion);

            this.chatDB.onerror = this.Onerror.bind(this);
            this.chatDB.onsuccess = this.Onsuccess.bind(this);
            this.chatDB.onupgradeneeded = (e) => {
                this.Onupgradeneeded(e,storeName);
            }
        }

    }

    Onerror(e) {
        console.error("indexedDB: error");
    }

    Onsuccess(e) {
        this.db = e.target.result;
        this.dbVersion = this.db.version;
        this.stores = Object.values(e.target.result.objectStoreNames);
    }

    Onupgradeneeded(e,storeName) {
        this.db = e.target.result;
        this.db.createObjectStore(storeName, {keyPath : 'talkId'})
    }

    Put(storeName, talkId, file) {

        let trans = this.db.transaction([storeName], 'readwrite');
        let store = trans.objectStore(storeName);
        let putReq = store.put({
            'talkId': talkId,
            'file': file
        });

        putReq.onsuccess = (e) => {
            let result = (e.target) ? e.target.result : e.result;
            console.log('put data success');
        }
        trans.oncomplete = () => {
            console.log('transaction complete');
        }

    }

    Get(storeName,talkId) {

        let trans = this.db.transaction([storeName], 'readonly');
        let store = trans.objectStore(storeName);
        let getReq = store.get(talkId);

        getReq.onsuccess = (e) => {
            let result = (e.target) ? e.target.result : e.result;
            console.log(result);
        }

    }

    GetAll(storeName) {

        let trans = this.db.transaction([storeName], 'readonly');
        let range = IDBKeyRange.lowerBound(0);
        let store = trans.objectStore(storeName);
        let cursorRequest = store.openCursor(range);

        cursorRequest.onsuccess = (e) => {
            let result = e.target.result;
            if (!!result == false) return;
            console.log(result.value);
            result.continue();
        }

    }

}

export default ChatIndexDB;

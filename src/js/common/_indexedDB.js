class ChatIndexDB {

    constructor(storeName) {

        this.dataBaseName = "ChatDatabase";
        this.chatDB = null;
        this.db = null;
        this.dbVersion = 0;
        this.stores = [];

        this.Init();

    }

    Init() {
        this.chatDB = window.indexedDB.open(this.dataBaseName);
        this.chatDB.onerror = this.Onerror.bind(this);
        this.chatDB.onsuccess = this.Onsuccess.bind(this);
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

    Set(storeName,callback) {

        if( this.stores.indexOf(storeName) == -1 ) {

            this.db.close();

            this.dbVersion += 1;

            this.chatDB = window.indexedDB.open(this.dataBaseName,this.dbVersion);

            this.chatDB.onerror = this.Onerror.bind(this);
            this.chatDB.onsuccess = (e) => {
                this.Onsuccess(e);
                callback();
            }
            this.chatDB.onupgradeneeded = (e) => {
                this.Onupgradeneeded(e,storeName);
            }
        } else {
            callback();
        }

    }

    Put(storeName,putData) {

        if( !putData ) return true;

        let trans = this.db.transaction([storeName], 'readwrite'),
            store = trans.objectStore(storeName),
            putReq = store.put(putData);

        putReq.onsuccess = (e) => {
            let result = (e.target) ? e.target.result : e.result;
            console.log('put data success');
        }
        trans.oncomplete = () => {
            console.log('transaction complete');
        }

    }

    Get(getData,callback) {

        if( !getData && !this.db ) return true;

        let trans = this.db.transaction([getData.storeName], 'readonly'),
            store = trans.objectStore(getData.storeName),
            getReq = store.get(getData.talkId);

        getReq.onsuccess = callback;

    }

    GetAll(storeName,callback) {

        if( !this.db ) return true;

        let trans = this.db.transaction([storeName], 'readonly'),
            range = IDBKeyRange.lowerBound(0),
            store = trans.objectStore(storeName),
            cursorRequest = store.openCursor(range);

        cursorRequest.onsuccess = callback;
    }

    Delete(storeName,talkId) {

        if( !this.db ) return true;

        let trans = this.db.transaction([storeName], 'readwrite'),
            store = trans.objectStore(storeName),
            deleteRequest = store.delete(talkId);

        deleteRequest.onsuccess = (e) => {
            console.log("delete");
        };
    }

    RemoveStore(storeName) {

        if( this.stores.indexOf(storeName) >= 0 ) {
            // console.log(this.stores,storeName);
            this.db.close();
            this.dbVersion += 1;
            this.chatDB = window.indexedDB.open(this.dataBaseName,this.dbVersion);
            this.chatDB.onupgradeneeded = (e) => {
                let db = e.target.result;
                db.deleteObjectStore(storeName)
            }
        }

    }

}

export default ChatIndexDB;

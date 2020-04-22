class StorageManager {
    myStorage: Storage;
    constructor(storage: Storage) {
        this.myStorage = storage;
    }
    saveToStorage(storageKey: string, object: object) {
        if (this.myStorage) {
            this.myStorage.setItem(storageKey, JSON.stringify(object));
        }
    }
    getFromStorage<T>(storageKey: string): T | undefined {
        if (this.myStorage) {
            const raw = this.myStorage.getItem(storageKey);
            if (raw) {
                return JSON.parse(raw);
            }
        }
    }
    clearStorage(storageKey: string) {
        if (this.myStorage) {
            this.myStorage.removeItem(storageKey);
        }
    }
}

export default StorageManager;

export const useIndexedDb = () => {
  let _database = null;
  const TRANSACTION_NAME = 'kanduus';
  const OBJECT_STORE_NAME = 'kanduus';
  const DB_NAME = 'kanduuDB'

  function getDatabase() {
    return new Promise((res, rej) => {
      if (_database) {
        res(_database);
      }

      let request = window.indexedDB.open(DB_NAME, 1);

      request.onerror = (event) => {
        console.error("Error: Unable to open database", event);
        rej("Error");
      };

      request.onsuccess = (event) => {
        _database = event.target.result;
        res(_database);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(OBJECT_STORE_NAME, {
          autoIncrement: true,
          keyPath: "id",
        });
      };
    });
  }

  async function getKanduuStore() {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(TRANSACTION_NAME, "readonly");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      let kanduuList = [];
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          kanduuList.push(cursor.value);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        resolve(kanduuList);
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  async function getKanduu(kanduuId) {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(TRANSACTION_NAME, "readonly");
      const store = transaction.objectStore(OBJECT_STORE_NAME);
      const objectStoreRequest = store.get(kanduuId);

      objectStoreRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  async function saveKanduu(kanduu) {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(TRANSACTION_NAME, "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      store.put(kanduu);

      transaction.oncomplete = () => {
        resolve("item successfully saved.");
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  async function deleteKanduu(kanduuId) {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(TRANSACTION_NAME, "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      store.delete(kanduuId);

      transaction.oncomplete = () => {
        resolve("item successfully deleted.");
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  return { getKanduuStore, getKanduu, saveKanduu, deleteKanduu };
};

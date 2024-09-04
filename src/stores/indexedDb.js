export const useIndexedDb = () => {
  let _database = null;
  const TRANSACTION_NAME = 'kanduus';
  const OBJECT_STORE_NAME = 'kanduus';
  const DB_NAME = 'kanduuDB';
  const VERSION = 2;

  function getStoreData(database) {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject('getStoreData called without a valid database argument')
      }
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
    })
  }

  function getItem(database, itemId) {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject('getItem called without a valid database argument')
      }
      const transaction = database.transaction(TRANSACTION_NAME, "readonly");
      const store = transaction.objectStore(OBJECT_STORE_NAME);
      const objectStoreRequest = store.get(itemId);

      objectStoreRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  function putItem(database, item) {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject('putItem called without a valid database argument')
      }
      const transaction = database.transaction(TRANSACTION_NAME, "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      store.put(item);

      transaction.oncomplete = () => {
        resolve("item successfully saved.");
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  function deleteItem(database, itemId) {
    return new Promise((resolve, reject) => {
      if (!database) {
        reject('deleteItem called without a valid database argument')
      }
      const transaction = database.transaction(TRANSACTION_NAME, "readwrite");
      const store = transaction.objectStore(OBJECT_STORE_NAME);

      store.delete(itemId);

      transaction.oncomplete = () => {
        resolve("item successfully deleted.");
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  function getDatabase() {
    return new Promise((res, rej) => {
      if (_database) {
        res(_database);
      }

      let request = window.indexedDB.open(DB_NAME, VERSION);

      request.onerror = (event) => {
        console.error("Error: Unable to open database", event);
        rej("Error");
      };

      request.onsuccess = (event) => {
        _database = event.target.result;
        res(_database);
      };

      request.onupgradeneeded = async (event) => {
        console.log(`old db version found: ${event.oldVersion}`)
        const db = event.target.result;
        // we could be more strategic based off the version we are
        // upgrading from but for now... just delete everything and start new
        // ... could migrate data from an object store for instance...
        let oldKanduus = []
        if (db.objectStoreNames.length && db.objectStoreNames[0] === OBJECT_STORE_NAME) {
          oldKanduus = await getStoreData()
          // TODO: can update these javascript objects to the 'latest' schema
          db.deleteObjectStore(OBJECT_STORE_NAME)
        }
        db.createObjectStore(OBJECT_STORE_NAME, {
          autoIncrement: true,
          keyPath: "id",
        });
        if (oldKanduus.length) {
          const promisesArray = oldKanduus.map((oldKanduu) => putItem(db, oldKanduu))
          await Promise.all(promisesArray);
        }
        return 42
      };
    });
  }

  async function getKanduuStore() {
    const database = await getDatabase();
    const kanduus = await getStoreData(database);
    return kanduus;
  }

  async function getKanduu(kanduuId) {
    const database = await getDatabase();
    const kanduuItem = await getItem(database, kanduuId);
    return kanduuItem;
  }

  async function saveKanduu(kanduu) {
    const database = await getDatabase();
    const success = await putItem(database, kanduu);
    return success;
  }

  async function deleteKanduu(kanduuId) {
    const database = await getDatabase();
    const success = await deleteItem(database, kanduuId);
    return success;
  }

  return { getKanduuStore, getKanduu, saveKanduu, deleteKanduu };
};

export const useIndexedDb = () => {
  let _database = null;

  function getDatabase() {
    return new Promise((res, rej) => {
      if (_database) {
        res(_database);
      }

      let request = window.indexedDB.open("todomvcDB", 1);

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
        db.createObjectStore("todos", {
          autoIncrement: true,
          keyPath: "id",
        });
      };
    });
  }

  async function getTodoStore() {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("todos", "readonly");
      const store = transaction.objectStore("todos");

      let todoList = [];
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          todoList.push(cursor.value);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        resolve(todoList);
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  async function getTodo(todoId) {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("todos", "readonly");
      const store = transaction.objectStore("todos");
      const objectStoreRequest = store.get(todoId);

      objectStoreRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  async function saveTodo(todo) {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("todos", "readwrite");
      const store = transaction.objectStore("todos");

      store.put(todo);

      transaction.oncomplete = () => {
        resolve("item successfully saved.");
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  async function deleteTodo(todoId) {
    const database = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("todos", "readwrite");
      const store = transaction.objectStore("todos");

      store.delete(todoId);

      transaction.oncomplete = () => {
        resolve("item successfully deleted.");
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
  }

  return { getTodoStore, getTodo, saveTodo, deleteTodo };
};

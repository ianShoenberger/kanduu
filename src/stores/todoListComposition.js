import { defineStore } from "pinia";
import { ref } from "vue";
import { useIndexedDb } from "./indexedDb";

const indexedDb = useIndexedDb();

export const useTodoListStore = defineStore("todoList", () => {
  // state
  const todoList = ref([]);
  const id = ref(0);
  // getters
  async function getTodoList() {
    // -- this really isn't a getter since it's not a computed
    const todos = await indexedDb.getTodoStore();
    todoList.value = todos;
    if (todos.length) {
      id.value = todos[todos.length - 1].id + 1;
    }
    return todoList;
  }
  async function getTodo(todoId) {
    // this primes the store
    await getTodoList();
    const todo = todoList.value.find((todo) => todo.id === todoId);
    return todo;
  }
  // actions
  async function addToDo(item) {
    const newTodo = { item, id: id.value++, completed: false };
    todoList.value.push(newTodo);
    await indexedDb.saveTodo(newTodo);
  }
  async function deleteToDo(itemId) {
    todoList.value = todoList.value.filter((todo) => todo.id !== itemId);
    await indexedDb.deleteTodo(itemId);
  }
  async function toggleCompleted(idToFind) {
    const todo = todoList.value.find((obj) => obj.id === idToFind);
    if (todo) {
      todo.completed = !todo.completed;
    }
    // vue is adding other kinds of data to the object
    const plainTodo = { ...todo };
    await indexedDb.saveTodo(plainTodo);
  }
  async function addCategoryItem(idToFind, newItem) {
    const todo = todoList.value.find((obj) => obj.id === idToFind);
    if (todo) {
      // vue is adding other kinds of data to the object
      const plainTodo = { ...todo };
      if (plainTodo.items) {
        plainTodo.items = [...plainTodo.items, newItem];
        todo.items.push(newItem);
      } else {
        plainTodo.items = [newItem];
        todo.items = [newItem];
      }
      await indexedDb.saveTodo(plainTodo);
    }
  }
  return {
    todoList,
    getTodoList,
    getTodo,
    id,
    addToDo,
    deleteToDo,
    toggleCompleted,
    addCategoryItem,
  };
});

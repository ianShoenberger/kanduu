<script setup>
import { ref } from "vue";
import { useTodoListStore } from "../stores/todoListComposition";

const todo = ref("");
const store = useTodoListStore();
const { addToDo } = store;

function addItemAndClear(item) {
  if (item.length === 0) {
    return;
  }
  addToDo(item);
  todo.value = "";
}
</script>

<template>
  <form @submit.prevent="addItemAndClear(todo)">
    <input v-model="todo" type="text" />
    <button>+</button>
  </form>
</template>

<style scoped></style>

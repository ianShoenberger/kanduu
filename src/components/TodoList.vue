<script setup>
import { defineEmits } from 'vue'
import { useTodoListStore } from "../stores/todoListComposition";
import { defineStore, storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const store = useTodoListStore();
const { todoList } = storeToRefs(store);
const { deleteToDo, getTodoList } = store;
const router = useRouter();

function openCategory(todoId) {
  router.push(`/category/${todoId}`);
}

getTodoList();
defineEmits(['editItem'])
</script>

<template>
  <div>
    <div v-for="todo in todoList" :key="todo.id" class="row mb-2">
      <div
        @click="openCategory(todo.id)"
        :class="{ completed: todo.completed }"
        class="todo-name col-8 d-flex justify-content-end"
      >
        <button class="btn btn-secondary">{{ todo.item }}</button>
      </div>
      <div class="col-2">
        <button class="btn btn-info" @click="$emit('editItem', todo.id)"><i class="bi-pencil-square"></i></button>
      </div>
      <div class="col-2">
        <button class="btn btn-danger" @click="deleteToDo(todo.id)"><i class="bi-x-square"></i></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.x-squre {
  font-size: 1rem;
}
</style>

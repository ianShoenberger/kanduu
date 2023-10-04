<script setup>
import { useTodoListStore } from "../stores/todoListComposition";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const store = useTodoListStore();
const { todoList } = storeToRefs(store);
const { toggleCompleted, deleteToDo, getTodoList } = store;
const router = useRouter();

function openCategory(todoId) {
  router.push(`/category/${todoId}`);
}

getTodoList();
</script>

<template>
  <div v-for="todo in todoList" :key="todo.id" class="item">
    <div class="content">
      <div
        @click="openCategory(todo.id)"
        :class="{ completed: todo.completed }"
        class="todo-name"
      >
        {{ todo.item }}
      </div>
      <div @click.stop="toggleCompleted(todo.id)">&#10004;</div>
      <div @click="deleteToDo(todo.id)" class="x">&#10060;</div>
    </div>
  </div>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
}
.content {
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>

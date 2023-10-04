<script setup>
import TodoForm from "../components/TodoForm.vue";
import TodoList from "../components/TodoList.vue";
</script>

<template>
  <div class="todo-app">
    <div class="title-text">Kanduu</div>
    <todo-form id="todoForm"></todo-form>
    <todo-list></todo-list>
  </div>
</template>

<style scoped>
#todoForm {
  margin-bottom: 1rem;
}
</style>

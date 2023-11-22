<script setup>
import { ref } from "vue";
import { useKanduuListStore } from "../stores/kanduuListComposition";

const kanduu = ref("");
const store = useKanduuListStore();
const { addKanduu } = store;

function addItemAndClear(item) {
  if (item.length === 0) {
    return;
  }
  addKanduu(item);
  kanduu.value = "";
}
</script>

<template>
  <form @submit.prevent="addItemAndClear(kanduu)">
    <input v-model="kanduu" type="text" />
    <button>+</button>
  </form>
</template>

<style scoped></style>

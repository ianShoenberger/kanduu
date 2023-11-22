<script setup>
import { useKanduuListStore } from "../stores/kanduuListComposition";
import { defineStore, storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const store = useKanduuListStore();
const { kanduuList } = storeToRefs(store);
const { deleteKanduu, getKanduuList } = store;
const router = useRouter();

function openCategory(kanduuId) {
  router.push(`/category/${kanduuId}`);
}

getKanduuList();
defineEmits(['editItem'])
</script>

<template>
  <div>
    <div v-for="kanduu in kanduuList" :key="kanduu.id" class="row mb-2">
      <div
        @click="openCategory(kanduu.id)"
        :class="{ completed: kanduu.completed }"
        class="kanduu-name col-8 d-flex justify-content-end"
      >
        <button class="btn btn-secondary">{{ kanduu.name }}</button>
      </div>
      <div class="col-2">
        <button class="btn btn-info" @click="$emit('editItem', kanduu.id)"><i class="bi-pencil-square"></i></button>
      </div>
      <div class="col-2">
        <button class="btn btn-danger" @click="deleteKanduu(kanduu.id)"><i class="bi-x-square"></i></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.x-squre {
  font-size: 1rem;
}
</style>

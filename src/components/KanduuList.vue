<script setup>
import { computed, reactive } from 'vue'
import { useKanduuListStore } from "../stores/kanduuListComposition";
import { storeToRefs } from "pinia";

const props = defineProps(['pointer'])
const store = useKanduuListStore();
const { kanduuList } = storeToRefs(store);
const { deleteKanduu, getKanduuList } = store;

getKanduuList();
defineEmits(['editItem', 'openCategory'])

const displayedList = computed(() => {
  return kanduuList.value.filter((kanduu) => kanduu.parent === props.pointer)
})
</script>

<template>
  <div>
    <div v-for="kanduu in displayedList" :key="kanduu.id" class="row mb-2">
      <div
        :class="{ completed: kanduu.completed }"
        class="kanduu-name col-8 d-flex justify-content-end"
      >
        <button class="btn btn-secondary" @click="$emit('editItem', kanduu.id)">
          <span>{{ kanduu.name }}</span><i class="ms-3 bi-pencil-square"></i>
        </button>
      </div>
      <div class="col-2">
        <button class="btn btn-info" @click="$emit('openCategory', kanduu.id)"><i class="bi-clipboard2-plus"></i></button>
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

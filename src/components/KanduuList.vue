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
    <TransitionGroup name="list">
      <div v-for="kanduu in displayedList" :key="kanduu.id" class="row mb-2">
        <div
          :class="{ completed: kanduu.completed }"
          class="kanduu-name col-8 d-flex justify-content-end"
        >
          <button class="btn btn-secondary" @click="$emit('openCategory', kanduu.id)">
            <span>{{ kanduu.name }}</span>
          </button>
        </div>
        <div class="col-2">
          <button class="btn btn-info" @click="$emit('editItem', kanduu.id)"><i class="bi-pencil-square"></i></button>
        </div>
        <div class="col-2">
          <button class="btn btn-danger" @click="deleteKanduu(kanduu.id)"><i class="bi-x-square"></i></button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

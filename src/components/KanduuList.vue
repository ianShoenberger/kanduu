<script setup>
import { computed, ref, watch } from 'vue'
import { useKanduuListStore } from "../stores/kanduuListComposition";
import { storeToRefs } from "pinia";

const props = defineProps(['pointer'])
const store = useKanduuListStore();
const { kanduuList } = storeToRefs(store);
const { deleteKanduu, getKanduuList } = store;

getKanduuList();
defineEmits(['editItem', 'openCategory'])

let currentList = ref([])
let ignoreChange = false

const displayedList = computed(() => {
  return kanduuList.value.filter((kanduu) => kanduu.parent === props.pointer)
})

watch(props, (newPointer, oldPointer) => {
  // if we have an empty list, we won't trigger the onAfterListLeave which fetches the next list
  // so we manually do the work.
  ignoreChange = true
  if (!currentList.value.length) {
    onAfterListLeave()
  } else {
    currentList.value = []
  }
})
watch(displayedList, (newList, oldList) => {
  if (oldList?.length === 0 || !ignoreChange) {
    currentList.value = displayedList.value
  }
})
function onAfterListLeave () {
  // currentList.value = kanduuList.value.filter((kanduu) => kanduu.parent === props.pointer)
  currentList.value = displayedList.value
  ignoreChange = false
}
</script>

<template>
  <div>
    <TransitionGroup name="list" @after-leave="onAfterListLeave">
      <div v-for="kanduu in currentList" :key="kanduu.id" class="row mb-2">
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
.list-enter-active {
  transition: all 0.3s ease;
}
.list-leave-active {
  transition: all 0.6s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-enter-from {
  transform: translateX(30px);
}
</style>

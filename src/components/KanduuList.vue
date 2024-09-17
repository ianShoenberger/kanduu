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
  <div id="listWrapper" class="rounded">
      <b-card-group deck>
        <b-card>
          <b-list-group>
            <TransitionGroup name="list" @after-leave="onAfterListLeave">
              <b-list-group-item v-for="kanduu in currentList" :key="kanduu.id" class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1 d-flex justify-content-center" @click="$emit('openCategory', kanduu.id)">{{ kanduu.name }}</div>
                <b-dropdown id="dropdown-dropleft" toggle-class="text-decoration-none" variant="light" dropleft no-caret>
                  <template #button-content><i class="bi bi-three-dots-vertical"></i></template>
                  <b-dropdown-item @click="$emit('editItem', kanduu.id)">Rename</b-dropdown-item>
                  <b-dropdown-item @click="deleteKanduu(kanduu.id)">Remove</b-dropdown-item>
                </b-dropdown>
              </b-list-group-item>
            </TransitionGroup>
          </b-list-group>
        </b-card>
      </b-card-group>
      <!-- <div v-for="kanduu in currentList" :key="kanduu.id" class="row mb-2">
        <div
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
      </div> -->
  </div>
</template>

<style scoped>
#listWrapper {
  border: 1px solid black;
  padding: 0.5rem;
}
.card {
  border-color: var(--orange-color);
}
.list-group-item {
  border: none;
}
.list-enter-active {
  transition: all 0.2s ease-in;
  transition-delay: 0.2s;
}
.list-leave-active {
  transition: all 0.4s linear;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-enter-from {
  transform: translateX(200px);
}
</style>

<script setup>
import { computed, ref, watch } from 'vue'
import { useKanduuListStore } from "../stores/kanduuListComposition";
import { storeToRefs } from "pinia";

const props = defineProps(['pointer'])
const store = useKanduuListStore();
const { kanduuList } = storeToRefs(store);
const { deleteKanduu, getKanduuList } = store;

getKanduuList();
const emit = defineEmits(['editItem', 'openCategory', 'duu']);

let currentList = ref([])
let ignoreChange = false

const displayedList = computed(() => {
  return kanduuList.value.filter((kanduu) => kanduu.parent === props.pointer && kanduu.show)
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

function getDisplayDate(dates) {
  let retVal = '';
  if (dates.length) {
    const mostRecentDate = new Date(dates[dates.length - 1]);
    retVal = mostRecentDate.toLocaleDateString();
  }
  return retVal;
}
</script>

<template>
  <div id="listWrapper" class="rounded">
    <b-card-group deck>
      <b-card>
        <b-list-group>
          <TransitionGroup name="list" @after-leave="onAfterListLeave">
            <b-list-group-item v-for="kanduu in currentList" :key="kanduu.id" class="d-flex justify-content-between align-items-center">
              <div class="flex-grow-1 d-flex justify-content-center" @click="$emit('openCategory', kanduu.id)">
                <div class="w-50">
                  <i v-if="!kanduu.isLeaf" class="bi bi-folder me-3"></i>
                  <span class="duu-date">
                    {{ getDisplayDate(kanduu.datesDone) }}
                  </span>
                </div>
                <div class="w-50">
                  {{ kanduu.name }}
                </div>
              </div>
              <b-dropdown id="dropdown-dropleft" toggle-class="text-decoration-none" variant="light" dropleft no-caret>
                <template #button-content><i class="bi bi-three-dots-vertical"></i></template>
                <b-dropdown-item @click="$emit('duu', kanduu.id)">duu</b-dropdown-item>
                <b-dropdown-item @click="$emit('editItem', kanduu.id)">edit</b-dropdown-item>
                <b-dropdown-item @click="deleteKanduu(kanduu.id)">remove</b-dropdown-item>
              </b-dropdown>
            </b-list-group-item>
          </TransitionGroup>
        </b-list-group>
      </b-card>
    </b-card-group>
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

.duu-date {
  font-size: 0.75rem;
  opacity: 0.8;
}
.list-group {
  max-height: 460px;
  overflow-y: scroll;
}
.list-group-item {
  border-top: none;
  border-left: none;
  border-right: none;
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

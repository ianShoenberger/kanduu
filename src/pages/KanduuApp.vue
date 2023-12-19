<script setup>
import { ref } from 'vue'
// import EditModal from "../components/EditModal.vue";
import KanduuList from "../components/KanduuList.vue";
import RandomWheel from "../components/RandomWheel.vue";
import { useKanduuListStore } from "../stores/kanduuListComposition";

const store = useKanduuListStore();
const { addKanduu } = store;

const newKanduu = ref('')
const editedKanduuId = ref(-1)
const showInputModal = ref(false)
const inputPlaceholder = ref(`Try "Movies"`)
const pointer = ref(null)
const currentLevelName = ref('')
const showCarousel = ref(false)

function discardEdits() {
  newKanduu.value = ''
  editedKanduuId.value = -1
}
function saveKanduu(item) {
  if (item.length === 0) {
    return;
  } else if (editedKanduuId.value >= 0) {
    store.editName(editedKanduuId.value, item)
    editedKanduuId.value = -1
  } else {
    addKanduu(item, pointer.value);
  }
  newKanduu.value = ''

}
async function editItem(kanduuId) {
  const kanduu = await store.getKanduu(kanduuId);
  newKanduu.value = kanduu.name
  editedKanduuId.value = kanduuId
  showInputModal.value = true
}

async function openCategory(kanduuId) {
  const kanduu = await store.getKanduu(kanduuId);
  currentLevelName.value = kanduu.name;
  pointer.value = kanduuId;
  inputPlaceholder.value = `Something about "${kanduu.name}"`;
}

async function goBack() {
  if (pointer.value === null) return
  const kanduu = await store.getKanduu(pointer.value);
  if (kanduu.parent !== null) {
    const prevLevel = await store.getKanduu(kanduu.parent)
    currentLevelName.value = prevLevel.name
    pointer.value = prevLevel.id;
  } else {
    currentLevelName.value = ''
    pointer.value = null
  }
}

function rollDice() {
  showCarousel.value = true
}

</script>

<template>
  <div class="container pt-5">
    <div v-show="pointer !== null" @click="goBack"><i class="bi-arrow-left-square"></i></div>
    <h1 class="title-text text-center">Kanduu</h1>
    <h2 v-show="pointer !== null" class="text-center">{{ currentLevelName }}</h2>
    <div class="row justify-content-center mt-4">
      <BButton variant="info" @click="showInputModal = !showInputModal" class="w-25"><i class="bi-plus-square"></i></BButton>
      <BButton class="w-25" variant="primary" @click="rollDice">
        <i class="bi-dice-5"></i>
      </BButton>
    </div>
    <random-wheel v-if="showCarousel" :pointer=pointer></random-wheel>
    <kanduu-list v-else class="mt-5" :pointer=pointer @edit-item="editItem" @open-category="openCategory"></kanduu-list>
    <BModal 
      id="inputModal"
      title="Edit"
      hideFooter="false"
      v-model="showInputModal"
      @ok="saveKanduu(newKanduu)"
      @close="discardEdits"
      @cancel="discardEdits"
    >
      <BFormInput v-model="newKanduu" id="kanduuItem" autofocus :placeholder="inputPlaceholder" />
    </BModal>
  </div>
</template>

<style scoped>
</style>

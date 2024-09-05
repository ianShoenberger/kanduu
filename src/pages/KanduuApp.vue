<script setup>
import { ref } from 'vue'
// import EditModal from "../components/EditModal.vue";
import KanduuList from "../components/KanduuList.vue";
import RandomWheel from "../components/RandomWheel.vue";
import { useKanduuListStore } from "../stores/kanduuListComposition";

const store = useKanduuListStore();
const { addKanduu, duuKanduu, getKanduu } = store;

const newKanduu = ref('')
const editedKanduuId = ref(-1)
const showInputModal = ref(false)
const duKanduuId = ref(-1)
const showDuuPrompt = ref(false)
const duuPromptTitle = ref('')
const originalPlaceholderText = `Try "Movies"`
const inputPlaceholder = ref(originalPlaceholderText)
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
  const kanduu = await getKanduu(kanduuId);
  newKanduu.value = kanduu.name
  editedKanduuId.value = kanduuId
  showInputModal.value = true
}

async function openCategory(kanduuId) {
  const kanduu = await getKanduu(kanduuId);
  currentLevelName.value = kanduu.name;
  pointer.value = kanduuId;
  inputPlaceholder.value = `Something about "${kanduu.name}"`;
}

async function goBack() {
  if (pointer.value === null) return
  const kanduu = await getKanduu(pointer.value);
  if (kanduu.parent !== null) {
    const prevLevel = await getKanduu(kanduu.parent)
    currentLevelName.value = prevLevel.name
    pointer.value = prevLevel.id;
  } else {
    currentLevelName.value = ''
    pointer.value = null
    inputPlaceholder.value = originalPlaceholderText
  }
}

function rollDice() {
  showCarousel.value = true
}

async function duuItem(itemId) {
  await duuKanduu(itemId) // async
  duKanduuId.value = itemId
  duuPromptTitle.value = await getDuuPromptTitle(itemId)
  showDuuPrompt.value = true
  showCarousel.value = false
}

function removeItem() {
  // call store function to set item.show to false
  hideDuuPrompt()
}
function hideDuuPrompt() {
  showDuuPrompt.value = false
  duKanduuId.value = -1
  duuPromptTitle.value = ''
}

async function getDuuPromptTitle(kanduuId) {
  const kanduuItem = await getKanduu(kanduuId)
  return `What would you like to duu with ${kanduuItem.name}?`
}

</script>

<template>
  <div class="container pt-5">
    <div id="header">
      <div v-show="pointer !== null">
        <BButton @click="goBack">
          <i class="bi-arrow-left-square"></i>
        </BButton>
      </div>
      <h1 class="title-text text-center">Kanduu</h1>
      <h2 v-show="pointer !== null" class="text-center">{{ currentLevelName }}</h2>
      <div class="row justify-content-center mt-4">
        <BButton variant="info" @click="showInputModal = !showInputModal" class="w-25 me-2"><i class="bi-plus-square"></i></BButton>
        <BButton class="w-25" variant="primary" @click="rollDice">
          <i class="bi-dice-5"></i>
        </BButton>
      </div>
    </div>
    <random-wheel v-if="showCarousel" :pointer=pointer @close="showCarousel=false" @duu="duuItem"></random-wheel>
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
    <BModal 
      id="duuModal"
      title="Nice!"
      hideFooter="true"
      v-model="showDuuPrompt"
    >
      <h5 class="mb-5">{{ duuPromptTitle }}</h5>
      <div class="w-100 d-flex justify-content-end">
        <b-button
          variant="secondary"
          size="md"
          @click="hideDuuPrompt"
        >
          Keep 
        </b-button>
        <b-button
          variant="danger"
          size="md"
          class="ms-2"
          @click="removeItem"
        >
          Discard
        </b-button>
      </div>
    </BModal>
  </div>
</template>

<style scoped>
#header {
  position: sticky;
  top: 0;
}
</style>

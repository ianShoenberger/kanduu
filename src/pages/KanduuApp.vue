<script setup>
import { ref } from 'vue'
import KanduuList from "../components/KanduuList.vue";
import RandomWheel from "../components/RandomWheel.vue";
import { useKanduuListStore } from "../stores/kanduuListComposition";

const store = useKanduuListStore();
const { addKanduu, duuKanduu, getKanduu, editKanduu } = store;

const editKanduuObj = ref({
  id: -1,
  name: '',
  isLeaf: false,

});
const showInputModal = ref(false)
const duKanduuId = ref(-1)
const showDuuPrompt = ref(false)
const duuPromptTitle = ref('')
const originalPlaceholderText = `Try "Movies"`
const inputPlaceholder = ref(originalPlaceholderText)
const pointer = ref(null)
const currentLevelName = ref('Welcome')
const showCarousel = ref(false)

function discardEdits() {
  editKanduuObj.value.id = -1;
  editKanduuObj.value.name = '';
  editKanduuObj.value.isLeaf = false;
}
function saveKanduu() {
  if (editKanduuObj.value.name.length === 0) {
    return;
  } else if (editKanduuObj.value.id >= 0) {
    editKanduu(editKanduuObj.value.id, editKanduuObj.value.name, editKanduuObj.value.isLeaf);
  } else {
    addKanduu(editKanduuObj.value.name, editKanduuObj.value.isLeaf, pointer.value);
  }
  discardEdits();
}
async function editItem(kanduuId) {
  const kanduu = await getKanduu(kanduuId);
  editKanduuObj.value.name = kanduu.name;
  editKanduuObj.value.id = kanduuId
  editKanduuObj.value.isLeaf = kanduu.isLeaf
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
    currentLevelName.value = 'Welcome'
    pointer.value = null
    inputPlaceholder.value = originalPlaceholderText
  }
}

function rollDice() {
  showCarousel.value = true
}

async function duuItem(itemId) {
  duKanduuId.value = itemId
  duuPromptTitle.value = await getDuuPromptTitle(itemId)
  showDuuPrompt.value = true
  showCarousel.value = false
}

function removeItem() {
  // call store function to set item.show to false
  hideDuuPrompt()
}
async function hideDuuPrompt(willHideItem) {
  await duuKanduu(duKanduuId.value, willHideItem)
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
      <BButton v-show="pointer !== null" variant="outline-secondary" @click="goBack" class="position-fixed">
        <i class="bi-arrow-left-square"></i>
      </BButton>
      <div class="d-flex justify-content-center">
        <div class="title-text text-primary">
          <u>
            <span class="k-title">K</span>
            <span class="a-title">a</span>
            <span class="n-title">n</span>
            <span class="d-title">d</span>
            <span class="u-title">u</span>
            <span class="u-title">u</span>
          </u>
        </div>
      </div>
      <h2 :class="{ 'invisible': pointer === null }" class="text-center">{{ currentLevelName }}</h2>
      <div class="row justify-content-center mt-3">
        <BButton variant="secondary" @click="showInputModal = !showInputModal" class="w-25 me-2"><i class="bi-plus-square"></i></BButton>
        <BButton class="w-25" variant="primary" @click="rollDice">
          <i class="bi-dice-5"></i>
        </BButton>
      </div>
    </div>
    <random-wheel v-if="showCarousel" :pointer=pointer @close="showCarousel=false" @duu="duuItem"></random-wheel>
    <kanduu-list v-else class="mt-4" :pointer=pointer @edit-item="editItem" @duu="duuItem" @open-category="openCategory"></kanduu-list>
    <BModal 
      id="inputModal"
      title="Edit"
      hideFooter="false"
      v-model="showInputModal"
      @ok="saveKanduu"
      @close="discardEdits"
      @cancel="discardEdits"
    >
      <BFormInput class="mb-3" v-model="editKanduuObj.name" id="kanduuItem" autofocus :placeholder="inputPlaceholder" />
      <b-form-radio v-model="editKanduuObj.isLeaf" name="some-radios" :value="false">Category</b-form-radio>
      <b-form-radio v-model="editKanduuObj.isLeaf" name="some-radios" :value="true">Item</b-form-radio>
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
          @click="hideDuuPrompt(false)"
        >
          Keep 
        </b-button>
        <b-button
          variant="danger"
          size="md"
          class="ms-2"
          @click="hideDuuPrompt(true)"
        >
          Discard
        </b-button>
      </div>
    </BModal>
  </div>
</template>

<style scoped>
.title-text {
  text-shadow: 2px 2px 1px var(--orange-color);
  font-size: 3rem;
  padding: 0px 1.5rem;
}
.k-title {
  color: var(--red-color);
}
.a-title {
  color: var(--green-color);
}
.n-title {
  color: var(--yellow-color);
}
.d-title {
  color: var(--orange-color);
}
.u-title {
  color: var(--blue-color);
}
.u2-title {
  color: white;
}
#header {
  position: sticky;
  top: 0;
}
.invisible {
  visibility: hidden;
}
</style>

<script setup>
import { ref } from 'vue'
// import EditModal from "../components/EditModal.vue";
import TodoList from "../components/TodoList.vue";
import { useTodoListStore } from "../stores/todoListComposition";

const store = useTodoListStore();
const { addToDo } = store;

const newKanduu = ref('')
const editedKanduuId = ref(-1)
const showInputModal = ref(false)
const inputPlaceholder = ref(`Try "Movies"`)

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
    addToDo(item);
  }
  newKanduu.value = ''

}
async function editItem(kanduuId) {
  const newToDo = await store.getTodo(kanduuId);
  newKanduu.value = newToDo.item
  editedKanduuId.value = kanduuId
  showInputModal.value = true
}

</script>

<template>
  <div class="container pt-5">
    <h1 class="title-text text-center">Kanduu</h1>
    <todo-list class="mt-5" @edit-item="editItem"></todo-list>
    <div class="row justify-content-center mt-4">
      <BButton variant="info" @click="showInputModal = !showInputModal" class="w-25"><i class="bi-plus-square"></i></BButton>
    </div>
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

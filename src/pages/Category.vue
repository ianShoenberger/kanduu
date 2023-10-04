<script setup>
import { useTodoListStore } from "../stores/todoListComposition";
import { useRoute } from "vue-router";
import { nextTick, onMounted, ref } from "vue";

const store = useTodoListStore();
const route = useRoute();
const category = ref({});
const newItem = ref("");
const show = ref(false);
const categoryId = Number(route.params.categoryId);
let itemsSubList = [];
const selectedItem = ref("");

onMounted(async () => {
  const result = await store.getTodo(categoryId);
  category.value = result;
});
async function addItemAndClear() {
  await store.addCategoryItem(categoryId, newItem.value);
  itemsSubList.push(newItem.value);
  newItem.value = "";
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function rollDice() {
  if (category.value.items?.length === 0) {
    return;
  }

  if (selectedItem.value === "" || itemsSubList.length === 0) {
    itemsSubList = [...category.value.items];
  }
  const randomArrayIndex = getRandomInt(itemsSubList.length) - 1;
  show.value = false;
  setTimeout(() => {
    selectedItem.value = itemsSubList.splice(randomArrayIndex, 1)[0];
    show.value = true;
  }, 0);
}
</script>

<template>
  <div>
    <div class="title-text">Kanduu Items</div>
    <h2>{{ category.item }}</h2>
    <form @submit.prevent="addItemAndClear">
      <input v-model="newItem" type="text" />
      <button>+</button>
    </form>
    <div id="randomContainer">
      <button v-if="category.items?.length" @click="rollDice">
        Roll Dice!
      </button>
      <Transition
        ><h3 v-if="show">{{ selectedItem }}</h3></Transition
      >
    </div>
    <div id="itemsContainer">
      <div
        v-for="categoryItem in category.items"
        :key="categoryItem"
        class="item"
      >
        {{ categoryItem }}
      </div>
    </div>
  </div>
</template>

<style scoped>
form {
  margin-bottom: 1rem;
}
#randomContainer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
}
#itemsContainer {
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  padding-left: 3rem;
  padding-right: 3rem;
  line-height: 1.4;
}
.v-enter-active {
  transition: opacity 2s ease;
}

.v-enter-from {
  opacity: 0;
}
.item {
  border-bottom: black 1px solid;
}
</style>

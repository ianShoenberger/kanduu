<script setup>
import { useTodoListStore } from "../stores/todoListComposition";
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";

const store = useTodoListStore();
const route = useRoute();
const category = ref({});
const newItem = ref('');
const showCarousel = ref(false);
const categoryId = Number(route.params.categoryId);
let itemsSubList = [];
const selectedItem = ref('');
const selectedIndex = ref(null)
const cellSize = 210

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
  if (numberOfCategoryItems.value === 0) {
    return;
  }

  showCarousel.value = true

  // if (selectedItem.value === "" || itemsSubList.length === 0) {
  if (selectedIndex.value === null || itemsSubList.length === 0) {
    itemsSubList = [...category.value.items];
  }
  const randomArrayIndex = getRandomInt(itemsSubList.length) - 1;
  // selectedItem.value = itemsSubList.splice(randomArrayIndex, 1)[0];
  const poppedItem = itemsSubList.splice(randomArrayIndex, 1)[0];
  // find in the original array
  selectedIndex.value = category.value.items.findIndex(categoryItem => categoryItem === poppedItem)
}

const numberOfCategoryItems = computed(() => category.value.items?.length)

const zTranslate = computed(() => {
  return Math.round( ( cellSize / 2 ) /  Math.tan( Math.PI / numberOfCategoryItems.value ) );
})

function getRotateX(cellIndex) {
  const rotateXValue = Math.round((360 / numberOfCategoryItems.value) * cellIndex)
  return rotateXValue
}

const carouselStyle = computed(() => {
  const rotateX = getRotateX(selectedIndex.value) + 1080 // 1080 is 3 revolutions
  return `transform: translateZ(-${zTranslate.value}px) rotateX(-${rotateX}deg)`
})

</script>

<template>
  <div>
    <div class="title-text">Kanduu Items</div>
    <h2>{{ category.item }}</h2>
    <form @submit.prevent="addItemAndClear">
      <input v-model="newItem" type="text" />
      <button>+</button>
    </form>
    <button v-if="category.items?.length" @click="rollDice">
      Roll Dice!
    </button>
    <div v-if="showCarousel" id="randomContainer">
      <div id="random3DScene">
        <div id="carousel" :style="carouselStyle">
          <div
            v-for="(carouselItem, index) in category.items"
            :key="index" 
            class="carousel-cell"
            :style="{ transform: `rotateX(${getRotateX(index)}deg) translateZ(${zTranslate}px)`}">
              {{ carouselItem }}
          </div>
        </div>
      </div>
    </div>
    <div v-else id="itemsContainer">
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
* { box-sizing: border-box; }
form {
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
.item {
  border-bottom: black 1px solid;
}

#randomContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 140px;
}

#random3DScene {
  width: 170px;
  height: 140px;
  position: relative;
  perspective: 1000px;
  margin: 40px auto;
}

#carousel {
  width: 100%;
  height: 100%;
  position: relative; /* should this be absolute? */
  transform-style: preserve-3d;
  transition: transform 1s;
}

.carousel-cell {
  position: absolute;
  border: 2px solid black;
  font-weight: bold;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: grey;
  font-size: 30px;
  color: white
}
</style>

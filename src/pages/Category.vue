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
const selectedIndex = ref(null)
const cellSize = 140
let lastRotateX = 0
const showInputModal = ref(false)

onMounted(async () => {
  const result = await store.getTodo(categoryId);
  category.value = result;
});
async function addItemAndClear() {
  await store.addCategoryItem(categoryId, newItem.value);
  itemsSubList.push(newItem.value);
  newItem.value = "";
}
function discardEdits() {
  newItem.value = ''
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function rollDice() {
  if (numberOfCategoryItems.value === 0) {
    return;
  }

  showCarousel.value = true

  if (selectedIndex.value === null || itemsSubList.length === 0) {
    itemsSubList = [...category.value.items];
  }
  const randomArrayIndex = getRandomInt(itemsSubList.length) - 1;
  const poppedItem = itemsSubList.splice(randomArrayIndex, 1)[0];
  // find in the original array
  selectedIndex.value = category.value.items.findIndex(categoryItem => categoryItem === poppedItem)
}

const numberOfCategoryItems = computed(() => category.value.items?.length)

const zTranslate = computed(() => {
  const heightOfCell = cellSize + 20 // give some padding
  return Math.round( ( heightOfCell / 2 ) /  Math.tan( Math.PI / numberOfCategoryItems.value ) );
})

function getRotateX(cellIndex) {
  const rotateXValue = Math.round((360 / numberOfCategoryItems.value) * cellIndex)
  return rotateXValue
}

const carouselStyle = computed(() => {
  const rotateX = getRotateX(selectedIndex.value) + 1080 // 1080 is 3 revolutions
  const newRotateX = lastRotateX - rotateX
  lastRotateX = newRotateX
  return `transform: translateZ(-${zTranslate.value}px) rotateX(${newRotateX}deg)`
})

</script>

<template>
  <div class="container pt-4">
    <router-link to="/"><i class="bi-arrow-left-square"></i></router-link>
    <div class="title-text text-center">Kanduu Items</div>
    <h2 class="text-center">{{ category.item }}</h2>
    <div class="row justify-content-center mt-4">
      <BButton variant="info" @click="showInputModal = !showInputModal" class="w-25"><i class="bi-plus-square"></i></BButton>
    </div>
    <BModal 
      id="inputModal"
      title="Edit"
      hideFooter="false"
      v-model="showInputModal"
      @ok="addItemAndClear(newItem)"
      @close="discardEdits"
      @cancel="discardEdits"
    >
      <BFormInput v-model="newItem" id="kanduuItem" autofocus placeholder="Movies" />
    </BModal>
    <div class="row justify-content-center mt-4">
      <BButton class="w-25" variant="primary" v-if="category.items?.length" @click="rollDice">
        Roll Dice!
      </BButton>
    </div>
    <div v-if="showCarousel" id="randomContainer">
      <div id="backgroundOverlay" class="w-100 h-100" @click="showCarousel = false"></div>
      <div id="random3DScene" @click="rollDice">
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
    <BListGroup v-else id="itemsContainer" class="mt-4">
      <BListGroupItem
        v-for="categoryItem in category.items"
        :key="categoryItem"
        class="item text-center"
      >
        {{ categoryItem }}
      </BListGroupItem>
    </BListGroup>
  </div>
</template>

<style scoped>
i {
  font-size: 1.5rem;
}
* { box-sizing: border-box; }

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
  transition: transform 2s cubic-bezier(.49,.88,.14,.94);
}

.carousel-cell {
  position: absolute;
  border: 2px solid black;
  font-weight: bold;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: var(--bs-red);
  font-size: 30px;
  color: white
}

#backgroundOverlay {
  background: black;
  opacity: 0.4;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useKanduuListStore } from "../stores/kanduuListComposition";
import { storeToRefs } from "pinia";

const props = defineProps(['pointer'])
const showCarousel = ref(false)
const store = useKanduuListStore();
// const { kanduuList } = storeToRefs(store);
const { getKanduuList, getKanduuChildren } = store;
const displayedList = ref([]);

// getKanduuList();

// const displayedList = computed(() => {
//   return kanduuList.value.filter((kanduu) => kanduu.parent === props.pointer)
// })
const numberOfCategoryItems = computed(() => {
  return displayedList.value.length
})

const selectedIndex = ref(null);
let itemsSubList = [];
const cellSize = 140;
let lastRotateX = 0;

onMounted(async () => {
  displayedList.value = await getKanduuChildren(props.pointer);
})

/** dice random stuff */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function rollDice() {
  if (numberOfCategoryItems.value === 0) {
    return;
  }

  setTimeout(() => {
    if (selectedIndex.value === null || itemsSubList.length === 0) {
      itemsSubList = [...displayedList.value];
    }
    const randomArrayIndex = getRandomInt(itemsSubList.length) - 1;
    console.log(randomArrayIndex);
    const poppedItem = itemsSubList.splice(randomArrayIndex, 1)[0];
    // find in the original array
    selectedIndex.value = displayedList.value.findIndex(categoryItem => categoryItem.id === poppedItem.id)
  }, 0)
}

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
  <div id="randomContainer">
    <div id="backgroundOverlay" class="w-100 h-100" @click="showCarousel = false"></div>
    <div id="random3DScene" @click="rollDice">
      <div id="carousel" :style="carouselStyle">
        <div
          v-for="(carouselItem, index) in displayedList"
          :key="index" 
          class="carousel-cell"
          :style="{ transform: `rotateX(${getRotateX(index)}deg) translateZ(${zTranslate}px)`}">
            {{ carouselItem.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
  position: absolute;
  top: 0;
  left: 0;
}
</style>
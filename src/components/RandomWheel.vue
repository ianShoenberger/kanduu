<script setup>
import { ref, computed, onMounted } from 'vue'
import { useKanduuListStore } from "../stores/kanduuListComposition";
import { storeToRefs } from "pinia";

const props = defineProps(['pointer'])
const store = useKanduuListStore();
// const { kanduuList } = storeToRefs(store);
const { getKanduuList, getKanduuChildren } = store;
const displayedList = ref([]);
const emit = defineEmits(['close', 'duu']);

// getKanduuList();

// const displayedList = computed(() => {
//   return kanduuList.value.filter((kanduu) => kanduu.parent === props.pointer)
// })
const numberOfCategoryItems = computed(() => {
  return displayedList.value.length
})

const selectedIndex = ref(null);
const isButtonDisabled = ref(false)
let itemsSubList = [];
const cellSize = 140;
let numOfSpins = 1;

onMounted(async () => {
  displayedList.value = await getKanduuChildren(props.pointer);
  if (!numberOfCategoryItems.value) {
    emit('close')
  } else {
    rollDice();
  }
})

/** dice random stuff */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function resetBackgroundColors() {
  displayedList.value.forEach((displayedItem) => displayedItem.backgroundColor = 'transparent')
  setTimeout(() => {
    displayedList.value.forEach((displayedItem, index) => displayedItem.backgroundColor = getBackgroundColor(index));
  }, 100);
}
function rollDice() {
  if (numberOfCategoryItems.value === 0) {
    return;
  }

  setTimeout(() => {
    if (selectedIndex.value === null || itemsSubList.length === 0) {
      itemsSubList = [...displayedList.value];
      resetBackgroundColors()
    }
    const randomArrayIndex = getRandomInt(itemsSubList.length);
    // console.log(randomArrayIndex);
    const poppedItem = itemsSubList.splice(randomArrayIndex, 1)[0];
    // find in the original array
    selectedIndex.value = displayedList.value.findIndex(categoryItem => categoryItem.id === poppedItem.id)
    // console.log(`should be looking at ${selectedIndex.value} - ${displayedList.value[selectedIndex.value].name}`)
    isButtonDisabled.value = true
  }, 0)
}

const zTranslate = computed(() => {
  const heightOfCell = cellSize + 20 // give some padding
  return Math.round( ( heightOfCell / 2 ) /  Math.tan( Math.PI / numberOfCategoryItems.value ) );
})

function getRotateX(cellIndex) {
  if (!numberOfCategoryItems.value) {
    return 0;
  }
  const rotateXValue = Math.round((360 / numberOfCategoryItems.value) * cellIndex)
  return rotateXValue
}

const carouselStyle = computed(() => {
  if(selectedIndex.value === null) {
    return 'transform: translateZ(-0px) rotateX(0deg)'
  }
  let rotateX = getRotateX(selectedIndex.value)
  rotateX += 1080 * numOfSpins
  numOfSpins += 1;
  return `transform: translateZ(-${zTranslate.value}px) rotateX(-${rotateX}deg)`
})

function getBackgroundColor(index) {
  let colorIndex = index % 5
  // most of the time we can just use the % 5, but in the situation where
  // the number of elements is divisible by 6 and the current index is the 'end'
  // of the list, we would show a repeating color. So we need to offset that.
  if (displayedList.value.length % 6 === 0 && index === displayedList.value.length - 1) {
    colorIndex += 1
  }
  return `wheel-background-${colorIndex}`
}

function doneRolling() {
  isButtonDisabled.value = false
}
function duu() {
  emit('duu', displayedList.value[selectedIndex.value].id)
}
</script>

<template>
  <div id="randomContainer">
    <div id="backgroundOverlay" class="w-100 h-100" @click="$emit('close')"></div>
    <div id="random3DScene" @click="rollDice">
      <div id="carousel" :style="carouselStyle" @transitionend="doneRolling">
        <div
          v-for="(carouselItem, index) in displayedList"
          :key="index" 
          class="carousel-cell"
          :class="carouselItem.backgroundColor"
          :style="{ transform: `rotateX(${getRotateX(index)}deg) translateZ(${zTranslate}px)`}">
            {{ carouselItem.name }}
        </div>
      </div>
    </div>
    <div id="duuButtonContainer" class="d-flex justify-content-center w-100">
      <BButton id="duuButton" :disabled="isButtonDisabled" size="lg" variant="outline-secondary" @click="rollDice" class="me-3">
        <span>Spin Again</span>
      </BButton>
      <BButton id="duuButton" :disabled="isButtonDisabled" size="lg" variant="primary" @click="duu">
        <span>duu this!</span>
      </BButton>
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
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: background 1s;
  background: transparent;
}
.wheel-background-0 {
  background: var(--red-color)
}
.wheel-background-1 {
  background: var(--orange-color)
}
.wheel-background-2 {
  background: var(--yellow-color)
}
.wheel-background-3 {
  background: var(--green-color)
}
.wheel-background-4 {
  background: var(--blue-color)
}
.background-transparent {
  background: transparent;
}
#backgroundOverlay {
  background: black;
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
}
#duuButtonContainer {
  position: absolute;
  bottom: 200px;
  margin-left: calc(var(--bs-gutter-x) * -0.5)
}
</style>
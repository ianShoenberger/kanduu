<script setup>

import { ref } from 'vue'
const props = defineProps(['initialText', 'showModal'])
const showInputModal = ref(false)
const input = ref('')
input.value = props.initialText
showInputModal.value = props.showModal
defineEmits(['cancel', 'save'])

</script>

<template>
<div>
  <div class="row justify-content-center mt-4">
    <BButton  variant="info" @click="showInputModal = !showInputModal" class="w-25"><i class="bi-plus-square"></i></BButton>
  </div>
  <BModal 
    id="inputModal"
    title="Edit"
    hideFooter="false"
    v-model="showInputModal"
    @ok="$emit('save', input)"
    @close="$emit('cancel')"
    @cancel="$emit('cancel')"
  >
    <BFormInput v-model="input" id="kanduuItem" autofocus placeholder="Movies" />
  </BModal>
</div>
</template>

<style scoped>
</style>
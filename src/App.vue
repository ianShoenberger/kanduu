<script setup>
import { watchEffect, useTemplateRef, onMounted, inject } from 'vue'

const modal = useTemplateRef('refreshModal')
const showRefreshPrompt = inject('showRefreshPrompt')
const refreshCallback = inject('refreshCallback')
onMounted(() => {
  watchEffect(() => {
    if (showRefreshPrompt.value) {
      modal.value.show()
    } else {
      modal.value.hide()
    }
  })
})

</script>

<template>
  <div id="myApp">
    <router-view></router-view>
    <BModal
      ref="refreshModal"
      id="refreshModal"
      title="App Update"
      ok-title="Reload"
      hideFooter="false"
      @ok="refreshCallback"
    > New version available, click reload button to update.
    </BModal>
  </div>
</template>

<style>
:root {
  --orange-color: #ff7300;
  /* --blue-color: #02b6c7; */
  --green-color: #81ca01;
  /* --red-color: #cb0328; */
  --yellow-color: #f2e213;
}
#myApp {
  /* color: #2c3e50; */
  /* background: linear-gradient(to bottom right, #ff963f, #fff563); */
  min-height: 100vh;
}
</style>

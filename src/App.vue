<script setup></script>

<template>
  <div id="myApp">
    <router-view></router-view>
  </div>
</template>

<style>
#myApp {
  color: #2c3e50;
  background: linear-gradient(to bottom right, #eb8934, #ffff66);
  min-height: 100vh;
  /* padding-top: 4rem; */
}
.title-text {
  /* color: #00ccff; */
  color: #d10606;
  text-shadow: 2px 2px 1px #103e4b;
  font-size: 3rem;
}
</style>

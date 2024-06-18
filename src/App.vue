<script setup></script>

<template>
  <div id="myApp">
    <router-view></router-view>
  </div>
</template>

<style>
:root {
  --orange-color: #ff7300;
  --blue-color: #02b6c7;
  --green-color: #81ca01;
  --red-color: #cb0328;
  --yellow-color: #f2e213;
}

#myApp {
  color: #2c3e50;
  /* background: linear-gradient(to bottom right, #eb8934, #ffff66); */
  background: linear-gradient(to bottom right, #ff7300, #f2e213);
  min-height: 100vh;
}
.title-text {
  /* color: #d10606; */
  color: var(--blue-color);
  text-shadow: 2px 2px 1px #103e4b;
  font-size: 3rem;
}
</style>

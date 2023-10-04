<script setup></script>

<template>
  <div id="myApp">
    <router-view></router-view>
  </div>
</template>

<style>
#myApp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to bottom right, #eb8934, #ffff66);
  min-height: 100vh;
  padding-top: 4rem;
}
.title-text {
  color: #00ccff;
  text-shadow: 2px 2px 0 #103e4b;
  font-size: 3rem;
  margin-bottom: 2rem;
}
input {
  margin-right: 1rem;
}
</style>

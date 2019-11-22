<template>
  <div id="app">
  <wifi-config />
  </div>
</template>

<script>
import WifiConfig from "./components/WifiConfig"

export default {
  name: 'app',
  components: {
    WifiConfig
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>

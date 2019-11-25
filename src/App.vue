<template>
  <div id="app">
<!--    <authorizing :is-not-authorized="false" :is-required-login="false" is-required-security-code />-->
<!--    <wifi-config />-->
    <slideshow-config />
  </div>
</template>

<script>
// import WifiConfig from "./components/WifiConfig"
// import Authorizing from "./components/Authorizing"
import SlideshowConfig from "./components/SlideshowConfig"

export default {
  name: 'app',
  components: {
    // WifiConfig,
    // Authorizing,
    SlideshowConfig
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>

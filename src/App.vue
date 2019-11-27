<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import WifiConfig from "./components/main-components/WifiConfig"
import Authorizing from "./components/Authorizing"
import SlideshowConfig from "./components/main-components/SlideshowConfig"
import Home from "./components/Home"
import License from "./components/main-components/License"

export default {
  name: 'app',
  components: {
    WifiConfig,
    Authorizing,
    SlideshowConfig,
    Home,
    License
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

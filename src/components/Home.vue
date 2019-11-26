<template>
  <div>
    <g-toolbar dense elevation="1" color="#00b0ff" height="56">
      <span class="ml-3 text-white fw-500">Home</span>
    </g-toolbar>
    <g-row class="mt-4">
      <g-col class="row-flex justify-around">
        <div class="col-flex justify-start" @click="goToAppConfig">
          <g-icon style="font-size: 5.5rem; border: 2px solid #00b0ff" class="br-100 pa-2" color="#00b0ff">mdi-settings</g-icon>
          <span class="fs-large text-light-blue-accent-3 ta-center mt-2">App configs</span>
        </div>
      </g-col>
      <g-col class="row-flex justify-around">
        <div class="col-flex justify-start" @click="goToWifiConfig">
          <g-icon style="font-size: 5.5rem; border: 2px solid #00b0ff" class="br-100 pa-2" color="#00b0ff">mdi-wifi</g-icon>
          <span class="fs-large text-light-blue-accent-3 ta-center mt-2">Wifi</span>
        </div>
      </g-col>
    </g-row>
    <g-row class="mt-4">
      <g-col class="row-flex justify-around">
        <div class="col-flex justify-start" @click="goToLicense">
          <g-icon style="font-size: 5.5rem; border: 2px solid #00b0ff" class="br-100 pa-2" color="#00b0ff">mdi-certificate</g-icon>
          <span class="fs-large text-light-blue-accent-3 ta-center mt-2">License</span>
        </div>
      </g-col>
      <g-col></g-col>
    </g-row>

  </div>
</template>

<script>
  import { GBtn, GToolbar, GIcon, GRow, GCol } from 'pos-vue-framework/src/components';


  export default {
    name: "Home",
    components: { GBtn, GToolbar, GIcon, GRow, GCol },
    methods: {
      goToAppConfig() {
        this.$router.push({ path: 'config' });
      },
      goToWifiConfig() {
        this.$router.push({ path: 'wifi' });
      },
      goToLicense() {
        this.$router.push({ path: 'license' });
      },
    }
  }
</script>

<style scoped>
</style>
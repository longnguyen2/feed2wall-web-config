<template>
  <div style="height: 100vh">
    <g-toolbar dense elevation="1" color="#00b0ff" height="56">
      <g-btn flat icon @click="backToHome"><g-icon color="#ffffff">mdi-arrow-left</g-icon></g-btn>
      <span class="ml-3 text-white fw-500">License activation</span>
    </g-toolbar>

    <g-row class="mt-5">
      <g-col cols="5">Your license id: </g-col>
      <g-col cols="7"><span class="fw-700 text-light-blue-accent-3">{{id}}</span></g-col>
    </g-row>
    <g-row>
      <g-col cols="5" class="self-center">Your license key: </g-col>
      <g-col cols="7"><g-text-field placeholder="Enter your license key" /></g-col>
    </g-row>

    <g-row justify-content="center">
      <g-col cols="8">
        <g-btn block background-color="#00b0ff" text-color="#ffffff">
          <span class="fs-normal fw-600">Activate</span>
        </g-btn>
      </g-col>
    </g-row>
  </div>
</template>

<script>
  import { GToolbar, GBtn, GIcon, GTextField, GRow, GCol } from 'pos-vue-framework/src/components';

  export default {
    name: "License",
    components: { GToolbar, GBtn, GIcon, GTextField, GRow, GCol },
    data() {
      return {
        id: '123456'
      }
    },
    methods: {
      backToHome() {
        this.$router.push({ path: '/' });
      }
    }
  }
</script>

<style scoped lang="scss">

  .g-tf {
    ::v-deep &::after {
      background-color: #00b0ff;
    }

    ::v-deep &-label__focused {
      color: #00b0ff;
    }

    ::v-deep &__error::after {
      background-color: #ff0000;
    }

    ::v-deep & {
      margin: 0
    }
  }
</style>
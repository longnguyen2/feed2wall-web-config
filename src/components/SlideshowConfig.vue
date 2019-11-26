<template>
  <div>
    <g-toolbar dense elevation="1" color="#00b0ff" height="56">
      <g-btn flat icon @click="backToHome"><g-icon color="#ffffff">mdi-arrow-left</g-icon></g-btn>
      <span class="ml-3 text-white fw-500">Slideshow config</span>
    </g-toolbar>
    <div v-show="loading" class="bg-amber-accent-4 text-white fs-small fw-500 ta-center">Loading config data</div>

    <g-row justify-content="space-between">
      <g-col cols="5"><g-select :items="types" item-value="text" solo v-model="model.queryType" :rules="[checkNotEmpty]"/></g-col>
      <g-col cols="7"><g-text-field :placeholder="inputPlaceholder" solo v-model="model.queryName"/></g-col>
    </g-row>

    <div class="configs fw-500">
      <div class="ml-3 fs-small text-blue-grey-lighten-1">BASIC CONFIGS</div>
      <template v-for="config in basicConfigs">
        <g-row>
          <g-col class="self-center">{{config.title}}{{model.basic[config.model]}} {{config.unit}}</g-col>
          <g-col><g-slider-remake :min="config.min" :max="config.max" step="1" track-fill-color="#00b0ff" thumb-color="#00b0ff" v-model="model.basic[config.model]"></g-slider-remake></g-col>
        </g-row>
      </template>

      <div class="mt-3 ml-3 fs-small text-blue-grey-lighten-1">VISIBILITY CONFIGS</div>
      <template v-for="config in visibilityConfigs">
        <g-row>
          <g-col cols="8" class="self-center">{{model.visibility[config.model] ? config.enableMsg : config.disableMsg}}</g-col>
          <g-col cols="4" class="row-flex justify-end"><g-switch v-model="model.visibility[config.model]" color="#00b0ff"/></g-col>
        </g-row>
      </template>

      <g-row class="mt-5">
        <g-col class="row-flex justify-around"><g-btn background-color="#00b0ff" text-color="#ffffff" @click="saveConfig"><span class="fs-normal fw-600">Save</span></g-btn></g-col>
        <g-col class="row-flex justify-around"><g-btn background-color="#ff1744" text-color="#ffffff" @click="resetConfig"><span class="fs-normal fw-600">Reset</span></g-btn></g-col>
      </g-row>
    </div>
  </div>
</template>

<script>
  import { GToolbar, GIcon, GContainer, GRow, GCol, GTextField, GCheckbox, GBtn, GDivider, GSpacer, GList, GSelect, GSliderRemake, GSwitch } from 'pos-vue-framework/src/components';

  export default {
    name: "SlideConfig",
    components: { GToolbar, GIcon, GContainer, GRow, GCol, GTextField, GCheckbox, GBtn, GDivider, GSpacer, GList, GSelect, GSliderRemake, GSwitch },
    mounted() {
      this.loading = true;
      this.$p2p.emit('app:get-config');
      this.$p2p.on('client:send-config', data => {
        console.log(data);
        this.defaultModel = data;
        this.model = data;
        this.loading = false;
      });
    },
    data() {
      return {
        types: [
          { text: 'Profile' },
          { text: 'Hashtag' },
        ],
        checkNotEmpty: (value) => !!value || 'Required',
        basicConfigs: [
          { model: 'total', title: 'Number of posts: ', min: 1, max: 100, unit: '' },
          { model: 'delay', title: 'Delay: ', min: 5, max: 60, unit: 's' },
          { model: 'interval', title: 'Refresh interval: ', min: 5, max: 60, unit: 'min' }
        ],
        visibilityConfigs: [
          { model: 'avatar', enableMsg: 'Display user avatar', disableMsg: 'Do not display user avatar' },
          { model: 'username', enableMsg: 'Display username', disableMsg: 'Do not display username' },
          { model: 'likeCount', enableMsg: 'Display like count', disableMsg: 'Do not display like count' },
          { model: 'commentCount', enableMsg: 'Display comment count', disableMsg: 'Do not display comment count' },
          { model: 'caption', enableMsg: 'Display caption', disableMsg: 'Do not display caption' },
        ],
        model: {
          queryName: null,
          queryType: 'Profile',
          basic: {
            total: 1,
            delay: 5,
            interval: 60,
          },
          visibility: {
            avatar: true,
            username: true,
            likeCount: true,
            commentCount: true,
            caption: true,
          }
        },
        loading: false
      }
    },
    computed: {
      inputPlaceholder() {
        if (!this.model.queryType) {
          return '';
        }
        return this.model.queryType.toLowerCase() === 'profile' ? 'Enter an username' : 'Enter a hashtag';
      }
    },
    methods: {
      backToHome() {
        this.$router.push({ path: '/' });
      },
      saveConfig() {
        this.$p2p.emit('app:change-config', this.model);
      },
      resetConfig() {
        this.model = this.defaultModel;
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-tf__outlined {
    ::v-deep &.g-tf-wrapper:focus-within fieldset {
      border: 2px solid #00b0ff;
    }
  }

  .g-combobox {
    .g-select {
      .g-menu--activator {
        .g-tf-input {
          ::v-deep & {
            width: 100%;
          }
        }
      }
    }
  }

  .configs {
    ::v-deep .g-col {
      padding-top: 0;
      padding-bottom: 0;
    }

    ::v-deep .g-btn {
      flex-grow: 1;
    }
  }
</style>
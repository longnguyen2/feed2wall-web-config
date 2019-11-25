<template>
  <div>
    <g-toolbar dense elevation="1" color="#00b0ff" height="56">
      <g-btn flat icon><g-icon color="#ffffff">mdi-arrow-left</g-icon></g-btn>
      <span class="ml-3 text-white fw-500">Slideshow config</span>
    </g-toolbar>
    <g-tabs grow :items="tabs" v-model="model">
      <g-tab-item v-for="(item, i) in tabs" :key="i" :item="item">
        <g-container>
          <g-text-field v-if="item.title === 'profile'" outlined label="Instagram profile" />
          <g-text-field outlined v-else label="Instagram hashtag" />

          <g-list >

          </g-list>
        </g-container>
      </g-tab-item>
    </g-tabs>
  </div>
</template>

<script>
  import { GToolbar, GIcon, GContainer, GRow, GCol, GTextField, GCheckbox, GBtn, GDivider, GSpacer, GTabs, GTabItem, GList } from 'pos-vue-framework/src/components';

  export default {
    name: "SlideConfig",
    components: { GToolbar, GIcon, GContainer, GRow, GCol, GTextField, GCheckbox, GBtn, GDivider, GSpacer, GTabs, GTabItem, GList },
    data() {
      return {
        tabs: [
          { title: 'profile' },
          { title: 'hashtag' }
        ],
        listConfigs: [
          {
            header: 'Basic configs',
            subitems: [
              { title: 'Number of posts', type: 'slider', min: 1, max: 100, default: 1, unit: ''},
              { title: 'Delay', type: 'slider', min: 5, max: 60, default: 5, unit: 'sec' },
              { title: 'Reload slide interval', type: 'slider', min: 5, max: 60, default: 5, unit: 'min' },
            ]
          },
          {
            header: 'Visibility config',
            subitems: [
              { title: 'Main image width', type: 'switch'},
              { title: 'Main image height', type: 'switch'},
              { title: 'Profile image width', type: 'switch'},
              { title: 'Profile image width', type: 'switch'},
              { title: 'Username text size', type: 'switch'},
              { title: 'Main image width', type: 'switch'},
              { title: 'Main image width', type: 'switch'},
              { title: 'Main image width', type: 'switch'},

            ]
          }
        ],
        model: null
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
</style>
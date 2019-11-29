<template>
  <div>
    <g-toolbar dense elevation="1" color="#00b0ff" height="56">
      <g-btn flat icon @click="backToHome"><g-icon color="#ffffff">mdi-arrow-left</g-icon></g-btn>
      <span class="ml-3 text-white fw-500">Slideshow config</span>
    </g-toolbar>
    <div v-show="loading" class="bg-amber-accent-4 text-white fs-small fw-500 ta-center">Loading config data</div>
    <div v-show="error" class="bg-red text-white fs-small fw-500 ta-center">Please enter an account or hashtag</div>

    <g-row class="col-flex" justify-content="flex-start">
      <g-col>
        <g-text-field solo placeholder="Enter @Account or #Hashtag"
                      clearable clear-icon="mdi-close" @click:clear="clearSearch"
                      :rules="[searchValidationRules.checkNotEmpty, searchValidationRules.checkPrefix]"
                      v-model="searchText" @focus="showList"/>
        <g-list v-show="searchItems.length !== 0 && searching"
                style="position: fixed; z-index:406; left: 12px; right: 12px; max-height: 300px"
                :items="searchItems" item-title="text" v-model="searchSelection" selectable />
      </g-col>
    </g-row>

    <div class="configs fw-500">
      <div class="ml-3 fs-small text-blue-grey-lighten-1">BASIC CONFIGS</div>
      <template v-for="config in basicConfigs">
        <g-row class="pt-1 pb-1">
          <g-col class="self-center">
            <div>{{config.title}}{{model.basic[config.model]}} {{config.unit}}</div>
            <div class="fs-small-2 text-grey">{{config.subtext}}</div>
          </g-col>
          <g-col>
            <g-slider-remake :min="config.min" :max="config.max" step="1" track-fill-color="#00b0ff" thumb-color="#00b0ff" v-model="model.basic[config.model]"></g-slider-remake>
          </g-col>
        </g-row>
      </template>

      <div class="mt-5 ml-3 fs-small text-blue-grey-lighten-1">VISIBILITY CONFIGS</div>
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
  import { GToolbar, GIcon, GContainer, GRow, GCol, GTextField, GCheckbox, GBtn, GDivider, GSpacer, GList, GSelect, GSliderRemake, GSwitch, GAutocomplete } from 'pos-vue-framework/src/components';

  import { clearSource } from "../../utils";

  import axios from 'axios';
  let source;

  export default {
    name: "SlideConfig",
    components: { GToolbar, GIcon, GContainer, GRow, GCol, GTextField, GCheckbox, GBtn, GDivider, GSpacer, GList, GSelect, GSliderRemake, GSwitch, GAutocomplete },
    mounted() {
      this.loading = true;
      this.$socket.removeListener('client:send-config');
      this.$socket.on('client:send-config', data => {
        data = clearSource(data);
        this.model = data;
        this.searchText = data.query || '';
        this.loading = false;
      });
      this.$socket.emit('app:get-config');
    },
    data() {
      return {
        searchItems: [],
        searchValidationRules: {
          checkNotEmpty: (value) => !!value || 'Required',
          checkPrefix: (value) => (value[0] === '@' || value[0] === '#') || 'Must start with @ or #'
        },
        basicConfigs: [
          { model: 'total', title: 'Number of posts: ', subtext: '', min: 1, max: 100, unit: '' },
          { model: 'delay', title: 'Delay: ', subtext: 'Each image is shown for', min: 5, max: 60, unit: 's' },
          { model: 'interval', title: 'Interval: ', subtext: 'Reload data interval', min: 5, max: 60, unit: 'min' }
        ],
        visibilityConfigs: [
          { model: 'avatar', enableMsg: 'Display user avatar', disableMsg: 'Do not display user avatar' },
          { model: 'username', enableMsg: 'Display username', disableMsg: 'Do not display username' },
          { model: 'likeCount', enableMsg: 'Display like count', disableMsg: 'Do not display like count' },
          { model: 'commentCount', enableMsg: 'Display comment count', disableMsg: 'Do not display comment count' },
          { model: 'caption', enableMsg: 'Display caption', disableMsg: 'Do not display caption' },
        ],
        searchSelection: '',
        searchText: '',
        model: {
          query: '',
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
        loading: false,
        error: false,
        searching: false,
      }
    },
    watch: {
      searchText(newQuery) {
        this.searchItems = [];
        if (!newQuery || newQuery.length < 2) {
          if (source) source.cancel('Operation canceled due to new request.');
          return;
        }
        if (newQuery[0] === '@' || newQuery[0] === '#') {
          this.search(newQuery);
        }
      },
      searchSelection(selection) {
        if (!selection) {
          this.searching = false;
          return;
        }

        this.searching = false;
        this.searchText = selection.text;
        this.model.query = selection.text;
      }
    },
    methods: {
      backToHome() {
        this.$router.push({ path: '/' });
      },
      showList() {
        this.error = false;
        this.searching = true;
      },
      clearSearch() {
        this.searchText = '';
        this.model.query = '';
      },
      saveConfig() {
        if (!this.model.query) {
          this.error = true;
          return;
        }
        const configModel = clearSource(this.model);
        this.$socket.emit('app:change-config', configModel);
      },
      resetConfig() {
        this.$socket.emit('app:get-config');
      },
      async search(query) {
        if (query[0] === '#') query = `%23${query.substring(1, query.length)}`;
        if (query[0] === '@') query = `%40${query.substring(1, query.length)}`;
        const searchUrl = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${query}&include_reel=true`;

        if (source) source.cancel('Operation canceled due to new request.');
        source = axios.CancelToken.source();
        axios.get(searchUrl, {cancelToken: source.token})
          .then(response => {
            const searchResult = response.data;
            const accounts = searchResult.users.map(account => ({
              text: `@${account.user['username']}`,
              prepend: account.user['profile_pic_url'],
              subtitle: account.user['full_name'],
              type: 'account'
            }));
            this.searchItems = this.searchItems.concat(accounts);
            const hashtags = searchResult.hashtags.map(tag => ({
              text: `#${tag.hashtag['name']}`,
              prepend: tag.hashtag['profile_pic_url'],
              subtitle: tag.hashtag['search_result_subtitle'],
              type: 'hashtag'
            }));
            this.searchItems = this.searchItems.concat(hashtags);
          })
          .catch(e => {});
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
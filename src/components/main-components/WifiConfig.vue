<template>
  <g-dialog v-model="toggleDialog" bottom overlay-color="#212121" overlay-opacit="0.46" max-width="100%" width="100%">
    <template v-slot:activator>
      <g-toolbar class="toolbar" dense elevation="1" color="#00b0ff" height="56">
        <g-btn flat icon @click="backToHome"><g-icon color="#ffffff">mdi-arrow-left</g-icon></g-btn>
        <span class="ml-3 text-white fw-500">Wifi list</span>
        <g-spacer />
        <g-btn icon class="toolbar__refresh" :class="{ 'toolbar__refresh--loading': loading }" @click="refreshList"><g-icon color="#ffffff">mdi-refresh</g-icon></g-btn>
      </g-toolbar>

      <g-list :items="wifis" elevation="0" item-value="title">
        <template v-slot:listItem="{ item }">
          <div v-if="connecting === item.title" class="g-list-item waves-effect waves-auto ml-2" tabindex="0">
            <g-icon color="#00b0ff">{{item.prepend}}</g-icon>
            <div class="g-list-item-content">
              <div class="g-list-item-text text-light-blue-accent-3">{{item.title}}</div>
            </div>
            <g-icon color="#00b0ff">{{item.append}}</g-icon>
          </div>
          <div v-else class="g-list-item waves-effect waves-auto ml-2" tabindex="0" @click="openDialog(item.title)">
            <g-icon>{{item.prepend}}</g-icon>
            <div class="g-list-item-content">
              <div class="g-list-item-text">{{item.title}}</div>
            </div>
            <g-icon>{{item.append}}</g-icon>
          </div>
        </template>
      </g-list>
    </template>

    <g-card flat width="100%" class="wifi-dialog" style="border-top-left-radius: 20px; border-top-right-radius: 20px;">
      <g-card-title class="fs-large-3 justify-center">{{ssid}}</g-card-title>
      <g-card-text>
        <g-text-field v-model="password" type="password" placeholder="Password" outlined rounded></g-text-field>
      </g-card-text>
      <g-card-actions>
        <g-btn class="wifi-dialog__action" rounded depressed background-color="#e0dfe0" left @click="toggleDialog = false">Cancel</g-btn>
        <g-btn class="wifi-dialog__action" rounded depressed :disabled="disableSubmit" background-color="#e0dfe0" text-color="#0091ea" right>Connect</g-btn>
      </g-card-actions>
    </g-card>

  </g-dialog>
</template>

<script>
import axios from 'axios';

import { GList, GIcon, GRow, GCol, GDialog, GCard, GCardTitle, GCardText, GCardActions, GBtn, GTextField, GToolbar, GSpacer } from 'pos-vue-framework/src/components';

export default {
  components: { GList, GIcon, GRow, GCol, GDialog, GCard, GCardTitle, GCardText, GCardActions, GBtn, GTextField, GToolbar, GSpacer },
  data() {
    return {
      selectedWifiIndex: null,
      wifis: [],
      password: '',
      networkConnectionResult: '',
      isConnectionOk: false,
      toggleDialog: false,
      connecting: '',
      loading: false,
      ssid: '',
      disableSubmit: true
    };
  },
  watch: {
    password(pwd) {
      this.disableSubmit = pwd.length < 8;
    },
    toggleDialog(dialogState) {
      if (!dialogState) this.disableSubmit = true;
    }
  },
  created() {
    this.getAvailableWifis();
  },
  methods: {
    openDialog(ssid) {
      this.ssid = ssid;
      this.toggleDialog = true;
    },
    async refreshList() {
      this.loading = true;
      await this.getAvailableWifis();
      this.loading = false;
    },
    async getAvailableWifis() {
      try {
        const { data: response } = await axios.get(`http://${location.hostname}:4000/api/v1/wifi`);
        this.wifis = [];
        response.forEach((w) => {
          const wifi = {};
          wifi.title = w.title;
          wifi.prepend = w.strength === 0 ? 'mdi-wifi-strength-outline' : `mdi-wifi-strength-${w.strength}`;
          wifi.append = w.secured ? 'mdi-lock' : '';
          if (w.connecting) {
            wifi.append = 'mdi-check';
            this.connecting = wifi.title;
            this.wifis.unshift(wifi);
          } else {
            this.wifis.push(wifi);
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    async connectToNetwork() {
      try {
        this.isConnectionOk = true;
        this.networkConnectionResult = 'Attempting connection...';

        const payload = {
          ssid: this.wifis[this.selectedWifiIndex],
          passphrase: this.password,
        };
        const response = await axios.post(`http://${location.host}/api/v1/wifi/connect`, payload);

        this.isConnectionOk = response.data.result;
        this.networkConnectionResult = this.isConnectionOk ? 'Success, app will restart shortly' : 'Connection failed, check your password';
      } catch (e) {
        console.error(e);
      }
    },
    backToHome() {
      this.$router.push({ path: '/' });
    }
  },
};
</script>
<style scoped lang="scss">
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }

  .toolbar {
    &__refresh {
      margin-right: 12px;

      &--loading {
        -webkit-animation:spin 1s linear infinite;
        -moz-animation:spin 1s linear infinite;
        animation:spin 1s linear infinite;
      }
    }
  }

  .g-tf__outlined {
    ::v-deep &.g-tf-wrapper:focus-within fieldset {
      border: 2px solid #00b0ff;
    }
  }

  .wifi-dialog {

    &__action {
      flex-grow: 1;
      font-size: 1em !important;
      margin-bottom: 0.5em;
      height: 2.5em !important;
    }
  }
</style>
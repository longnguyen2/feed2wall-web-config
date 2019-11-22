<template>
  <div>
    <g-dialog v-model="toggleDialog" bottom overlay-color="#212121" overlay-opacit="0.46" max-width="100vw" width="100vw">

      <template v-slot:activator>
        <g-list :items="wifis" elevation="0" item-value="title">
          <template v-slot:subheader>
            <g-row class="header">
              <g-col align-self="center"><div class="header__title text-light-blue-accent-3 g-list-header">WIFI LIST</div></g-col>
              <g-col align-self="center" class="row-flex justify-end"><g-btn icon class="header__refresh" :class="{ 'header__refresh--loading': loading }" @click="refreshList"><g-icon>mdi-refresh</g-icon></g-btn></g-col>
            </g-row>
          </template>

          <template v-slot:listItem="{ item }">
            <div v-if="connecting === item.title" class="g-list-item waves-effect waves-auto" tabindex="0">
              <g-icon color="#00b0ff">{{item.prepend}}</g-icon>
              <div class="g-list-item-content">
                <div class="g-list-item-text text-light-blue-accent-3">{{item.title}}</div>
              </div>
              <g-icon color="#00b0ff">{{item.append}}</g-icon>
            </div>
            <div v-else class="g-list-item waves-effect waves-auto" tabindex="0" @click="openDialog(item.title)">
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
        <g-card-title class="wifi-dialog__name justify-center">{{ssid}}</g-card-title>
        <g-card-text>
          <g-text-field class="wifi-dialog__input" v-model="password" type="password" placeholder="Password" outlined rounded></g-text-field>
        </g-card-text>
        <g-card-actions>
          <g-btn rounded depressed background-color="#e0dfe0" style="flex-grow: 1" left @click="toggleDialog = false">Cancel</g-btn>
          <g-btn rounded depressed :disabled="disableSubmit" background-color="#e0dfe0" text-color="#0091ea" style="flex-grow: 1" right>Connect</g-btn>
        </g-card-actions>
      </g-card>

    </g-dialog>
  </div>
</template>

<script>
import axios from 'axios';

import { GList, GIcon, GRow, GCol, GDialog, GCard, GCardTitle, GCardText, GCardActions, GBtn, GTextField } from 'pos-vue-framework/src/components';

export default {
  components: { GList, GIcon, GRow, GCol, GDialog, GCard, GCardTitle, GCardText, GCardActions, GBtn, GTextField },
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
      // this.loading = false;
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
          }
          this.wifis.push(wifi);
        });
      } catch (e) {
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
  },
};
</script>
<style scoped lang="scss">
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }

  .header {
    &__title {
      font-size: 1.2em;
    }
    &__refresh {
      margin-right: 16px;

      &--loading {
        -webkit-animation:spin 1s linear infinite;
        -moz-animation:spin 1s linear infinite;
        animation:spin 1s linear infinite;
      }
    }
  }

  .active-item {
    color: #00b0ff;
  }

  .wifi-dialog {
    &__name {
      font-size: 1.3em !important;
    }
  }
</style>
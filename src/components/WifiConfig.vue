<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <v-list>
          <v-subheader class="indigo--text display-1">Wifi list</v-subheader>
          <v-list-item-group v-model="selectedWifiIndex" color="primary">
            <v-list-item v-for="(wifi, index) in wifis" :key="index">
              <v-list-item-content>
                <v-list-item-title v-text="wifi"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-flex>

      <v-flex xs12 mt-12 v-if="selectedWifiIndex !== null">
        <h4>Selected network: {{wifis[selectedWifiIndex]}}</h4>
        <v-text-field
          type="password"
          v-model="password"
          label="Enter password"/>
      </v-flex>
      <v-flex xs12 mt-6 >
        <v-btn v-if="selectedWifiIndex !== null" color="primary mr-2"
               large @click="connectToNetwork">Connect</v-btn>
        <v-btn color="success" large @click="getAvailableWifis">Scan</v-btn>
      </v-flex>
      <v-flex xs12>
        <h3 :class="{'indigo--text': isConnectionOk,
          'red--text': !isConnectionOk}">{{networkConnectionResult}}</h3>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedWifiIndex: null,
      wifis: [],
      password: '',
      networkConnectionResult: '',
      isConnectionOk: false,
    };
  },
  created() {
    this.getAvailableWifis();
  },
  methods: {
    async getAvailableWifis() {
      try {
        const response = await axios.get(`http://${location.host}/api/v1/wifi`);
        this.wifis = response.data;
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
  },
};
</script>

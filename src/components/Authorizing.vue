<template>
  <g-container>
    <g-row align-items="center" justify-content="center" style="height: 100vh">
      <g-col cols="12" sm="6" md="4">
        <g-card elevation="5" class="pa-3">

          <g-card-title>
            <g-img width="50px" height="53px" alt="logo" :src="require('../assets/rockiton_black.png')" />
            <span class="ml-3">Feed2Wall</span>
          </g-card-title>

          <g-card-text>
            <g-text-field v-if="isNotAuthorized" placeholder="Enter Authorization Key" v-model="authorizationKey" type="password"/>
          </g-card-text>

          <span class="pl-3" v-show="displayAlert" :class="[alertClass]">{{alertMsg}}</span>

          <g-card-actions v-if="isNotAuthorized" class="justify-end">
            <g-btn :disabled="buttonDisabled" background-color="#00b0ff" text-color="#ffffff" @click="authorize">Submit</g-btn>
          </g-card-actions>

        </g-card>
      </g-col>
    </g-row>
  </g-container>
</template>

<script>
  import axios from 'axios';
  import { GContainer, GRow, GCol, GCard, GCardTitle, GCardText, GCardActions, GImg, GTextField, GBtn } from 'pos-vue-framework/src/components';

  export default {
    name: "Authorizing",
    components: { GContainer, GRow, GCol, GCard, GCardTitle, GCardText, GCardActions, GImg, GTextField, GBtn },
    directives: { mask },
    created() {
      this.isNotAuthorized = !localStorage.getItem('isAuthorized');
      if (!this.isNotAuthorized) {
        this.$router.push({ path: '/'});
      }
    },
    data() {
      return {
        isNotAuthorized: false,
        authorizationKey: '',
        displayAlert: false,
        alertMsg: '',
        alertClass: '',
        buttonDisabled: false,
      };
    },
    methods: {
      async authorize() {
        this.buttonDisabled = true;
        try {
          const payload = {
            authorizationKey: this.authorizationKey,
          };

          const { data: authorizationInfo } = await axios.post(`http://${location.hostname}:3000/config/authorize`, payload);
          if (authorizationInfo.status === 'failure') {
            this.alertMsg = 'Authorization failed';
            this.displayAlert = true;
            this.alertClass = 'text-red';
            return;
          } else {
            localStorage.setItem('isAuthorized', 'true');
          }

          this.displayAlert = false;

          const redirect = this.$route.query.redirect;
          if (redirect) {
            await this.$router.push({ path: redirect });
          } else {
            await this.$router.push({ path: '/' });
          }
        } catch (e) {
          console.warn(e);
          this.alertMsg = 'Authorization failed';
          this.displayAlert = true;
          this.alertClass = 'text-red';
        } finally {
          this.buttonDisabled = false;
        }
      },
    },
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
  }
</style>
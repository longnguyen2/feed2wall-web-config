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
            <template v-else-if="isRequiredLogin">
              <g-text-field placeholder="Instagram Username"
                            :rules="[rules.validateUsername]" />
              <g-text-field type="password" placeholder="Instagram Password"
                            :rules="[rules.validatePassword]" />
            </template>
            <g-text-field v-else
                placeholder="Login Security Code"
                v-mask="codeMask" />
          </g-card-text>

          <span class="pl-3" v-show="displayAlert" :class="[alertClass]">{{alertMsg}}</span>

          <g-card-actions v-if="isNotAuthorized" class="justify-end">
            <g-btn :disabled="buttonDisabled" background-color="#00b0ff" text-color="#ffffff" @click="authorize">Submit</g-btn>
          </g-card-actions>
          <g-card-actions v-else-if="isRequiredLogin" class="justify-end">
            <g-btn :disabled="buttonDisabled" v-show="showBackButton" background-color="#ffffff" text-color="#000000">Back</g-btn>
            <g-btn :disabled="buttonDisabled" background-color="#00b0ff" text-color="#ffffff">Login</g-btn>
          </g-card-actions>
          <g-card-actions v-else class="justify-between">
              <g-btn :disabled="buttonDisabled" background-color="#ff1744" text-color="#ffffff">Logout</g-btn>
              <g-btn :disabled="buttonDisabled" background-color="#ffffff" text-color="#000000">New code</g-btn>
              <g-btn :disabled="buttonDisabled" background-color="#00b0ff" text-color="#ffffff">Send</g-btn>
          </g-card-actions>

        </g-card>
      </g-col>
    </g-row>
  </g-container>
</template>

<script>
  import axios from 'axios';
  import { mask } from 'vue-the-mask';

  import { GContainer, GRow, GCol, GCard, GCardTitle, GCardText, GCardActions, GImg, GTextField, GBtn } from 'pos-vue-framework/src/components';

  export default {
    name: "Authorizing",
    components: { GContainer, GRow, GCol, GCard, GCardTitle, GCardText, GCardActions, GImg, GTextField, GBtn },
    directives: { mask },
    async created() {
      this.isNotAuthorized = !localStorage.getItem('isAuthorized');
      // if (!this.isNotAuthorized && !this.isRequiredLogin && !this.isRequiredSecurityCode) {
      //   await this.$router.push({ path: '/' });
      // }
    },
    data() {
      return {
        isNotAuthorized: false,
        isRequiredLogin: false,
        isRequiredSecurityCode: false,
        rules: {
          validateUsername: value => !!value || 'Username cannot be empty',
          validatePassword: value => !!value || 'Password cannot be empty'
        },
        authorizationKey: '',
        instagramUsername: '',
        instagramPassword: '',
        isInstagramAccountUsernameValid: false,
        isInstagramAccountPasswordValid: false,
        displayAlert: false,
        alertMsg: '',
        alertClass: '',
        securityCode: '',
        buttonDisabled: false,
        showBackButton: false,
        codeMask: 'X-X-X-X-X-X'
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

          if (!this.isRequiredLogin && !this.isRequiredSecurityCode) {
            const redirect = this.$route.query.redirect;
            if (redirect) {
              await this.$router.push({ path: redirect });
            } else {
              await this.$router.push({ path: '/' });
            }
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
      async saveLoginInfo() {
        this.buttonDisabled = true;
        try {
          const payload = {
            username: this.instagramUsername,
            password: this.instagramPassword,
          };

          const { data: saveLoginStatus } = await axios.post(`http://${location.hostname}:4000/api/v1/save-instagram-login-info`, payload);
          if (saveLoginStatus.success) {
            this.displayAlert = false;
            this.$router.go(-1);
          } else {
            this.displayAlert = true;
            this.alertMsg = saveLoginStatus.error;
            this.alertClass = 'text-red';
          }
        } catch (e) {
          console.warn(e);
          this.alertMsg = 'Saving login info failed!';
          this.displayAlert = true;
          this.alertClass = 'text-red';
        } finally {
          this.buttonDisabled = false;
        }
      },
      async submitSecurityCode() {
        this.buttonDisabled = true;
        try {
          const payload = {
            securityCode: this.securityCode,
          };

          const { data: saveSecurityCodeStatus } = await axios.post(`http://${location.hostname}:3000/config/submit-security-code`, payload);
          if (saveSecurityCodeStatus.success) {
            this.alertMsg = 'Submit code successfully. Retry submitting if device\'s screen shows error message';
            this.displayAlert = true;
            this.alertClass = 'text-green';
          } else {
            this.displayAlert = true;
            this.alertMsg = saveSecurityCodeStatus.error;
            this.alertClass = 'text-red';
          }
        } catch (e) {
          console.warn(e);
          this.alertMsg = 'Submitting security code failed!';
          this.displayAlert = true;
          this.alertClass = 'text-red';
        } finally {
          this.buttonDisabled = false;
        }
      },
      logout() {
        this.isRequiredSecurityCode = false;
        this.isRequiredLogin = true;
        this.showBackButton = true;
        this.displayAlert = false;
      },
      backToSubmitCode() {
        this.isRequiredSecurityCode = true;
        this.isRequiredLogin = false;
        this.displayAlert = false;
      },
      async getNewSecurityCode() {
        this.buttonDisabled = true;
        try {
          await axios.get(`http://${location.hostname}:3000/config/get-new-code`);
          this.alertMsg = 'Please check your email';
          this.displayAlert = true;
          this.alertClass = 'text-green';
        } catch (e) {
          console.warn(e);
          this.alertMsg = 'Send request failed';
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
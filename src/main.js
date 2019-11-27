import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'
import 'pos-vue-framework/src/style/main.scss'
require('pos-vue-framework/src/plugin/waves')

import VueRouter from 'vue-router';
import router from './plugins/router';
import SocketIo  from './plugins/socketio';

Vue.config.productionTip = false

Vue.use(VueCompositionApi)
Vue.use(VueRouter)
Vue.use(SocketIo)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

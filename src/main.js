import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'
import 'pos-vue-framework/src/style/main.scss'
require('pos-vue-framework/src/plugin/waves')

Vue.config.productionTip = false

Vue.use(VueCompositionApi);

new Vue({
  render: h => h(App),
}).$mount('#app')

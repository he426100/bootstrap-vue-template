// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

import './plugins/bootstrap-vue'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

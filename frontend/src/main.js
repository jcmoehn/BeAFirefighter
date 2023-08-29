// Alle nötigen Packages erreichbar machen
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import toggleSwitch from 'vuejs-toggle-switch'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueTypedJs from 'vue-typed-js'
const VueScrollTo = require('vue-scrollto')

Vue.use(VueScrollTo)
Vue.use(VueTypedJs)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(toggleSwitch)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

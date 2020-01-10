import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import localforage from 'localforage'
import NavbarPlugin from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/offline/offline.min.js'
import '@/offline/offline-language-english-indicator.css'
import '@/offline/offline-theme-dark-indicator.css'

// The order of these is important!
Vue.use(VueAxios, axios)
Vue.use(NavbarPlugin)

Vue.config.productionTip = false

// Prevent offline.js from automatically resending ajax requests

let offlineUrl = (process.env.NODE_ENV === 'production') ? 'https://ydh-iis7.ydh.nhs.uk/PaediatricDiabetes/api/Test' : 'favicon.ico'

window.Offline.options = {
  requests: false,
  checks: {
    xhr: {
      url: offlineUrl,
      type: 'GET'
    }
  }
}

// Initialize localforage
localforage.config({
  name: 'paediatricdiabetes'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

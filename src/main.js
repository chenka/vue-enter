import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'
// import App2 from './App2.vue'
Vue.use(VueFire)
new Vue({
  el: '#app',
  render: h => h(App)
})

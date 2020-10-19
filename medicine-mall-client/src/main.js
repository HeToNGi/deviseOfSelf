import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/styles/base.css"
import 'lib-flexible/flexible.js'
import Vant from 'vant';
import 'vant/lib/index.css';
import './permission' // permission control
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import "../src/assets/icon/iconfont.css"


import VueTouch from 'vue-touch'

Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(VueAwesomeSwiper);

Vue.use(Vant);

Vue.config.productionTip = false
new Vue({
  router,
  store,

  render: h => h(App)
}).$mount('#app')

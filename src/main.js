import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global'
import './filters'
import api from './http/api'
import dayjs from 'dayjs'
import "nprogress/nprogress.css"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'



Vue.prototype.$api = api
Vue.prototype.$dayjs = dayjs
Vue.config.productionTip = false

Vue.use(mavonEditor)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

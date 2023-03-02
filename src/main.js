import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
Vue.use(Element)
import axios from 'axios'
import './assets/css/global.css'
// import '@/css/index'
Vue.config.productionTip = false

axios.defaults.baseURL='http://47.108.144.246:8888/api/private/v1'
Vue.prototype.axios=axios
//添加请求拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

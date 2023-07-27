import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: 'zhangsan',
      sex: '男'
    }
  },
  getters: {
  },
  mutations: {
    checkinfo (state, val) {
      state.user = val
    }
  },
  actions: {
  },
  modules: {
  }
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    spinning: false,
  },
  getters:{
    spinningState: state => {
      return state.spinning;
    }
  },
  mutations: {
    saveUser(state, data) {
      state.user = data;
    },
    setSpinning(state, data) {
      state.spinning = data;
    }
  },
  actions: {},
  modules: {}
})

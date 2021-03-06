import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'
// import format from 'date-fns/format'

import AuthModule from './AuthModule'
import ChatModule from './ChatModule'
import ProjectModule from './ProjectModule'
import MessageModule from './MessageModule'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: AuthModule,
    chat: ChatModule,
    project: ProjectModule,
    message: MessageModule
  },
  state: {
    loading: false,
    error: null,
    onlineUsers: []
  },
  mutations: {
    SET_LOADING (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    SET_ONLINE_USERS (state, payload) {
      state.onlineUsers = payload
    }
  },
  actions: {
    loadOnlineUsers ({commit}) {
      firebase.database().ref('presence').on('value', snapshot => {
        let result = []
        result[0] = snapshot.numChildren()
        result[1] = snapshot.val()
        commit('SET_ONLINE_USERS', result)
        console.log("onlineUsers: ", result[1])
      })
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    onlineUsers (state) {
      return state.onlineUsers
    }
  }
})
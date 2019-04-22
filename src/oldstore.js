import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import format from 'date-fns/format'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
      projects: [],
      messages: [],
      loading: false,
      user: null,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload
    },
    SET_PROJECTS(state, payload) {
      state.projects = payload
    },
    UPDATE_PROJECT(state, payload) {
      console.log("payload", payload)
      const project = state.projects.find(project => {
        return project.id === payload.id
      })
      if(payload.title) {
        project.title = payload.title
      }
      if(payload.content) {
        project.content = payload.content
      }
      if(payload.person) {
        project.person = payload.person
      }
      if(payload.status) {
        project.status = payload.status
      }
      if(payload.due) {
        project.due = payload.due
      }
    },
    ADD_PROJECT(state, payload) {
      state.projects.push(payload)
    },
    SET_USER(state, payload) {
      state.user = payload
    },
    ADD_MESSAGE(state, payload) {
      state.messages.push(payload)
    },
    SET_MESSAGES(state, payload) {
      state.messages = payload
    },
  },
  actions: {
    registerUser({commit}, payload) {
      commit('SET_LOADING', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        firebase.firestore().collection('users').add({
          registeredName: payload.name,
          displayName: user.displayName,
          email: user.email,
          photoUrl: user.photoUrl,
          emailVerified: user.emailVerified,
          uid: user.uid,
          registerDate: firebase.firestore().Timestamp.now()
        })
      })
      .then(user => {
        commit('SET_USER', user)
        commit('SET_LOADING', false)
      })
      .catch(error => {
        commit('SET_LOADING', false)
        console.log(error)
        
      })
        
    },
    loadProjects({commit}) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('projects').get()
      .then((querySnapshot) => {
        let projectsArray = []
        querySnapshot.forEach((doc) => {
        let project = doc.data()
            project.id = doc.id
            projectsArray.push(project)
        })
        commit('SET_PROJECTS', projectsArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    addProject({commit}, payload) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('projects').add(payload)
      .then(() => {
        console.log("project added to db")
        commit('ADD_PROJECT', payload)
        commit('SET_LOADING', false)
      })
      .catch(err => {
        console.log(err)
        commit('SET_LOADING', false)
        })
    },
    updateProject({commit}, payload) {
      commit('SET_LOADING', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if(payload.content) {
        updateObj.content = payload.content
      }
      if(payload.person) {
        updateObj.person = payload.person
      }
      if(payload.status) {
        updateObj.status = payload.status 
      }
      if(payload.due) {
        updateObj.due = payload.due 
      }
      firebase.firestore().collection('projects').doc(payload.id).update(updateObj)
      .then(() => {
        console.log("project updated in db")
        commit('UPDATE_PROJECT', payload)
        commit('SET_LOADING', false)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    googleSignIn({commit}) {
      console.log("Attempting to sign in with Google");
      let provider = new firebase.auth.GoogleAuthProvider()
      //https://developers.google.com/identity/protocols/googlescopes#oauth2v2
      provider.addScope("https://www.googleapis.com/auth/userinfo.email")
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile")
      firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log("popup result ", result.user.email)
        console.log("user ", result.user)
        commit('SET_USER', result.user)
        return result.user
      })
      .catch(error => {
        console.log(error)
      })
    },
    googleSignOut() {
      firebase.auth().signOut()
      .then(() => {
        console.log("sign out called")
        
      })
    },
    authState({commit}, payload) {
      firebase.auth().onAuthStateChanged(user => {
        return user
      })
    },
    loadMessages({commit}) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('messages').get()
      .then((querySnapshot) => {
        let messagesArray = []
        querySnapshot.forEach((doc) => {
        let message = doc.data()
            message.id = doc.id
            messagesArray.push(message)
        })
        commit('SET_MESSAGES', messagesArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    addMessage({commit}, payload) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('messages').add(payload)
      .then(() => {
        commit('ADD_MESSAGE', payload)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
  },
  getters: {
    getProject(state) {
      return (projectId) => {
        return state.projects.find((project) => {
          return project.id === projectId
        })
      }
    },
    getAllProjects(state) {
      return state.projects
    },
    getUser(state) {
      return state.user
    },
    getAllMessages(state) {
      return state.messages
    }
  }
})

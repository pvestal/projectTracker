import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const AuthModule = {
  state: {
    user: null
  },
  mutations: {
    SET_USER (state, payload) {
      state.user = payload
      const userListRef = firebase.database().ref('presence')
      const myUserRef = userListRef.push()

      firebase.database().ref('.info/connected').on('value', snap => {
            if (snap.val()) {
              // if we lose network then remove this user from the list
              myUserRef.onDisconnect().remove()
              // set user's online status
              let presenceObject = {user: payload, status: 'online'}
              myUserRef.set(presenceObject)
            } else {
              // client has lost network
              let presenceObject = {user: payload, status: 'offline'}
              myUserRef.set(presenceObject)
            }
          }
        )
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            firebase.database().ref('users').child(user.uid).set({name: payload.username})
              .then(message => {
                commit('setLoading', false)
                  const thaUser = {
                  id: user.uid,
                  username: payload.username
                  }
                  commit('SET_USER', thaUser)
                }
              ).catch(error => {
                  commit('setLoading', false)
                  commit('setError', error)
                }
              )
          }
        )
        .catch(error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            firebase.database().ref('users').child(user.uid).once('value', data => {
              commit('setLoading', false)
              const newUser = {
                id: user.uid,
                username: data.val().name
              }
              commit('SET_USER', newUser)
            })
          }
        )
        .catch(error => {
            commit('setLoading', false)
            commit('setError', error)
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
        console.log(result.user.displayName, " is now signed in with google")
        firebase.database().ref('users').child(result.user.uid).once('value', data => {
          console.log("result", result.user)
        const googleUser = {id: result.user.uid, displayName: result.user.displayName, photoURL: result.user.photoURL }
          commit('SET_USER', googleUser)
        })
      })
      // .then(() => {
      //   console.log(this.$store.getters.onlineUsers)
      // })
      .catch(error => {
        console.log(error)
      })
    },
    googleSignOut() {
      firebase.auth().signOut()
      .then(() => {
        console.log("sign out called")
        // console.log(this.$store.getters.onlineUsers)
      })
    },
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}

export default AuthModule
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const AuthModule = {
  state: {
    user: null,
    registeredUsers: []
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
    },
    SET_REGISTERED_USERS (state, payload) {
      state.registeredUsers = payload
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('SET_LOADING', true)
      let user = null
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(userData => {
        user = userData.user
        firebase.database().ref('users').child(user.uid).set({
          displayName: payload.name,
          email: payload.email,
          photoURL: user.photoURL,
          created: user.metadata.creationTime,
          lastSignIn: user.metadata.lastSignInTime,
          registered: true
        })
      })
      .then(() => {
        commit('SET_LOADING', false)
        const newUser = {
          id: user.uid,
          displayName: payload.name,
        }
        //Vuex user state
        commit('SET_USER', newUser)
      })
      .catch(error => {
        commit('SET_LOADING', false)
        console.log(error)
      })
  
    },
    signUserIn ({commit}, payload) {
      commit('SET_LOADING', true)
      let user = null
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(userData => {
          user = userData.user
            firebase.database().ref('users').child(user.uid).once('value', snap => {
              const thaUser = {
                id: user.uid, 
                displayName: snap.val().displayName, 
              }
              //Vuex user state
              commit('SET_USER', thaUser)
              commit('SET_LOADING', false)
            })
          }
        )
        .catch(error => {
            commit('SET_LOADING', false)
            commit('setError', error)
        })
    },
    googleSignIn({commit}) {
      commit('SET_LOADING', true)
      let user = null
      let provider = new firebase.auth.GoogleAuthProvider()
      //https://developers.google.com/identity/protocols/googlescopes#oauth2v2
      provider.addScope("https://www.googleapis.com/auth/userinfo.email")
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile")
      firebase.auth().signInWithPopup(provider)
      .then(googleData => {
        user = googleData.user
        const googleUser = {
          id: user.uid, 
          displayName: user.displayName, 
          photoURL: user.photoURL,
          created: user.metadata.creationTime,
          lastSignIn: user.metadata.lastSignInTime,
          registered: true
        }
        firebase.database().ref('users').child(user.uid).set(googleUser)
        commit('SET_USER', googleUser)
      })
      .catch(error => console.log(error))
      // let user = firebase.auth().currentUser
      
      // firebase.firestore().collection('users').doc(user.uid).set({
      //       id: user.uid, 
      //       displayName: user.displayName, 
      //       photoURL: user.photoURL,
      //       created: user.metadata.creationTime,
      //       lastSignIn: user.metadata.lastSignInTime
      // })
      // .catch(error => console.log(error))
    },
    googleSignOut() {
      firebase.auth().signOut()
      .then(() => {
        console.log("sign out called")
      })
    },
    autoSignIn({commit}, payload) {
      commit('SET_USER', payload)
    },
    getRegUsers({commit}) {
      console.log('getting registered Users')
      commit('SET_LOADING', true)
      // firebase.firestore().collection('users').get()
      firebase.database().ref('users').once('value')
      .then((querySnapshot) => {
        let uArray = []
        querySnapshot.forEach((doc) => {
        let user = doc.val()
            user.id = doc.val().id
            uArray.push(user)
            console.log(user.id)
        })
        commit('SET_REGISTERED_USERS', uArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
  },
  getters: {
    user (state) {
      return state.user
    },
    getRegistedUsers (state) {
      return state.registeredUsers
    }
  }
}

export default AuthModule
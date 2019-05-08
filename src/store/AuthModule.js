import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import format from 'date-fns/format'

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
    UPDATE_USER(state, payload) {
      console.log("mutation payload: ", payload)

      const user = state.user.find(user => {
        return user.uid === payload.id
      })
      if(payload.displayName) {
        user.displayName = payload.displayName
      }
      if(payload.updated) {
        user.updated = payload.updated
      }
      if(payload.image) {
        user.photoURL = payload.image
      }
    },
    REGISTER_FOR_GAME(state, payload) {
      const id = payload.id
        if (state.user.registeredGames.findIndex(game => game.id === id) >= 0) {
            return
        }
      state.user.registeredGames.push(id)
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
          games: []
        })
      })
      .then(() => {
        commit('SET_LOADING', false)
        const newUser = {
          uid: user.uid,
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
                uid: user.uid, 
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
          uid: user.uid, 
          displayName: user.displayName, 
          email: user.email,
          photoURL: user.photoURL,
          created: user.metadata.creationTime,
          lastSignIn: user.metadata.lastSignInTime,
          games: []
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
            user.uid = doc.val().uid
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
    createGame({commit, getters}, payload) {
      const user = getters.user
      let gameID = payload.gameID
        const game = {
          creator: user.uid,
          gameId: gameID,
          created: format(Date.now(), 'YYYY-MM-DD'),
          joiner: null,
        }
      //   firebase.firestore().collection('registrations')
      //   .add({gameId: payload, userId: user.id, timestamp: firebase.firestore.Timestamp.fromDate(new Date())})
      firebase.database().ref('/users/').child(gameID).child('/games/').push(game)
        .then(data => {
          commit('SET_LOADING', false)
          commit('REGISTER_FOR_GAME', {id:gameID})
        })
        .catch(error => {
          console.log(error)
          commit('SET_LOADING', false)
        })
    },
    updateProfile({commit, getters}, payload) {
      commit('SET_LOADING', true)
      console.log("request received")
      let imageURL
      let user = getters.user
      console.log("user", user.displayName)
      const updateObj = {}
      if (payload.displayName) {
        updateObj.displayName = payload.displayName
      }
      if(payload.updated) {
        updateObj.updated = payload.updated 
      }
      if(payload.image) {
        updateObj.photoURL = payload.image 
      }
      firebase.database().ref('/users/').child(user.uid).once('value')
      .then((response) => {
        console.log("firebase response: ", response)
        const fileName = payload.image.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))
        //put the raw image file into firebase storage
        return firebase.storage().ref('/users/' + user.uid + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        console.log("storage response", fileData)
        //return promise to save to firebase
        return fileData.ref.getDownloadURL()
      })
      .then(imageURL => {
        console.log("imageURL response", imageURL)
        return firebase.database().ref('/users/').child(user.uid).update({photoURL: imageURL})
      })
      .then(() => {
        console.log("sending update request to firebase for: ", user.displayName)
        firebase.database().ref('/users/').child(user.uid).update(updateObj)
        console.log("setting vuex state")
        commit('UPDATE_USER', {uid: user.uid, payload})
        commit('SET_LOADING', false)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    getRegisteredUsers(state) {
      return state.registeredUsers
    }
  }
}

export default AuthModule
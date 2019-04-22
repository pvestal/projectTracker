import firebase from 'firebase/app'
import 'firebase/database'

const ChatModule = {
  state: {
    chats: []
  },
  mutations: {
    SET_MESSAGES_EMPTY (state) {
      state.messages = []
    },
    SET_CHATS (state, payload) {
      state.chats = payload
    }
  },
  actions: {
    sendMessage ({commit}, payload) {
      let chatID = payload.chatID
      const message = {
        user: payload.username,
        content: payload.content,
        date: payload.date
      }
      firebase.database().ref('messages').child(chatID).child('messages').push(message)
        .then(() => {
          }
        )
        .catch((error) => {
            console.log(error)
          }
        )
    },
    loadChats ({commit}) {
      firebase.database().ref('chats').on('value', function (snapshot) {
        commit('SET_CHATS', snapshot.val())
      })
    },
    createChat ({commit}, payload) {
      let newPostKey = firebase.database().ref().child('chats').push().key
      let updates = {}
      updates['/chats/' + newPostKey] = {name: payload.chatName}
      firebase.database().ref().update(updates)
      return new Promise((resolve, reject) => {
        resolve(newPostKey)
      })
    }
  },
  getters: {
    chats (state) {
      return state.chats
    }
  }
}

export default ChatModule
import firebase from 'firebase/app'
import 'firebase/database'
import format from 'date-fns/format'

const MessageModule = {
  state: {
    messages: [],
    msgCounts: []
  },
  mutations: {
    SET_MESSAGES_EMPTY (state) {
      state.messages = []
    },
    ADD_MESSAGE(state, payload) {
      state.messages.push(payload)
    },
    SET_MESSAGES(state, payload) {
      state.messages = payload
    },
    SET_MESSAGE_COUNT(state, payload) {
      state.msgCounts = payload
    },
  },
  actions: {
    sendMessage ({commit, getters}, payload) {
      let chatID = payload.chatID
      let user = getters.user
      const message = {
        user: user.displayName,
        content: payload.content,
        created: format(Date.now(), 'DD/MM/YY HH:mm:ss'),
      }
      firebase.database().ref('chats').child(chatID).child('messages').push(message)
        .then(() => {
          }
        )
        .catch((error) => {
            console.log(error)
          }
        )
    },
    loadMessages ({commit}, payload) {
      let chatID = payload.chatID
      commit('SET_LOADING', true)
      firebase.database().ref('chats').child(chatID).once('value')
      .then(snapshot => {
        // commit('SET_CHATS', snapshot.val()) <--THIS DOES NOT WORK
        let tempMessagesArray = []
        snapshot.forEach((doc) => {
        let msg = doc.val()
            msg.key = doc.key
            tempMessagesArray.push(msg)
        })
        commit('SET_MESSAGES', tempMessagesArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    getCounts({commit}, chatID) {
      commit('SET_LOADING', true)
      firebase.database().ref('chats').child(chatID).child('messages').once('value')
      .then(snapshot => {
        let result = snapshot.numChildren()
        commit('SET_MESSAGE_COUNT', result)
        console.log("onlineUsers: ", result)
      })
    },
    addMessage ({commit, getters}, payload) {
      commit('SET_LOADING', true)
      const user = getters.user
      //get the firebase unique key to use
      const newPostKey = firebase.database().ref().child('messages').push().key
      
      const msgData = {
        msgID: newPostKey,
        chatName: payload.chatName,
        created: format(Date.now(), 'DD/MM/YY HH:mm:ss'),
        creator: user.id
      }
      //Update message state with payload
      commit('ADD_MESSAGE', msgData)
      //update firebase with payload at unique key
      firebase.database().ref('messages').child(newPostKey).update(msgData)
    }
  },
  getters: {
    messages (state) {
      return state.messages
    },
    getMessageCounts(state) {
      return state.msgCounts
    }
  }
}

export default MessageModule
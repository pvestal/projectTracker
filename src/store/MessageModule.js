import firebase from 'firebase/app'

const ChatModule = {
  state: {
    messages: []
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
    }
  },
  getters: {
    messages (state) {
      return state.messages
    },
  }
}

export default ChatModule
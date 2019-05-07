import firebase from 'firebase/app'
import 'firebase/database'
// import 'firebase/firestore'
import format from 'date-fns/format'

const ChatModule = {
  state: {
    chats: [
        {id: 'iusdoasud1i2', chatName: 'hardcoded 1', created: '07/05/19 06:30:00', creator: 'BuOSQwodeiPTODNGbuDHxMqT2Vl2'}
      ]
  },
  mutations: {
    SET_CHATS (state, payload) {
      state.chats = payload
    },
    PUSH_CHAT (state, payload) {
      console.log("payload mutation: ", payload)
      state.chats.push(payload)
    }
  },
  actions: {
    loadChats ({commit}) {
      firebase.database().ref('chats').once('value')
      .then(snapshot => {
        // commit('SET_CHATS', snapshot.val()) <--THIS DOES NOT WORK
        let tempchatsArray = []
        snapshot.forEach((doc) => {
        let chat = doc.val()
            chat.key = doc.key
            tempchatsArray.push(chat)
        })
        commit('SET_CHATS', tempchatsArray)
      })
    },
    addChat ({commit, getters}, payload) {
      commit('SET_LOADING', true)
      const user = getters.user
      //get the firebase unique key to use
      const newPostKey = firebase.database().ref().child('chats').push().key
      
      const chatData = {
        chatID: newPostKey,
        chatName: payload.chatName,
        created: format(Date.now(), 'DD/MM/YY HH:mm:ss'),
        creator: user.id
      }
      //Update chat state with payload
      commit('PUSH_CHAT', chatData)
      //update firebase with payload at unique key
      firebase.database().ref('chats').child(newPostKey).update(chatData)
    }
  },
  getters: {
    chats (state) {
      return state.chats
    }
  }
}

export default ChatModule
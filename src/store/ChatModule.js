import firebase from 'firebase/app'
// import 'firebase/database'
import 'firebase/firestore'
import format from 'date-fns/format'

const ChatModule = {
  state: {
    chats: []
  },
  mutations: {
    SET_CHATS (state, payload) {
      state.chats = payload
    },
    ADD_CHAT (state, payload) {
      state.chats.push(payload)
    }
  },
  actions: {
    loadChats({commit}) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('chats').get()
      .then((querySnapshot) => {
        let chatsArray = []
        querySnapshot.forEach((doc) => {
        let chat = doc.data()
            chat.id = doc.id
            chatsArray.push(chat)
        })
        commit('SET_CHATS', chatsArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    createChat ({commit, getters}, payload) {
      commit('SET_LOADING', true)
      const user = getters.user
      
      const chatData = {
        chatName: payload.chatName,
        created: format(Date.now(), 'YYYY-MM-DD'),
        creatorId: user.id,
        creator: user.displayName
      }

      firebase.firestore().collection('chats').add(chatData)
      .then(result => {
        console.log("chat: ", result)
        commit('ADD_CHAT', {
          ...result,
          id: result.id
        })
        commit('SET_LOADING', false)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
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
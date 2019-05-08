import firebase from 'firebase/app'
import 'firebase/database'
// import 'firebase/firestore'
import format from 'date-fns/format'

const ChatModule = {
  state: {
    chats: [
        // {id: 'iusdoasud1i2', chatName: 'hardcoded 1', created: '07/05/19 06:30:00', creator: 'BuOSQwodeiPTODNGbuDHxMqT2Vl2'}
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
      if (payload.image == null) {
        const chatDataNoPic = {
          chatID: newPostKey,
          chatName: payload.chatName,
          created: format(Date.now(), 'DD/MM/YY HH:mm:ss'),
          creator: user,
          uDisplayName: user.displayName
        }
        //Update chat state with payload
        commit('PUSH_CHAT', chatDataNoPic)
        //update firebase with payload at unique key
        firebase.database().ref('/chats/').child(newPostKey).update(chatDataNoPic)
        
      } else {
        const chatData = {
          chatID: newPostKey,
          image: payload.image,
          chatName: payload.chatName,
          created: format(Date.now(), 'DD/MM/YY HH:mm:ss'),
          creator: user,
          uDisplayName: user.displayName
        }
        firebase.database().ref('/chats/').child(newPostKey).once('value')
        .then((response) => {
          
          console.log("payload.image: ", payload.image)
          const fileName = payload.image.name
          const ext = fileName.slice(fileName.lastIndexOf('.'))
          //put the raw image file into firebase storage
          return firebase.storage().ref('/chats/' + newPostKey + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          console.log("storage response", fileData)
          //return promise to save to firebase
          return fileData.ref.getDownloadURL()
        })
        .then(imageURL => {
          console.log("imageURL response", imageURL)
          return firebase.database().ref('/chats/').child(newPostKey).update({imageURL: imageURL})
        })
        .then(() => {
          //Update chat state with payload
          commit('PUSH_CHAT', chatData)
          //update firebase with payload at unique key
          firebase.database().ref('/chats/').child(newPostKey).update(chatData)
          })
        .catch(error => console.log(error))
      }
    }
  },
  getters: {
    chats (state) {
      return state.chats
    }
  }
}

export default ChatModule
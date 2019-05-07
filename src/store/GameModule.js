import firebase from 'firebase/app'
import 'firebase/database'
import format from 'date-fns/format'


const GameModule = {
    state: {

    },
    mutations: {
        REGISTER_FOR_GAME(state, payload) {
            const id = payload.id
            if (state.user.registeredGames.findIndex(game => game.id === id) >= 0) {
                return
            }
            state.user.registeredGames.push(id)
        }
    },
    actions: {
        CreateGame({commit, getters}, payload) {
        const user = getters.user
        let gameID = payload.gameID
          const game = {
            creator: user.id,
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
        }
    },
    getters: {}
}

export default GameModule

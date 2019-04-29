import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from './router'
import {store} from './store/'
import 'vuetify/dist/vuetify.min.css'
import editProjectDialog from './components/editProject.vue'
// import newMsgDialog from './components/newMsgDialog.vue'

Vue.use(Vuetify)
Vue.component('edit-project', editProjectDialog )
// Vue.component('newMsg-Dialog', newMsgDialog )

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {

    firebase.initializeApp({
      apiKey: 'AIzaSyAzTMCKy_jAjJPgkOaTSGn4GCCQ0VsQLl4',
      authDomain: 'this-chat1.firebaseapp.com',
      databaseURL: 'https://this-chat1.firebaseio.com',
      projectId: 'this-chat1',
      storageBucket: 'this-chat1.appspot.com',
      messagingSenderId: '934857495101'
    })
    
    //check if auth
    firebase.auth().onAuthStateChanged((user) => {
      console.log("auth listener", user)
      if(user) {
        //load online users from firebase
        this.$store.dispatch('loadOnlineUsers')
      }
    })
    
    //load projects from firebase
    this.$store.dispatch('loadProjects')

  }
}).$mount('#app')

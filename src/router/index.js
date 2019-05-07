import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Dashboard from '@/views/Dashboard.vue'
// import CreateChat from '@/views/CreateChat.vue'
import Team from '@/views/Team.vue'
import Projects from '@/views/Projects.vue'
// import GetName from '@/views/getName.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Lobby from '@/views/Lobby.vue'
import Chat from '@/views/Chat.vue'
import Users from '@/views/Users.vue'
// import Chat from '@/components/Chat'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    // {
    //   path: '/createChat',
    //   name: 'CreateChat',
    //   component: CreateChat
    // },
    {
      path: '/team',
      name: 'team',
      component: Team
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: Lobby
    },
    {
      path: '/chat/:chatID',
      name: 'chat',
      component: Chat,
      props: true,
      beforeEnter: AuthGuard
    },
    // {
    //   path: '/getName',
    //   name: 'getName',
    //   component: GetName
    // },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // {
    //   path: '/chat',
    //   name: 'chat',
    //   component: Chat,
    //   props: true,
    //   // beforeEnter: AuthGuard
    //   beforeEnter: (to, from, next) => {
    //     if (to.params.name) {
    //       next()
    //     } else {
    //       next({name: 'getName'})
    //     }
    //   }
    // }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Team from './views/Team.vue'
import Projects from './views/Projects.vue'
import GetName from './views/getName.vue'
import Login from './views/Login.vue'
import Chat from '@/components/Chat'

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
    {
      path: '/team',
      name: 'team',
      component: Team
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/getName',
      name: 'getName',
      component: GetName
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      props: true,
      beforeEnter: (to, from, next) => {
        if (to.params.name) {
          next()
        } else {
          next({name: 'getName'})
        }
      }
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {user: true}
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignIn,
      meta: {user: false}
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUp,
      meta: {user: false}
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {requireAuth: true, user: true}
    }
  ]
})
router.beforeEach((to, from, next) => {
  const userToken = JSON.parse(Vue.localStorage.get('user_token'))
  if (to.meta.requireAuth && userToken) {
    next()
  }
  if (to.meta.requireAuth && !userToken) {
    next('signin')
  }
  if (to.meta.user && userToken) {
    next()
  }
  if (!to.meta.user && userToken) {
    next('dashboard')
  }
  next()
})

export default router

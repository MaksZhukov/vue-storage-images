import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/components/Home')
const SignUp = () => import('@/components/SignUp')
const Dashboard = () => import('@/components/Dashboard')
const SignIn = () => import('@/components/SignIn')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/sign-in',
    name: 'signin',
    component: SignIn,
    meta: {
      user: false
    }
  },
  {
    path: '/sign-up',
    name: 'signup',
    component: SignUp,
    meta: {
      user: false
    }
  },
  {
    path: '/dashboard/:page',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      user: true
    }
  },
  {
    path: '*',
    redirect: '/'
  }
  ]
})
router.beforeEach((to, from, next) => {
  const userToken = JSON.parse(Vue.localStorage.get('user_token'))
  if (to.meta.user && !userToken) {
    next('signin')
  }
  if (to.meta.user === false && userToken) {
    next('dashboard/1')
  }
  next()
})

export default router

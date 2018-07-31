// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
import App from './App'
import { firebase } from './firebase'
import store from './store'
import router from './router'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-icons'
Vue.config.productionTip = false

firebase.auth().onAuthStateChanged((user) => {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    router,
    store,
    VueLocalStorage,
    components: { App },
    template: '<App/>'
  })
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
import firebase from 'firebase/app'
import 'firebase/firestore'
import VueFire from 'vuefire'
import App from './App'
import store from './store'
import router from './router'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-icons'
Vue.config.productionTip = false
Vue.use(VueLocalStorage)
Vue.use(VueFire)
let config = {
  apiKey: 'AIzaSyAa99pqlQ-QyeSFUT1PHIKxSq1JFjQn-A0',
  authDomain: 'vue-storage-images.firebaseapp.com',
  databaseURL: 'https://vue-storage-images.firebaseio.com',
  projectId: 'vue-storage-images',
  storageBucket: 'vue-storage-images.appspot.com',
  messagingSenderId: '800715798272'
}

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    new Vue({ // eslint-disable-line no-new
      el: '#app',
      router,
      store,
      VueLocalStorage,
      components: { App },
      template: '<App/>'
    })
  }
})

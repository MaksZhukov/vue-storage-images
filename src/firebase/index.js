import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
import firebase from 'firebase'
import VueFire from 'vuefire'

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

const db = firebase.database()
const fs = firebase.firestore()
const st = firebase.storage()
const googleProvider = new firebase.auth.GoogleAuthProvider()

fs.settings({
  timestampsInSnapshots: true
})

export {
  firebase,
  db,
  fs,
  st,
  googleProvider
}

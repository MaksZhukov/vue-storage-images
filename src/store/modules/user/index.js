import Vue from 'vue'
import router from '../../../router'
import { toast } from 'materialize-css'
import { firebase, googleProvider } from '../../../firebase'

const getDefaultState = () => ({
  user: null,
  signUpResponse: {},
  signInWithGoogleResponse: {},
  signInResponse: {},
  emailVerificationResponse: {},
  addUserToDatabaseResponse: {}
})

const userModule = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    saveUser (state) {
      const user = firebase.auth().currentUser
      state.user = user
      Vue.localStorage.set('user_token', JSON.stringify(user.qa))
    },
    resetUser (state) {
      Vue.localStorage.remove('user_token')
      firebase.auth().signOut()
      const defaultState = getDefaultState()
      Object.keys(defaultState).forEach(key => {
        state[key] = defaultState[key]
      })
    },
    signUpPending (state, payload) {
      state.signUpResponse = payload
    },
    signUpSuccess (state, payload) {
      state.signUpResponse = payload
    },
    signUpError (state, payload) {
      state.signUpResponse = payload
    },
    signInWithGooglePending (state, payload) {
      state.signInWithGoogleResponse = payload
    },
    signInWithGoogleSuccess (state, payload) {
      state.signInWithGoogleResponse = payload
    },
    signInWithGoogleError (state, payload) {
      state.signInWithGoogleResponse = payload
    },
    signInPending (state, payload) {
      state.signInResponse = payload
    },
    signInSuccess (state, payload) {
      state.signInResponse = payload
    },
    signInError (state, payload) {
      state.signInResponse = payload
    },
    signInWarning (state, payload) {
      state.signInResponse = payload
    },
    emailVerificationPending (state, payload) {
      state.emailVerificationResponse = payload
    },
    emailVerificationSuccess (state, payload) {
      state.emailVerificationResponse = payload
    },
    emailVerificationError (state, payload) {
      state.emailVerificationResponse = payload
    }
  },
  actions: {
    async signIn ({commit, state}, {mail, pass}) {
      try {
        commit('signInPending', { pending: true })
        const { user } = await firebase.auth().signInWithEmailAndPassword(mail, pass)
        if (user.emailVerified) {
          commit('saveUser', user)
          commit('signInSuccess', { status: 'success', message: 'successful entry', pending: false })
        } else {
          commit('signInWarning', { status: 'warning', message: 'confirm your mail', pending: false })
        }
        const {message, status} = state.signInResponse
        toast(message, 3000, status)
        if (status === 'success') {
          router.push('dashboard')
        }
      } catch (error) {
        commit('signInError', { status: 'error', message: error, pending: false })
      }
    },
    async signInWithGoogle ({state, commit}) {
      try {
        commit('signInWithGooglePending', { pending: true })
        const { user } = await firebase.auth().signInWithPopup(googleProvider)
        commit('signInWithGoogleSuccess', { status: 'success', message: 'successful entry', pending: false })
        commit('saveUser', user)
        const {message, status} = state.signInWithGoogleResponse
        toast(message, 3000, status)
        router.push('dashboard')
      } catch (error) {
        const {message} = error
        commit('signInWithGoogleError', { status: 'error', message, pending: false })
        toast(message, 3000, 'error')
      }
    },
    async signUp ({ state, commit, dispatch }, {mail, pass}) {
      try {
        commit('signUpPending', { pending: true })
        await firebase.auth().createUserWithEmailAndPassword(mail, pass)
        await dispatch('sendEmailVerification')
        commit('signUpSuccess', { status: 'success', message: 'Check your email with letter', pending: false })
        const {message, status} = state.signUpResponse
        toast(message, 3000, status)
      } catch (error) {
        commit('signUpError', { status: 'error', message: error, pending: false })
      }
    },
    async sendEmailVerification ({ state, commit }) {
      try {
        const user = firebase.auth().currentUser
        commit('emailVerificationPending', { pending: true })
        await user.sendEmailVerification()
        commit('emailVerificationSuccess', { status: 'success', message: 'mail was send', pending: false })
      } catch (error) {
        commit('emailVerificationError', { status: 'error', message: error, pending: false })
      }
    }
  }
}

export default userModule

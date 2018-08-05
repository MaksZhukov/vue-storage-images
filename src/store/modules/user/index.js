import Vue from 'vue'
import router from '../../../router'
import { toast } from 'materialize-css'
import { firebase } from '../../../firebase'

const getDefaultState = () => ({
	user: null,
	signUpResponse: {},
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
    signUpPending (state, signUpResponse) {
      state.signUpResponse = signUpResponse
    },
    signUpSuccess (state, signUpResponse) {
			state.signUpResponse = signUpResponse
    },
    signUpError (state, signUpResponse) {
      state.signUpResponse = signUpResponse
    },
    signInPending (state, signInResponse) {
      state.signInResponse = signInResponse
    },
    signInSuccess (state, signInResponse) {
      state.signInResponse = signInResponse
    },
    signInError (state, signInResponse) {
      state.signInResponse = signInResponse
    },
    signInWarning (state, signInResponse) {
      state.signInResponse = signInResponse
    },
    emailVerificationPending (state, emailVerificationResponse) {
      state.emailVerificationResponse = emailVerificationResponse
    },
    emailVerificationSuccess (state, emailVerificationResponse) {
      state.emailVerificationResponse = emailVerificationResponse
    },
    emailVerificationError (state, emailVerificationResponse) {
      state.emailVerificationResponse = emailVerificationResponse
    }
  },
  actions: {
    async signIn ({commit, state}, {mail, pass}) {
      commit('signUpPending', { pending: true, status: '', message: '' })
      await firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then(({ user }) => {
          if (user.emailVerified) {
            commit('saveUser', user)
            commit('signInSuccess', { status: 'success', message: 'successful entry', pending: false })
          } else {
            commit('signInWarning', { status: 'warning', message: 'confirm your mail', pending: false })
          }
        })
        .catch(error => {
          commit('signInError', { status: 'error', message: error.message })
				})
				const {message, status} = state.signInResponse
				toast(message, 3000, status)
				if (status === 'success'){
					router.push('dashboard')
				}
    },
    async signUp ({ state, commit, dispatch }, {mail, pass}) {
      commit('signUpPending', { pending: true })
      await firebase
        .auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then(async () => {
          await dispatch('sendEmailVerification')
          commit('signUpSuccess', { status: 'success', message: 'Check your email with letter', pending: false })
        })
        .catch(error => {
          commit('signUpError', { status: 'error', message: error.message, pending: false })
				})
				const {message, status} = state.signUpResponse
				toast(message,3000,status)
    },
    sendEmailVerification ({ state, commit }) {
      const user = firebase.auth().currentUser
      commit('emailVerificationPending', { pending: true })
      return user.sendEmailVerification().then(() => {
        commit('emailVerificationSuccess', { status: 'success', message: 'mail was send', pending: false })
      }).catch(error => {
        commit('emailVerificationError', { status: 'error', message: error.message, pending: false })
      })
    }
  }
}

export default userModule

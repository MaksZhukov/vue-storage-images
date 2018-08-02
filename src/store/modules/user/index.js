import Vue from 'vue'
import { firebase, db } from '../../../firebase'
import { firestore } from '../../../../node_modules/firebase'

const userModule = {
  namespaced: true,
  state: {
    user: null,
    signUpResponse: { status: '', message: '' },
    signInResponse: { status: '', message: '' },
    emailVerificationResponse: {status: '', message: ''},
    addUserToDatabaseResponse: {status: '', message: ''}
  },
  mutations: {
    saveUser (state) {
      const user = firebase.auth().currentUser
      state.user = user
      Vue.localStorage.set('user_token', JSON.stringify(user.qa))
    },
    deleteUser (state) {
      state.user = null
      Vue.localStorage.remove('user_token')
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
    signIn ({commit}, {mail, pass}) {
      commit('signUpPending', { status: 'pending', message: '' })
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then(({ user }) => {
          if (user.emailVerified) {
            commit('saveUser', user)
            commit('signInSuccess', { status: 'success', message: 'successful entry' })
          } else {
            commit('signInWarning', { status: 'warning', message: 'confirm your mail' })
          }
        })
        .catch(error => {
          commit('signInError', { status: 'error', message: error.message })
        })
    },
    signUp ({ commit }, {mail, pass}) {
      commit('signUpPending', { status: 'pending', message: '' })
      firebase
        .auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then(() => {
          commit('signUpSuccess', { status: 'success', message: 'Check your email with letter' })
        })
        .catch(error => {
          commit('signUpError', { status: 'error', message: error.message })
        })
    },
    sendEmailVerification ({ state, commit }) {
      const user = firebase.auth().currentUser
      commit('emailVerificationPending', { status: 'pending', message: '' })
      user.sendEmailVerification().then(() => {
        commit('emailVerificationSuccess', { status: 'success', message: '' })
      }).catch(error => {
        commit('emailVerificationError', { status: 'error', message: error.message })
      })
    }
  }
}

export default userModule

import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { status: {}, uploadPending: false, patientData: {}, havePatientData: false, user: '', loggingIn: false, isAdmin: false, errorList: [] },
  mutations: {
    loginRequest (state, user) {
      state.status = { loggingIn: true }
    },
    loginSuccess (state, user) {
      state.status = { loggedIn: true }
      state.user = user
      localforage.setItem('user', user)
    },
    loginFailure (state) {
      state.status.loggingIn = false
    },
    logout (state) {
      state.status = {}
      state.user = ''
      localforage.removeItem('user-token')
    },
    gotInitialState (state, initialState) {
      state.user = initialState.user
      state.status = initialState.status
    },
    setUploadPending(state) {
      state.uploadPending = true
    },
    clearUploadPending(state) {
      state.uploadPending = false
    },
    loadedFromCache(state, patientData) {
      // Patient data has been decrypted
      // Save in store so we don't have to ask for password
      // every time user visits the home page
      state.havePatientData = true
      state.patientData = patientData
    },
    setAdmin(state, isAdmin) {
      state.isAdmin = isAdmin
    },
    logError(state, error) {
      let now = new Date()
      state.errorList.push({ index: Date.now(), date: now, error: error })
    }
  }
})

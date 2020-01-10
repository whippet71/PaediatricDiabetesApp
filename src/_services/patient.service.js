import Vue from 'vue'
import store from '../store'
import { authHeader } from '../_helpers'

export const patientService = {
  getPatients, getContacts
}

function getPatients() {
  return authHeader()
    .then(header => {
      const config = {
        headers: header,
        onUploadProgress: progressEvent =>
          this.updateProgress(progressEvent.loaded)
      }
      return Vue.axios.get(
        `${process.env.VUE_APP_API_URL}/Patient`,
        config
      )
    })
    .catch(error => {
      // Caller to log error
      return Promise.reject(error)
    })
}

function getContacts(id) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Vue.axios.get(
        `${process.env.VUE_APP_API_URL}/Contact/${id}`,
        config
      )
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

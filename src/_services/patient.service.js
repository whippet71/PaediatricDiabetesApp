import Vue from 'vue'
import { authHeader } from '../_helpers'

export const patientService = {
  getPatients
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
      return Promise.reject(error)
    }) 
}

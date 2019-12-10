import Vue from 'vue'
import localforage from 'localforage'
import store from '../store'

// import { authHeader } from '../_helpers'

export const userService = {
  login,
  logout
}

function login (username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    //data: JSON.stringify({ username, password })
    data: { username, password }
  }

  return Vue.axios(`${process.env.VUE_APP_API_URL}/Login`, requestOptions)
    .then(handleResponse)
    .then(json => {
      // login successful if there's a jwt token in the response
      if (json.token) {
        // store user details and jwt token to keep user logged in between page refreshes
        localforage.setItem('user-token', json.token)
        localforage.setItem('salt', json.salt)
        // Store the encrypted patient data and lookup tables
        localforage.setItem('patientListEncrypted', json.patientListEncrypted)
        localforage.setItem('activityTypes', json.activityTypes)
        localforage.setItem('contactTypes', json.contactTypes)
        localforage.setItem('locations', json.locations)
        localforage.setItem('staff', json.staff)
        // Store admin flag both in local storage and Vuex store
        localforage.setItem('isAdmin', json.isAdmin)
        store.commit('setAdmin', json.isAdmin)
      }

      return json
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

function logout () {
  // remove user from local storage to log user out
  localStorage.removeItem('user-token')
}

// function getAll() {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };

//     return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
// }

function handleResponse (response) {
  if (response.status != 200) {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      logout()
      location.reload(true)
    }

    return Promise.reject(response.statusText)
  }

  return response.data
}

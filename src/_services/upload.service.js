import Vue from 'vue'
import localforage from 'localforage'
import { authHeader } from '../_helpers'
import store from '../store'

export const uploadService = {
  saveContact, uploadPendingContacts, uploadContacts, updateContact, updateDetails, uploadContactType, uploadActivityType, uploadLocation, uploadUser, disableUser
}

function saveContact(newContact) {
  return localforage.getItem('contacts')
    .then((contacts) => {
      if (contacts && Array.isArray(contacts)) {
        contacts.push(newContact)
      } else {
        contacts = []
        contacts.push(newContact)
      }
      localforage.setItem('contacts', contacts)
    })
    .catch((error) => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function uploadPendingContacts(patientId) {
  return localforage.getItem('contacts')
    .then((contacts) => {
      if (contacts && Array.isArray(contacts)) {
        return uploadContacts(contacts)
      }
    })
    .then(() => {
      store.commit('clearUploadPending')
      return Promise.resolve(localforage.removeItem('contacts'))
    })
    .catch((error) => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function uploadContacts(contacts) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Promise.resolve(Vue.axios.post(
        `${process.env.VUE_APP_API_URL}/Contact/`,
        contacts,
        config
      ))
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function updateContact(contact) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Promise.resolve(Vue.axios.put(
        `${process.env.VUE_APP_API_URL}/Contact/${contact.Id}`,
        contact,
        config
      ))
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function updateDetails(patient) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Promise.resolve(Vue.axios.put(
        `${process.env.VUE_APP_API_URL}/Patient/${patient.Id}`,
        patient,
        config
      ))
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function uploadContactType(name) {
  return uploadGeneric(name, `${process.env.VUE_APP_API_URL}/ContactType/`)
}

function uploadActivityType(name) {
  return uploadGeneric(name, `${process.env.VUE_APP_API_URL}/Activity/`)
}

function uploadLocation(name) {
  return uploadGeneric(name, `${process.env.VUE_APP_API_URL}/Location/`)
}

function uploadGeneric(name, url) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Promise.resolve(Vue.axios.post(
        url,
        { Name: name },
        config
      ))
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function uploadUser(login, displayName, isAdmin) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Promise.resolve(Vue.axios.post(
        `${process.env.VUE_APP_API_URL}/user/`,
        { Username: login, DisplayName: displayName, IsAdmin: isAdmin },
        config
      ))
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

function disableUser(id) {
  return authHeader()
    .then(header => {
      const config = {
        headers: header
      }
      return Promise.resolve(Vue.axios.delete(
        `${process.env.VUE_APP_API_URL}/user/${id}`,
        config
      ))
    })
    .catch(error => {
      store.commit('logError', error.toJSON())
      return Promise.reject(error)
    })
}

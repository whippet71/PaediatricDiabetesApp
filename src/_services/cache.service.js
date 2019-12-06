import localforage from 'localforage'
const crypto = require('crypto')

export const cacheService = {
  getPatientDataFromCache
}

function getPatientDataFromCache(password) {
  const params = {}
  return localforage.getItem('patientListEncrypted')
    .then((patientListEncrypted) => {
      params.patientListEncrypted = patientListEncrypted
      return localforage.getItem('salt')
    })
    .then((salt) => {
      params.salt = salt
      // NOTE - we must RESOLVE the promise we get back from decryptPatientData()
      return Promise.resolve(decryptPatientData(params, password))
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

function decryptPatientData(results, password) {
  const { patientListEncrypted, salt } = results
  const iterations = parseInt(process.env.VUE_APP_ITERATIONS)

  let enc = _base64ToArrayBuffer(patientListEncrypted)
  let saltBuffer = Buffer.from(salt, 'ascii')
  let passwordBuffer = Buffer.from(password, 'ascii')

  // Generate the hash from the user's password
  // length is in BYTES - want 32 bytes for key and then a further 16 for the iv
  var all = crypto.pbkdf2Sync(passwordBuffer, saltBuffer, iterations, 48, 'sha1') 
  let hash = all.slice(0, 32)
  let Iv = all.slice(32,48)

  // Now decrypt the data
  return window.crypto.subtle.importKey('raw', hash, { name: 'AES-GCM', iv: Iv }, false, ['decrypt'])
    .then((key) => {      
      return window.crypto.subtle.decrypt({ 'name': 'AES-GCM', iv: Iv }, key, enc)
    })
    .then((decrypted) => {
      return new TextDecoder().decode(decrypted)
    })
    .catch((error) => {
      throw error
    })
}

function _base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

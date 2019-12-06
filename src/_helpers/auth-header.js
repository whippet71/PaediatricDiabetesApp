import localforage from 'localforage'

export function authHeader () {
  // return authorization header with jwt token
  return localforage.getItem('user-token')
    .then((token) => {
      return { 'Authorization': `Bearer ${token}` }
    })
    .catch((error) => console.log(error))
}

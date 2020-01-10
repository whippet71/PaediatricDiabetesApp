import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'
import Admin from '../views/Admin.vue'
import Details from '../views/Details.vue'
import Errors from '../views/Errors.vue'
import localforage from 'localforage'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/PaediatricDiabetesApp/' : '/',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/about', name: 'about', component: About },
    { path: '/admin', name: 'admin', component: Admin },
    { path: '/details', name: 'patientdetails', component: Details },
    { path: '/errorList', name: 'errorList', component: Errors },
    // Add other routes here

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/about', '/errorList']
  const adminPages = ['/admin']
  const authRequired = !publicPages.includes(to.path)
  const adminPage = adminPages.includes(to.path)
  localforage.getItem('user-token')
    .then((loggedIn) => {
      if (authRequired && !loggedIn) {
        return next('/login')
      }

      if (adminPage) {
        localforage.getItem('isAdmin')
          .then(admin => {
            if (!admin) {
              return next('/')
            } else {
              next()
            }
          })
      } else {
        next()
      }
    })
})

export default router

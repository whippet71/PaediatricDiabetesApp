<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark">
        <b-navbar-brand to="/">
          <img src="./assets/YDH-circle-white.png" height="40" width="40" alt="YDH" />
          Paediatric Diabetes
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Patient List</b-nav-item>
            <b-nav-item to="/admin" :disabled="!online || !isAdmin">Admin</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-if="username">
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{username}}</em>
              </template>
              <b-dropdown-item href="#" v-on:click="logout">Log Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
    <pending-notifier></pending-notifier>
  </div>
</template>

<script>
import localforage from 'localforage'
import store from './store'
import router from './router'
import { uploadService } from '@/_services'
import PendingNotifier from '@/components/PendingNotifier.vue'
import toast from './_mixins/toast'

export default {
  name: 'app',
  mixins: [
    toast
  ],
  components: {
    'pending-notifier': PendingNotifier
  },

  data: function() {
    return {
      online: false,
    }
  },
  computed: {
    uploadPending() {
      return this.$store.state.uploadPending
    },
    isAdmin() {
      return this.$store.state.isAdmin
    },
    username() {
      return this.$store.state.user
    }
  },
  methods: {
    logout: function() {
      store.commit('logout')
      router.push('/login')
    },
    uploadPendingContacts() {
      uploadService.uploadPendingContacts()
        .then(() => {
          this.showToast('Pending uploads have been saved')
        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status === 401) {
            // Token has expired, user needs to login again
            router.push('/login')
          }
        })
    },
    userNowOnline() {
      this.online = true
      if (this.uploadPending) {
        this.uploadPendingContacts()
      }
    }
  },
  watch: {
    $route(to, from) {
      if (this.online && this.uploadPending) {
        // This handles the case where we tried to upload pending changes
        // but token had expired. User has now logged in but data still
        // pending as the router moves the user to the home page
        this.uploadPendingContacts()
      }
    }
  },
  created: function() {
    this.online = (window.Offline.state === 'up')
    window.Offline.on('up', () => { this.userNowOnline() })
    window.Offline.on('down', () => { this.online = false })

    var token
    localforage.getItem('user-token')
      .then(t => {
        token = t
        return localforage.getItem('user')
      })
      .then(user => {
        const initialState = token
          ? { status: { loggedIn: true }, user }
          : { status: {}, user: null }
        store.commit('gotInitialState', initialState)
      })
    localforage.getItem('contacts')
      .then(contacts => {
        if (contacts && Array.isArray(contacts)) {
          // Uploads are pending... are we online?
          if (this.online) {
            // Send to server
            this.uploadPendingContacts()
          } else {
            store.commit('setUploadPending')
          }
        }
      })
    localforage.getItem('isAdmin')
      .then(admin => {
        if (admin) {
          store.commit('setAdmin', admin)
        }
      })     
  }
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  background-color: #6d3176!important;
}
</style>

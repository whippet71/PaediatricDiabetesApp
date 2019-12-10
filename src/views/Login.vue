<template>
  <b-container>
    <h2 class="mt-2">Please login</h2>
    <h4 class="mt-2">Use your network username and password</h4>
    <b-row class="justify-content-md-center">
      <b-col cols="8">
        <b-alert :show='message' :variant='alertType'>{{message}}</b-alert>

        <b-form @submit.prevent="handleSubmit">
          <b-form-group
            id="input-group-username"
            label="Username:"
            label-for="input-username"
          >
            <b-form-input
              id="input-username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
              :class='{ "is-invalid": submitted && !username }'
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-password" label="Password:" label-for="input-password">
            <b-form-input
              id="input-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              :class='{ "is-invalid": submitted && !password }'
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-submit">
            <b-button v-if='!loggingIn' type="submit" variant="primary">Login</b-button>
            <b-spinner  v-if='loggingIn' variant="primary" label="Spinning"></b-spinner>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { userService } from '../_services'
import router from '../router'
import store from '../store'

export default {
  data () {
    return {
      username: '',
      password: '',
      submitted: false,
      message: '',
      alertType: ''
    }
  },
  computed: {
    loggingIn () {
      return this.$store.state.status.loggingIn
    }
  },
  created () {
    // reset login status
    this.$store.commit('logout')
  },
  methods: {
    handleSubmit (e) {
      this.submitted = true
      const { username, password } = this
      if (username && password) {
        store.commit('loginRequest', username)
        userService.login(username, password).then(
          (user) => {
            this.alertType = ''
            this.message = ''
            store.commit('loginSuccess', username)
            router.push('/')
          },
          (error) => {
            store.commit('loginFailure')
            this.alertType = 'danger'
            this.message = 'Login failed. Are your username and password correct?'
            // Hide the user's password in the error message!
            error.config.data = "************"
          }
        )
      }
    }
  }
}
</script>

<style scoped>
  label {
    font-size: large;
  }
</style>

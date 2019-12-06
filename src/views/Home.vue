<template>
  <div class="home">
    <h3 class="mt-2">Current referrals</h3>

    <div v-if="loadingPatientList">
      <p>
        <span>Loading data...</span>
        <br/>
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </p>
    </div>

    <div v-if="patientData">
      <b-table-simple hover caption-top responsive>
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>First name</b-th>
            <b-th>Last Name</b-th>
            <b-th>NHS #</b-th>
            <b-th>DOB</b-th>
            <b-th>Referral date</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="(patient,index) in patientData"
            v-bind:item="patient"
            v-bind:index="index"
            v-bind:key="patient.Id"
            v-on:click="selectPatient(patient)"
          >
            <b-td>{{patient.FirstName}}</b-td>
            <b-td>{{patient.LastName}}</b-td>
            <b-td>{{patient.NHSNumber}}</b-td>
            <b-td>{{formatDate(patient.DateOfBirth)}}</b-td>
            <b-td>{{formatDate(patient.ReferralDate)}}</b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>

    <b-modal id="password-modal" @ok="loadFromCache" title="Please enter your password:">
      <b-form @submit.prevent="loadFromCache">
        <b-form-group id="input-group-password" label-for="input-password">
          <b-form-input id="input-password" v-model="password" type="password" autocomplete="current-password" required></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import store from '../store'
import { cacheService, dateService } from '../_services'
import { authHeader } from '../_helpers'
import localforage from 'localforage'
import toast from '../_mixins/toast'

// NOTE we may need to check online/offline status after certain events???

export default {
  name: 'home',
  mixins: [
    toast
  ],
  mounted: function() {
    this.useCached = window.Offline.state === 'down'
    // If offline, prompt for password and use cached patient list
    if (this.useCached) {
      if (this.$store.state.havePatientData) {
        // We've already decrypted it - use copy from Vuex store
        this.patientData = this.$store.state.patientData
      } else {
        // Need to decrypt - ask user for password
        this.$bvModal.show('password-modal')
      }
    } else {
      // If online, load new patient list
      // TODO: only if don't have list already!
      this.updatePatientList()
    }
  },
  data: function() {
    return {
      useCached: false,
      loadingPatientList: false,
      patientData: {},
      password: '',
      max: 100
    }
  },
  methods: {
    loadFromCache: function() {
      this.$bvModal.hide('password-modal')
      cacheService
        .getPatientDataFromCache(this.password)
        .then(result => {
          this.patientData = JSON.parse(result)
          store.commit('loadedFromCache', this.patientData)
          this.showToast('Patient list loaded from cache', 'success')
        })
        .catch(error => {
          console.dir(error)
          this.showToast(
            'Error loading saved patient list: ' + error,
            'danger'
          )
        })
    },
    updatePatientList: function() {
      this.loadingPatientList = true

      // Get the authentication token to send with the request
      authHeader()
        .then(header => {
          const config = {
            headers: header,
            onUploadProgress: progressEvent =>
              this.updateProgress(progressEvent.loaded)
          }
          return this.$root.axios.get(
            `${process.env.VUE_APP_API_URL}/Patient`,
            config
          )
        })
        .then(result => {
          // We got a refreshed auth token back, store it
          localforage.setItem('user-token', result.headers['x-new-token'])

          this.patientData = result.data.patients
          this.showToast('Patient list updated', 'success')
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            // token has expired, user needs to login again
            this.$router.push({ name: 'login' })
          }
          this.showToast('Error loading patient list: ' + error, 'danger')
        })
        .finally(() => {
          this.loadingPatientList = false
        })
    },
    selectPatient(patient) {
      this.$router.push({ name: 'patientdetails', params: { patient: patient } })
    },
    updateProgress(percent) {
      // This doesn't get called... sees like onUploadProgress doesn't work in this case
    },
    formatDate(date) {
      return dateService.formatDate(date)
    }
  }
}
</script>

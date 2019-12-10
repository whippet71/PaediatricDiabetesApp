<template>
  <b-container>
    <h2 class="mt-2">Admin page</h2>

    <b-form inline class="mt-3 mb-3" @submit.prevent="addContactType">
      <label for="input-contact-type">New contact type:</label>
      <b-input id="input-contact-type" v-model="newContactType" class="mr-2 ml-2"></b-input>
      <b-button type="submit" variant="primary">Add</b-button>
    </b-form>

    <b-form inline class="mb-3" @submit.prevent="addactivityType">
      <label for="input-activity-type">New activity type:</label>
      <b-input id="input-activity-type" v-model="newActivityType" class="mr-2 ml-2"></b-input>
      <b-button type="submit" variant="primary">Add</b-button>
    </b-form>

    <b-form inline class="mb-3" @submit.prevent="addLocation">
      <label for="input-location">New location:</label>
      <b-input id="input-location" v-model="newLocation" class="mr-2 ml-2"></b-input>
      <b-button type="submit" variant="primary">Add</b-button>
    </b-form>

    <hr/>

    <b-form inline class="mb-3 mt-3" @submit.prevent="disableUser">
      <label for="input-disable-user">Disable user:</label>
      <b-form-select
          id="input-disable-user"
           class="mr-2 ml-2"
          v-model="userToDisable"
          :options="users"
          required
        ></b-form-select>
      <b-button type="submit" variant="warning">Disable</b-button>
    </b-form>

    <b-form inline class="mb-3" @submit.prevent="addUser">
      <label for="input-new-user-login">Add new user:</label>
      <b-input id="input-new-user-login" v-model="newUserLogin" placeholder="e.g. John Morgan" class="mr-2 ml-2"></b-input>
      <label for="input-new-user-display-name">with login:</label>
      <b-input id="input-new-user-display-name" v-model="newUserDisplayName" placeholder="e.g. john.morgan" class="mr-2 ml-2"></b-input>
      <b-form-checkbox v-model="newUserIsAdmin" class="ml-2 mr-2">Is admin?</b-form-checkbox>
      <b-button type="submit" variant="primary">Add</b-button>
    </b-form>
    
  </b-container>
</template>

<script>
import localforage from 'localforage'
import toast from '../_mixins/toast'
import { uploadService } from '../_services'

export default {
  name: 'admin',
  mixins: [
    toast
  ],
  data() {
    return {
      newContactType: '',
      newActivityType: '',
      newLocation: '',
      userToDisable: '',
      newUserLogin: '',
      newUserDisplayName: '',
      newUserIsAdmin: false,
      users: {}
    }
  },
  computed: {},
  created() {
    localforage.getItem('staff').then(staff => {
      this.users = staff;
    })
  },
  methods: {
    reset() {
      this.newContactType = ''
      this.newActivityType = ''
      this.newLocation = ''
      this.userToDisable = this.users[0].id
      this.newUserLogin = ''
      this.newUserDisplayName = ''
      this.newUserIsAdmin = false
    },
    addContactType() {
      uploadService.uploadContactType(this.newContactType)
        .then(result => {
          this.showToast('Contact type added')
          // Add to dropdown list
          localforage.getItem('contactTypes')
            .then((contactTypes) => {
              contactTypes.push({ value: result.data.Id, text: result.data.Name })
              localforage.setItem('contactTypes', contactTypes)
            })
        })
        .catch(error => {
          this.showToast('Error saving contact type: ' + error, 'danger')
        })
        .finally(() => {
          this.reset()
        })     
    },
    addactivityType() {
      uploadService.uploadActivityType(this.newActivityType)
        .then(result => {
          this.showToast('Activity type added')
          // Add to dropdown list
          localforage.getItem('activityTypes')
            .then((activityTypes) => {
              activityTypes.push({ value: result.data.Id, text: result.data.Name })
              localforage.setItem('activityTypes', activityTypes)
            })
        })
        .catch(error => {
          this.showToast('Error saving contact type: ' + error, 'danger')
        })
        .finally(() => {
          this.reset()
        })     
    },
    addLocation() {
      uploadService.uploadLocation(this.newLocation)
        .then(result => {
          this.showToast('Location added')
          // Add to dropdown list
          localforage.getItem('locations')
            .then((locations) => {
              locations.push({ value: result.data.Id, text: result.data.Name })
              localforage.setItem('locations', locations)
            })
        })
        .catch(error => {
          this.showToast('Error saving contact type: ' + error, 'danger')
        })
        .finally(() => {
          this.reset()
        })     
    },
    disableUser() {
      uploadService.disableUser(this.userToDisable)
        .then(result => {
          this.showToast('User disabled')
          this.reset()
        })     
    },
    addUser() {
      uploadService.uploadUser(this.newUserLogin, this.newUserDisplayName, this.newUserIsAdmin)
        .then(result => {
          this.showToast('User added')
          // Add to dropdown list
          localforage.getItem('staff')
            .then((staff) => {
              staff.push({ value: result.data.Id, text: result.data.DisplayName, data: result.data.Username })
              localforage.setItem('staff', staff)
            })
        })
        .catch(error => {
          this.showToast('Error saving contact type: ' + error, 'danger')
        })
        .finally(() => {
          this.reset()
        })     
    }
  }
}
</script>
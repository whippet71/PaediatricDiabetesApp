<template>
  <div>
    <div v-if="patient" class="details">
      <b-row class="mt-2 mb-2 ml-2">
        <b-col cols="9" class="text-left">
          <div class="patient-name">{{patient.FirstName}} {{patient.LastName}}</div>
        </b-col>
        <transition name="fade">
          <b-col cols="3" v-if="online">
            <b-button variant="primary" @click="editDetails">Edit details</b-button>
          </b-col>
        </transition>
      </b-row>

      <patient-details :patient="patient"></patient-details>

      <edit-details-modal
        ref="editDetailsModal"
        :show="showEditDetailsModal"
        v-on:submitted="detailsSubmitted"
        v-on:cancelled="detailsCancelled"
      ></edit-details-modal>

      <contact-modal
        ref="contactModal"
        :patientId="patient.Id"
        :contacts="contacts"
        :contactTypes="contactTypes"
        :activityTypes="activityTypes"
        :locations="locations"
        :staff="staff"
        :show="showContactModal"
        :id="contactId"
        v-on:submitted="contactSubmitted"
        v-on:cancelled="contactCancelled"
      ></contact-modal>

      <b-row class="mt-3 mb-3">
        <b-button variant="success" size="lg" class="mx-auto" @click="addContact()">Add new contact</b-button>
      </b-row>

      <div v-if="loadContacts">
        <p v-if="loadingContacts">
          <span>Loading contacts....</span>
          <br/>
          <b-spinner variant="primary" label="Spinning"></b-spinner>
          </p>
        <div v-else class="ml-2 mr-2">
          <contact-list
            :contacts="contacts"
            :contactTypes="contactTypes"
            :activityTypes="activityTypes"
            :locations="locations"
            :staff="staff"
            :online="online"
            v-on:edit="editContact"
          ></contact-list>
        </div>
      </div>
      <div v-else>
        <b-alert variant="warning" show>We can't show details of patient contacts as you're currently offline</b-alert>
      </div>

    </div>

  </div>
</template>

<script>
import router from '../router'
import store from '../store'
import localforage from 'localforage'
import { authHeader } from '../_helpers'
import { patientService, uploadService } from '../_services'
import PatientDetails from '@/components/PatientDetails.vue'
import ContactList from '@/components/ContactList.vue'
import ContactModal from '@/components/ContactModal.vue'
import EditDetailsModal from '@/components/EditDetailsModal.vue'
import toast from '../_mixins/toast'

export default {
  name: 'patientdetails',
  mixins: [
    toast
  ],
  components: {
    'patient-details': PatientDetails,
    'contact-list': ContactList,
    'contact-modal': ContactModal,
    'edit-details-modal': EditDetailsModal
  },
  created: function() {
    this.patient = this.$route.params.patient
    if (this.patient === undefined) {
      this.$router.push({ name: 'home' })
      return
    }

    window.Offline.on('up', () => { 
      this.goOnline()
    })
    window.Offline.on('down', () => { this.online = false })

    if (window.Offline.state === 'up') {
      this.goOnline()
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.loadLookups()
    })
  },
  data() {
    return {
      patient: {
        Id: 0
      },
      contacts: [],
      loadContacts: false,
      loadingContacts: false,
      activityTypes: [],
      contactTypes: [],
      locations: [],
      staff: [],
      online: false,
      showContactModal: false,
      showEditDetailsModal: false,
      contactId: 0
    }
  },
  methods: {
    goOnline() {
      this.online = true
      this.loadContacts = true
      // Load list of patient contacts
      this.getContacts()
    },
    loadLookups() {
      localforage.getItem('activityTypes')
        .then((activityTypes) => {
          this.activityTypes = activityTypes
          return localforage.getItem('contactTypes')
        })
        .then((contactTypes) => {
          this.contactTypes = contactTypes
          return localforage.getItem('locations')
        })
        .then((locations) => {
          this.locations = locations
          return localforage.getItem('staff')
        })
        .then((staff) => {
          this.staff = staff
        })
        .catch((error) => console.log(error))
    },
    getContacts() {
      this.loadingContacts = true
      // Get the authentication token to send with the request
      patientService.getContacts(this.patient.Id)
        .then(result => {
          this.contacts = result.data
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            // token has expired, user needs to login again
            this.$router.push({ name: 'login' })
          } else {
            this.showToast('Error loading patient contacts: ' + error, 'danger')
          }
        })
        .finally(() => {
          this.loadingContacts = false
        })
    },
    editContact(id) {
      this.contactId = id
      var contactBeingEdited = this.contacts.find(f => f.Id === id)
      // console.dir(contactBeingEdited)
      this.$refs.contactModal.setContact(contactBeingEdited)
      this.showContactModal = true
    },
    editDetails() {
      this.$refs.editDetailsModal.setPatientDetails(this.patient)
      this.showEditDetailsModal = true
    },
    addContact() {
      this.contactId = 0
      this.$refs.contactModal.reset()
      this.showContactModal = true
    },
    contactSubmitted(form) {
      this.showContactModal = false
      if (this.contactId === 0) {
        window.Offline.check()
        // Adding new contact
        // If online, post to server, else save in cache
        if (this.online) {
          this.saveToNetwork(form)
        } else {
          this.saveToCache(form)
        }
      } else {
        // Editing existing contact
        // User will only get option to do this if network is up, assume it still is
        uploadService.updateContact(form)
          .then(result => {
            this.showToast('Patient contact updated')
          })
          .catch(error => {
            this.showToast('Error updating patient contact: ' + error, 'danger')
          })
          .finally(() => {
            // reload contacts
            this.getContacts()
          })
      }
    },
    contactCancelled() {
      this.showContactModal = false
    },
    detailsSubmitted(changes) {
      // Currently only the key worker can be changed
      this.patient.KeyWorker = changes.KeyWorker
      this.patient.TrakCareNumber = changes.TrakCareNumber
      this.patient.ReferralDate = changes.ReferralDate
      this.showEditDetailsModal = false
      uploadService.updateDetails(this.patient)
        .then(result => {
          this.showToast('Patient details updated')
        })
        .catch(error => {
          this.showToast('Error updating patient details: ' + error, 'danger')
        })
      },
    detailsCancelled() {
      this.showEditDetailsModal = false
    },
    saveToNetwork(form) {
      let contactsToPost = []
      contactsToPost.push(form)
      uploadService.uploadContacts(contactsToPost)
        .then(result => {
          this.showToast('Patient contact saved')
        })
        .catch(error => {
          this.showToast('Error saving patient contact: ' + error, 'danger')
        })
        .finally(() => {
          // reload contacts
          this.getContacts()
        })
    },
    saveToCache(form) {
      // store in local storage
      uploadService.saveContact(form)
        .then(() => {
          this.showToast('Patient contact saved to device')
          // update Vuex state
          store.commit('setUploadPending', true)
        })
        .catch(error => {
          this.showToast('Error saving patient contact to device: ' + error, 'danger')
        })
    }
  }
}
</script>

<style scoped>
.patient-name {
  font-size: x-large;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

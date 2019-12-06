<template>
  <b-modal id="add-contact-modal" title="Add Contact" v-model="show">
    <b-form v-bind:validated="false" @submit.prevent="onSubmit">

      <input type="hidden" id="input-id" name="Id" v-bind:value="id"/>

      <b-form-group id="input-group-contact-type" label="Contact type:" label-for="input-contact-type">
        <b-form-select
          id="input-contact-type"
          v-model="ContactTypeId"
          :options="contactTypes"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-activity-type" label="Activity type:" label-for="input-contactivityact-type">
        <b-form-select
          id="input-activity-type"
          v-model="ActivityId"
          :options="activityTypes"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-location" label="Location:" label-for="input-location">
        <b-form-select
          id="input-location"
          v-model="LocationId"
          :options="locations"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-hours" label="Hours:" label-for="input-hours">
        <b-form-input
          id="input-hours"
          v-model="Time"
          type="number"
          step="0.01"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-num-contacts" label="Number of contacts:" label-for="input-num-contacts">
        <b-form-input
          id="input-num-contacts"
          v-model="NumberOfContacts"
          type="number"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>&nbsp;&nbsp;
      <b-button type="cancel" variant="secondary" @click.prevent="cancel()">Cancel</b-button>
    </b-form>
    <template v-slot:modal-footer="{ ok, cancel, hide }">
      <!-- Disable footer --><span></span>
    </template>
  </b-modal>
</template>

<script>
import localforage from 'localforage'

export default {
  name: 'ContactModal',
  props: {
    id: Number,
    patientId: Number,
    show: Boolean,
    contactTypes: Array,
    activityTypes: Array,
    locations: Array,
    staff: Array
  },
  data() {
    return {
      ContactTypeId: 1,
      ActivityId: 1,
      LocationId: 1,
      Time: 0,
      NumberOfContacts: 1
    }
  },
  computed: {
  },
  methods: {
    setContact(contact) {
      this.ContactTypeId = contact.ContactTypeId
      this.ActivityId = contact.ActivityId
      this.LocationId = contact.LocationId
      this.Time = contact.Time
      this.NumberOfContacts = contact.NumberOfContacts
      this.ContactDate = contact.ContactDate
    },
    reset() {
      this.ContactTypeId = 1
      this.ActivityId = 1
      this.LocationId = 1
      this.Time = 0
      this.NumberOfContacts = 1
    },
    onSubmit(event) {
      localforage.getItem('user')
        .then((username) => {
          let usernameLowerCase = username.toLowerCase()
          let staffId = this.staff.find(f => f.data.toLowerCase() === usernameLowerCase).value

          var form = {
            ContactTypeId: this.ContactTypeId,
            ActivityId: this.ActivityId,
            LocationId: this.LocationId,
            Time: this.Time,
            NumberOfContacts: this.NumberOfContacts,
            StaffId: staffId,
            ContactDate: this.ContactDate,
            Id: this.id,
            PatientId: this.patientId
          }
          // Notify parent of form submission - patientID gets populated in Details.vue
          this.$emit('submitted', form)
        })
    },
    cancel() {
      this.$emit('cancelled')
    }
  }
}
</script>

<style scoped lang="scss">

</style>

<template>
  <b-modal id="edit-details-modal" title="Edit patient details" v-model="show">
    <b-form v-bind:validated="false" @submit.prevent="onSubmit">

      <b-form-group id="input-group-key-worker" label="Key worker:" label-for="input-key-worker">
        <b-form-input
          id="input-key-worker"
          v-model="KeyWorker"
          type="text"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-tc-number" label="TrakCare number:" label-for="input-tc-number">
        <b-form-input
          id="input-tc-number"
          v-model="TrakCareNumber"
          type="text"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-referral-date" label="Referral date:" label-for="input-referral-date">
        <b-form-input
          id="input-referral-date"
          v-model="ReferralDate"
          type="date"
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

export default {
  name: 'EditDetailsModal',
  props: {
    show: Boolean
  },
  data() {
    return {
      KeyWorker: '',
      TrakCareNumber: '',
      ReferralDate: {}
    }
  },
  computed: {
  },
  methods: {
    setPatientDetails(patient) {
      this.KeyWorker = patient.KeyWorker
      this.TrakCareNumber = patient.TrakCareNumber
      this.ReferralDate = patient.ReferralDate
    },
    onSubmit(event) {
      var updates = {
        // The PUT method on the server only updates these 3 fields
        KeyWorker: this.KeyWorker,
        TrakCareNumber: this.TrakCareNumber,
        ReferralDate: this.ReferralDate
      }
      // Notify parent of form submission
      this.$emit('submitted', updates)

    },
    cancel() {
      this.$emit('cancelled')
    }
  }
}
</script>

<style scoped lang="scss">

</style>

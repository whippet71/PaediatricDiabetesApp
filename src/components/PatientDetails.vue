<template>
  <b-list-group>
    <b-list-group-item>
      <b-row>
        <b-col cols="3" class="text-right heading">NHS Number:</b-col>
        <b-col cols="9" class="text-left">{{ patient.NHSNumber }}</b-col>
      </b-row>
    </b-list-group-item>
    <b-list-group-item>
      <b-row>
        <b-col cols="3" class="text-right heading">Date of birth:</b-col>
        <b-col cols="9" class="text-left">{{ formattedDateOfBirth }}</b-col>
      </b-row>
    </b-list-group-item>
    <b-list-group-item>
      <b-row>
        <b-col cols="3" class="text-right heading">TrakCare number:</b-col>
        <b-col cols="9" class="text-left">{{ patient.TrakCareNumber }}</b-col>
      </b-row>
    </b-list-group-item>
    <b-list-group-item>
      <b-row>
        <b-col cols="3" class="text-right heading">Key worker:</b-col>
        <b-col cols="9" class="text-left">{{ patient.KeyWorker }}</b-col>
      </b-row>
    </b-list-group-item>
    <b-list-group-item>
      <b-row>
        <b-col cols="3" class="text-right heading">Referral date:</b-col>
        <b-col cols="9" class="text-left">{{ formattedReferralDate }}</b-col>
      </b-row>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { dateService } from '../_services'

export default {
  name: 'PatientDetails',
  props: {
    patient: Object
  },
  computed: {
    formattedReferralDate() {
      return dateService.formatDate(this.patient.ReferralDate)
    },
    formattedDateOfBirth() {
      return dateService.formatDate(this.patient.DateOfBirth)
    }
  }
}
</script>

<style scoped lang="scss">
.heading {
  font-weight: bold;
}
</style>

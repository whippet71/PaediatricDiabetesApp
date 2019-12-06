<template>
  <b-table-simple hover caption-top responsive>
    <b-thead head-variant="dark">
      <b-tr>
        <b-th>Date</b-th>
        <b-th>Type</b-th>
        <b-th>Activity</b-th>
        <b-th>Location</b-th>
        <b-th>Staff member</b-th>
        <b-th>Hours</b-th>
        <b-th># contacts</b-th>
        <b-th></b-th>
      </b-tr>
    </b-thead>
    <b-tbody>
      <b-tr
        v-for="(contact,index) in contacts"
        v-bind:item="contact"
        v-bind:index="index"
        v-bind:key="contact.Id"
      >
        <b-td>{{formatDate(contact.ContactDate)}}</b-td>
        <b-td>{{getContactType(contact.ContactTypeId)}}</b-td>
        <b-td>{{getActivityType(contact.ActivityId)}}</b-td>
        <b-td>{{getLocation(contact.LocationId)}}</b-td>
        <b-td>{{getStaffMember(contact.StaffId)}}</b-td>
        <b-td>{{contact.Time}}</b-td>
        <b-td>{{contact.NumberOfContacts}}</b-td>
        <b-td v-show="online">
          <b-button variant="primary" @click="$emit('edit', contact.Id)">Edit</b-button>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import { dateService } from '../_services'

export default {
  name: 'ContactList',
  props: {
    contacts: Array,
    contactTypes: Array,
    activityTypes: Array,
    locations: Array,
    staff: Array,
    online: Boolean
  },
  methods: {
    formatDate(date) {
      return dateService.formatDate(date)
    },
    getContactType(contactTypeId) {
      let contactType = this.contactTypes.find(at => at.value === contactTypeId)
      return contactType ? contactType.text : '?'
    },
    getActivityType(activityTypeId) {
      let activityType = this.activityTypes.find(at => at.value === activityTypeId)
      return activityType ? activityType.text : '?'
    },
    getLocation(locationId) {
      let location = this.locations.find(at => at.value === locationId)
      return location ? location.text : '?'
    },
    getStaffMember(staffId) {
      let staffMember = this.staff.find(at => at.value === staffId)
      return staffMember ? staffMember.text : '?'
    }
  }
}
</script>

<style scoped lang="scss">
.heading {
  font-weight: bold;
}
</style>

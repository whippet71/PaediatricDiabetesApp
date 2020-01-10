<template>
  <b-list-group>
    <b-list-group-item v-for="error in errors" v-bind:key="error.index">
      {{error.date}} {{error.error}}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'errors',
  computed: {
    errors() {
      return this.$store.state.errorList
    }
  }
}
</script>

<template>
  <div>
    <b-jumbotron header="" lead="Paediatric Diabetes Application">
      <p>For more information contact john.morgan@ydh.nhs.uk or the Solutions Development team</p>
      <router-link tag='div' to ='/errorList'>
        <b-button variant="outline-secondary">View Errors</b-button>
      </router-link>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: 'about'
}
</script>

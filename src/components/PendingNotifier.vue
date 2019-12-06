<template>
    <div v-if="uploadPending" class="pending-changes">
        <div class="pending-changes-content">Uploads pending</div>
    </div>
</template>

<script>
import store from '../store'

export default {
  name: 'PendingNotifier',
  computed: {
    uploadPending() {
      return this.$store.state.uploadPending
    }
  }
}
</script>

<style>
.pending-changes {
  position: fixed;
  background: white;
  z-index: 2000;
  display: block;
  -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 4px 4px 0 0;
  -moz-border-radius: 4px 4px 0 0;
  -ms-border-radius: 4px 4px 0 0;
  -o-border-radius: 4px 4px 0 0;
  border-radius: 4px 4px 0 0;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 300;
  padding: 1em;
  background: black;
  color: #cccccc;
  bottom: 0;
  right: 20px;
}

.pending-changes-content {
  padding-left: 1.5em;
}

.pending-changes-content:after {
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  -o-border-radius: 50%;
  border-radius: 50%;
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1em;
  margin: auto;
  height: 0.8em;
  width: 0.8em;
  background: #e3704a;
}
</style>

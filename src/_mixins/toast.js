export default {
  methods: {
    showToast(message, variant) {
      if (!variant) {
        variant = 'success'
      }
      this.$bvToast.toast(message, {
        variant: variant,
        toaster: 'b-toaster-bottom-center',
        autoHideDelay: 8000
      })
    }
  }
}

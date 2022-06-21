export default {
  methods: {
    clickBtnPermission(str) {
      const roles = this.$store.getters.roles
      // console.log(roles)
      if (roles) {
        return roles.points.includes(str)
      } else {
        return false
      }
    }
  }
}

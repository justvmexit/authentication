<template>
    <center>
        <h1> Welcome back, {{ this.$store.state.user.username }}  </h1>
    </center>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
     
    }
  },
  async mounted() {
    this.$store.commit('science');

    if(this.$store.state.loggedIn != true)
    {
      this.$router.push('/login');
    }
  }
}
</script>
<template>
    <center>
        <h1> Welcome back, {{ this.$store.state.user.username }}  </h1>
        <p> 
          Enjoying this free authentication system? <br>
          <a class="github-button" href="https://github.com/justvmexit/authentication" data-icon="octicon-star" aria-label="Star justvmexit/authentication on GitHub">Star</a>
        </p>
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
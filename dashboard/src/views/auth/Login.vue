<template>
  <center style="display: inline-block;">
    <div class="container">
      <h2> Login now! </h2>
      <input type="text" autocomplete="" class="input item" v-model="username" placeholder="Enter your username"/>
      <input type="password" autocomplete="" class="input item" v-model="password" placeholder="Enter your password"/>
      <button class="btn primary full" v-if="formValid" @click="login">Login</button>
      <button class="btn danger full" v-else @click="login">Login</button>
      <p> Are you a new user?<br> <router-link to="register">Create an account now</router-link> </p>
    </div>
  </center>
</template>

<script>
import auth from '@/services/auth'

export default {
  name: 'Login',
  data() {
    return {
      username: "",
      password: ""
    }
  },
  computed: {
    formValid() {
      return this.username.length >= 1 && this.password.length >= 1;
    }
  },
  mounted() {
    if(this.$store.state.loggedIn == true)
    {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    async login() {
      var status = await auth.login(this, {username: this.username, password: this.password});
      if(status == true)
      {
        this.$router.push('/dashboard');
      }
    }
  }
}
</script>

<style scoped>

  .container {
    padding: 10px;
    width: 330px;
    height: 305px;
    border-radius: 8px;
    background-color: #0a0f17;
    position: relative;
    align-self: center;
    align-items: center;
  }

  .full {
    padding: 15px;
    width: 100%;
    border: 0;
  }

  input {
    margin-bottom: 10px;
  }
</style>
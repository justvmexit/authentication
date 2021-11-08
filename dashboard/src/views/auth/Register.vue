<template>
<center style="display: inline-block;">
    <div class="container">
      <h2> Register now!</h2>
      <input type="text" autocomplete="" class="input item" v-model="username" placeholder="Pick a username"/>
      <input type="password" autocomplete="" class="input item" v-model="password" placeholder="Enter your password"/>
      <button class="btn primary full" v-if="formValid" @click="register">Register</button>
      <button class="btn danger full" v-else @click="register">Register</button>
      <p> Do you already have an account?<br> <router-link to="login">Login now</router-link> </p>
    </div>
  </center>
</template>

<script>
import auth from '@/services/auth'

export default {
    name: 'Register',
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
      async register() {
        var status = await auth.register(this, {username: this.username, password: this.password});
        if(status == true)
        {
          status = await auth.login(this, {username: this.username, password: this.password});
          if(status == true)
          {
            this.$router.push('/dashboard');
          }
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
<template>
    <center>
        <h1> Change your password </h1>
        <center>
            <div class="form">
                <input class="input" type="password" placeholder="Old password" v-model="this.old_password"/>
                <input class="input" type="password" placeholder="New password" v-model="this.new_password"/>
                <input class="input" type="password" placeholder="Confirm new password" v-model="this.new_confirm"/>
                <button v-if="isValid" @click="changePassword" class="btn primary">Change password</button>
                <button v-else class="btn danger">Change password</button>
            </div>
        </center>
    </center>
</template>

<script>
import auth from '@/services/auth'

export default {
  name: 'Settings',
  data() {
    return {
      new_password: "",
      new_confirm: "",
      old_password: ""
    }
  },
  computed: {
    isValid() {
        return this.new_password.length >= 1 && this.new_confirm.length >= 1 && this.old_password.length >= 1 && this.new_confirm == this.new_password;
    }
  },
  async mounted() {
    this.$store.commit('science');

    if(this.$store.state.loggedIn != true)
    {
      this.$router.push('/login');
    }
  },
  methods: {
    async changePassword() {
        await auth.changePassword(this, this.old_password, this.new_password);
    }
  }
}
</script>

<style scoped>
  button {
    padding: 15px;
    border-radius: 8px;
    font-size: 14px;
    border: 0;
    width: 75%;
    display: block;
  }

  input {
      margin-bottom: 10px;
  }

  .form {
    padding: 10px;
    width: 330px;
    height: 255px;
    border-radius: 8px;
    background-color: #0a0f17;
    display: block;
  }
</style>
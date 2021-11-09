<template>
    <center>
        <h1> View your apps  </h1>
        <AppForm/>
        <table>
            <tr>
                <th> Name </th>
                <th> Status </th>
                <th> Version </th>
                <th> Action </th>
            </tr>
            <tr v-for="app in this.apps" :key="app.id">
                <td> {{ app.name }} </td>
                <td> <Status :status="app.status"/> </td>
                <td> {{ app.version }} </td>
                <td> <router-link class="btn primary" :to="{ name: 'ViewApp', params: {id: app.id}}"> Manage </router-link> </td>
            </tr>
        </table>
    </center>
</template>

<script>
import Status from '@/components/Status.vue'
import AppForm from '@/components/AppForm.vue'
import apps from '@/services/apps'

export default {
  name: 'Apps',
  components: {
    Status,
    AppForm
  },
  data() {
    return {
      apps: []
    }
  },
  async mounted() {
    this.$store.commit('science');
    this.apps = await apps.getApps(this);

    if(this.$store.state.loggedIn != true)
    {
      this.$router.push('/login');
    }
  }
}
</script>

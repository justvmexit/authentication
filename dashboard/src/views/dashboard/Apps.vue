<template>
    <center>
        <h1> View your apps  </h1>
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
import apps from '@/services/apps'

export default {
  name: 'Apps',
  components: {
    Status
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

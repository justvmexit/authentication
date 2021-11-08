<template>
    <div>
        <h1> {{ this.app.name }} </h1>

        <div class="navbar">
          <button class="btn primary" @click="this.tab = 0">Licenses</button>
          <button class="btn primary" @click="this.tab = 1">Streaming</button>
          <button class="btn primary" @click="this.tab = 2">Variables</button>
          <button class="btn primary" @click="this.tab = 3">Status</button>
        </div>
        <div v-if="this.tab == 0">
          <center>
            <LicenseForm :app="this.app"/>
            <div class="card">
                <input class="input borderless" style="margin-bottom: 30px;" type="text" placeholder="Search for..." v-model="this.lsearch"/>
            </div>
            <table>
              <tr>
                <th> License </th>
                <th> Expiry </th>
                <th> Duration </th>
                <th> HWID </th>
                <th> Action </th>
              </tr>
              <tr v-for="license in this.licenses" :key="license.id">
                <td> {{ license.license }} </td>
                <td v-if="license.expiry"> {{ license.expiry }} </td>
                <td v-else> Not set </td>
                <td> {{ license.duration }} </td>
                <td> <button @click="resetHWID(license.id)" class="btn danger"> Reset </button> </td>
                <td> <button @click="deleteLicense(license.id)" class="btn danger"> Delete </button> </td>
              </tr>
            </table>
          </center>
        </div>
        <div v-if="this.tab == 1">
          <h2> Streaming </h2>
        </div>
        <div v-if="this.tab == 2">
          <center>
            <VariableForm :app="this.app"/>
            <table>
              <tr>
                <th> Name </th>
                <th> Content </th>
                <th> Created on </th>
                <th> Action </th>
              </tr>
              <tr v-for="variable in this.variables" :key="variable.id">
                <td> {{ variable.name }} </td>
                <td> {{ variable.content }} </td>
                <td> {{ variable.created_on }} </td>
                <td> <button @click="deleteVariable(variable.id)" class="btn danger"> Delete </button> </td>
              </tr>
            </table>
          </center>
        </div>
        <div v-if="this.tab == 3">
          <h2> Manage status </h2>

          <center>
            <StatusForm :app="this.app"/>
          </center>

        </div>
    </div>
</template>

<script>
import apps from '@/services/apps'
import StatusForm from '@/components/StatusForm'
import VariableForm from '@/components/VariableForm'
import LicenseForm from '@/components/LicenseForm'

export default {
  name: 'ViewApp',
  components: {
    StatusForm,
    VariableForm,
    LicenseForm
  },
  data() {
    return {
      app: {},
      variables: [],
      licenses: [],
      tab: 0,
      lsearch: "",
      vsearch: ""
    }
  },
  watch: {
    lsearch: async function() {
      this.licenses = await apps.searchLicenses(this, this.$route.params.id, this.lsearch);
    }
  },
  async mounted() {
    this.$store.commit('science');
    this.app = await apps.getApp(this, this.$route.params.id);
    this.variables = await apps.getVariables(this, this.$route.params.id);
    this.licenses = await apps.getLicenses(this, this.$route.params.id);

    setInterval(async function() {
      this.app = await apps.getApp(this, this.$route.params.id);
      this.variables = await apps.getVariables(this, this.$route.params.id);
    }.bind(this), 10000);

    setInterval(async function() {
      this.licenses = await apps.getLicenses(this, this.$route.params.id);
    }.bind(this), 5000);

    if(this.$store.state.loggedIn != true)
    {
      this.$router.push('/login');
    }
  },
  methods: {
    async deleteVariable(id) {
      await apps.deleteVariable(this, this.app.id, id);
      this.variables = await apps.getVariables(this, this.$route.params.id);
    },
    async deleteLicense(id) {
      await apps.deleteLicense(this, this.app.id, id);
      this.licenses = await apps.getLicenses(this, this.$route.params.id);
    },
    async resetHWID(id) {
      await apps.resetHWID(this, this.app.id, id);
      this.licenses = await apps.getLicenses(this, this.$route.params.id);
    }
  }
}
</script>

<style scoped>

  .navbar {
    height: 100px;
    width: 100%;
    overflow-x: hidden;
    padding-top: 20px;
  }
  
  .navbar button {
    padding: 20px;
    font-size: 16px;
    border: 0;
    display: inline-block;
    margin-left: 15px;
    width: 130px;
  }
  
  .card {
    padding: 20px;
    width: 300px;
    height: 75px;
    border-radius: 8px;
    -webkit-box-shadow: -1px 3px 49px -5px rgba(0,0,0,0.75);
    -moz-box-shadow: -1px 3px 49px -5px rgba(0,0,0,0.75);
    box-shadow: -1px 3px 49px -5px rgba(0,0,0,0.75);
    display: inline;
  }
  
  button {
    padding: 15px;
    border-radius: 8px;
    font-size: 14px;
  }
  
</style>
<template>
  <div>
    <h3> authentication </h3>
    <div class="nav_items">
      <router-link class="nav_item" v-if="this.$store.state.loggedIn == true" to="/dashboard"> Home </router-link>
      <router-link class="nav_item" v-else to="/"> Home </router-link>
      <router-link class="nav_item" v-if="this.$store.state.loggedIn == true" to="/dashboard/apps"> Apps </router-link>
      <router-link class="nav_item" v-if="this.$store.state.loggedIn == true" to="/dashboard/settings"> Settings </router-link>
      <router-link class="nav_item btn" v-if="this.$store.state.loggedIn == true" to="/dashboard/logout"> Logout </router-link>
      <router-link class="nav_item btn" v-else to="/login"> Login </router-link>
    </div>
    <div class="page">
      <router-view/>
    </div>
  </div>
</template>

<style>

body {
  background-color: #06070a;
  color: white;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.input {
  background-color: #0d0e12;
  border-radius: 8px;
  padding: 20px;
  color: white;
  font-family: 'Inter', sans-serif;
  border: 0;
}

.btn {
  background-color: #1163e6;
  border-radius: 8px;
  padding: 5px;
  color: white;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
}

.important {
  color: #1163e6;
}

a {
  text-decoration: none;
  color: #1163e6;
}

.page {
  justify-items: center;
  justify-content: center;
  text-align: center;  
}

.success {
  background-color: #10c6a3;
  color: white;
  border: 0;
}

.danger {
  background-color: #d93952;
  color: white;
  border: 0;
}

.wrong_input {
  border: 1px solid #d93952;
}

table {
  font-weight: lighter;
  background-color: #0d0e12;
  border-radius: 8px;
  padding: 5px;
  width: 360px;
}

th {
  border: 0;
  padding: 10px;
  text-align: left;
  font-weight:normal;
}

td {
  padding: 10px;
  text-align: left;
  font-weight:normal;
}

.nav_bar { 
  float: left;
  width: 100%;
  padding-top: 2px;
  margin: 0;
  z-index: 999;
}

.nav_items {
  justify-items: right;
  justify-content: right;
  text-align: right;
  margin-right: 30px;
}

.nav_item {
  padding: 20px;
  display: inline;
  text-decoration: none;
  color: white;
  margin-left: -5px;
}

html {
  scroll-behavior: smooth;
}

</style>
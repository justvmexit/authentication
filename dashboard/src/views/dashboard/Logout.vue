<template>
    <h1> We are logging you out.. </h1>
</template>

<script>
    export default {
        name: 'Logout',
        mounted() {
            this.$store.commit('logout');
            
            if(this.$store.state.loggedIn == false)
            {
                this.$router.push('/login');
            }
        }
    }
</script>
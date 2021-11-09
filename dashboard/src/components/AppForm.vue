<template>
    <div class="form">
        <h4> Create app </h4>
        <input class="input" placeholder="Name your app" v-model="name"/>
        <button @click="update" class="btn primary">Create</button> 
    </div>
</template>

<script>
import apps from '@/services/apps'

export default {
    name: 'AppForm',
    data() {
        return {
            name: ""
        }
    },
    methods: {
        async update() {
            const app = await apps.createApp(this, this.name);
            if(app != false)
            {
                this.$router.push({name: 'ViewApp', params: {id: app}});
            }
            else
            {
                this.$toast.error('Failed to create app');
            }
        }
    }
}
</script>

<style scoped>
    .form {
        padding: 10px;
        width: 330px;
        height: 190px;
        border-radius: 8px;
        background-color: #0a0f17;
        display: block;
        margin-bottom: 50px;
    }

    input {
        margin-bottom: 15px;
    }

    button {
        padding: 16px;
        font-size: 16px;
        border: 0;
        width: 100%;
    }
</style>
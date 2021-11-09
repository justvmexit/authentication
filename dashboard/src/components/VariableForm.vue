<template>
    <div class="variableform">
        <h4> Create variable </h4>
        <input class="input" placeholder="Name of variable" v-model="this.name"/>
        <input class="input" placeholder="Content of variable" v-model="this.content"/>
        <button @click="create" class="btn primary">Create</button> 
    </div>
</template>

<script>
import apps from '@/services/apps'

export default {
    name: 'VariableForm',
    props: {
        app: Object
    },
    data() {
        return {
            name: "",
            content: ""
        }
    },
    methods: {
        async create() {
            await apps.newVariables(this, this.app.id, this.name, this.content);
        }
    }
}
</script>

<style scoped>
    .variableform {
        padding: 10px;
        width: 330px;
        height: 265px;
        border-radius: 8px;
        background-color: #0a0f17;
        display: block;
        margin-bottom: 50px;
    }

    input {
        width: 280px;
        margin-bottom: 15px;
    }

    button {
        padding: 16px;
        font-size: 16px;
        border: 0;
        width: 100%;
    }
</style>
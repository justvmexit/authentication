<template>
    <div>
        <div class="modal" v-if="isModalShown" id="modal">
            <p v-for="license in this.licenses" :key="license">
                <span @click="copy(license)"> {{ license }} </span>
            </p>
            <button @click="isModalShown = false" class="btn danger">Close</button>
        </div>
        <div class="form">
            <h4> Generate license </h4>
            <input class="input" type="number" placeholder="Amount of licenses" v-model="this.quantity"/>
            <input class="input" type="number" placeholder="Duration of licenses (days)" v-model="this.duration"/>
            <button v-if="isValid" @click="generate" class="btn primary">Generate</button> 
            <button v-else class="btn danger">Generate</button> 
        </div>
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
            quantity: "",
            duration: "",
            licenses: [],
            isModalShown: false
        }
    },
    computed: {
        isValid() {
            return parseInt(this.quantity) >= 1 && parseInt(this.duration) >= 1;
        }
    },
    methods: {
        copy(license) {
            navigator.clipboard.writeText(license);
            this.$toast.success("Copied license to clipboard");
        },
        async generate() {
            this.licenses = await apps.generateLicenses(this, this.app.id, parseInt(this.duration), parseInt(this.quantity));

            this.isModalShown = true;
        }
    }
}
</script>

<style scoped>
    .form {
        padding: 10px;
        width: 330px;
        height: 265px;
        border-radius: 8px;
        background-color: #0a0f17;
        display: block;
        margin-bottom: 50px;
    }

    .modal {
        padding: 10px;
        width: 330px;
        border-radius: 8px;
        background-color: #0a0f17;
        display: block;
        margin-bottom: 50px;
    }

    input {
        width: 280px;
        margin-bottom: 15px;
    }

    .modal button {
        font-size: 14px;
        padding: 10px;
    }

    button {
        padding: 16px;
        font-size: 16px;
        border: 0;
        width: 100%;
    }
</style>
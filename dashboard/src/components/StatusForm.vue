<template>
    <div class="form">
        <div v-if="this.gstatus == 0" class="status success">
            <p> Undetected </p>
        </div>
        <div v-else class="status danger">
            <p> Detected </p>
        </div>

        <h4> Update status </h4>
        <select v-model="status" class="input">
            <option value="0"> Undetected </option>
            <option value="1"> Detected </option>
        </select>
        <button @click="update" class="btn primary">Update</button> 
    </div>
</template>

<script>
import apps from '@/services/apps'

export default {
    name: 'StatusForm',
    props: {
        app: Object
    },
    data() {
        return {
            status: 0,
            gstatus: 0
        }
    },
    mounted() {
        this.gstatus = this.app.status;
    },
    methods: {
        async update() {
            await apps.updateStatus(this, this.app.id, this.status);
            this.gstatus = this.status;
        }
    }
}
</script>

<style scoped>
    .status {
        border-radius: 8px;
        padding-bottom: 0px;
        padding-right: 10px;
        padding-left: 10px;
        width: 100px;
    }

    .form {
        padding: 10px;
        width: 330px;
        height: 225px;
        border-radius: 8px;
        background-color: #0a0f17;
        display: block;
    }

    input, button {
        width: 100%;
    }

    select {
        margin-bottom: 15px;
    }

    button {
        padding: 16px;
        font-size: 16px;
        border: 0;
    }
</style>
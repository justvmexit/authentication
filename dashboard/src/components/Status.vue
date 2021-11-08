<template>
    <div v-if="status == 0" class="success">
        <p> Undetected </p>
    </div>
    <div v-else class="danger">
        <p> Detected </p>
    </div>
</template>

<script>
export default {
    name: 'Status',
    props: {
        status: Number
    }
}
</script>

<style scoped>
    div {
        border-radius: 8px;
        padding-bottom: 0px;
        padding-right: 10px;
        padding-left: 10px;
    }
</style>
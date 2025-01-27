<template>
    <div>
    <Header />
        <h1>Aula {{ aulaId }}</h1>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from '~/components/header.vue';

const route = useRoute();
const aulaId = route.params.id;
</script>

<style scoped>
.aula-detail {
    padding: 20px;
    text-align: center;
}
</style>

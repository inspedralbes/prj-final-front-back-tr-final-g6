<template>
    <div>
        <Header />
        <LineChart />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from '~/components/header.vue';
import LineChart from '~/components/Charts.vue';
</script>

<style scoped></style>
<template>
  <div class="app-container">
    <NuxtPage />
    <Footer v-if="!isLoginPage" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>

<template>
    <div>
        <h1>Bienvenido a mi proyecto de Nuxt</h1>
        <p>Esta es la página de inicio.</p>
        <Button label="Iniciar Sessió" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import 'tailwindcss/tailwind.css'
import Button from 'primevue/button';
</script>

<style scoped>
h1 {
    color: #42b983;
}
</style>
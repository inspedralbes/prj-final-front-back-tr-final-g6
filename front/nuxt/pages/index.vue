<template>
    <div class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center justify-center animated-bg">
        <div class="text-center text-white px-6">
            <h1 class="text-5xl font-extrabold mb-4">
                Bienvenido a mi proyecto de Nuxt
            </h1>
            <p class="text-lg mb-6">
                Este es un proyecto desarrollado con Nuxt, TailwindCSS y PrimeVue. ¡Explora las funcionalidades!
            </p>
            <nuxt-link to="/login">
                <Button label="Inicia Sessió" icon="pi pi-user" class="bg-indigo-800 text-white font-bold py-2 px-4 rounded border border-black" />
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
import 'tailwindcss/tailwind.css'
import Button from 'primevue/button';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
</script>

<style scoped>
.animated-bg {
    background-size: 200% 200%;
    animation: move-bg 6s ease infinite;
}

@keyframes move-bg {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
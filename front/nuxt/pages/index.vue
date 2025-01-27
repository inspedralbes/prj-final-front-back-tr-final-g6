<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center justify-center animated-bg">
        <div class="text-center text-white px-6">
            <h1 class="text-6xl font-extrabold mb-4">
                Bienvenido a mi proyecto de Nuxt
            </h1>
            <p class="text-xl mb-6">
                Este es un proyecto desarrollado con Nuxt, TailwindCSS y PrimeVue. ¡Explora las funcionalidades!
            </p>
            <nuxt-link to="/login" class="button-container">
                <Button label="Inicia Sesión" icon="pi pi-user"
                    class="bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg border border-transparent transition-transform duration-300 custom-button" />
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
import 'tailwindcss/tailwind.css';
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

.custom-button:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}
</style>
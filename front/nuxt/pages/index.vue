<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center justify-center animated-bg">
        <div class="text-center text-white px-6 space-y-8">
            <h1 class="text-6xl font-extrabold mb-4 drop-shadow-lg">
                ACOUBOX
            </h1>
            <div class="w-24 h-1 bg-gradient-to-r from-white to-transparent mx-auto"></div>
            <p class="text-xl leading-relaxed max-w-2xl mx-auto">
                ¡Bienvenidos a ACOUBOX! 🌟  
                <br />
                Un proyecto de estudiantes de <strong>CFGS DAM</strong> y <strong>PFI</strong>, donde combinamos creatividad y aprendizaje para dar vida a algo único.
            </p>
            <div class="mt-6">
                <nuxt-link to="/login" aria-label="Ir a la página de inicio de sesión" class="button-container">
                    <Button
                        label="Inicia Sesión"
                        icon="pi pi-user"
                        class="bg-white text-black font-bold py-3 px-8 rounded-full shadow-lg border border-transparent transition-all duration-300 custom-button"
                    />
                </nuxt-link>
            </div>
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
/* Fondo animado */
.animated-bg {
    background-size: 200% 200%;
    animation: move-bg 6s ease-in-out infinite;
}

/* Animación de fondo */
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
    transform: scale(1.1);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
}

.custom-button:focus {
    outline: 3px solid #07C8F9;
    outline-offset: 2px;
}

/* Separador con animacin linear */
div.w-24.h-1 {
    animation: pulse-separator 2s infinite ease-in-out;
}

@keyframes pulse-separator {
    0%, 100% {
        opacity: 0.7;
        transform: scaleX(1);
    }
    50% {
        opacity: 1;
        transform: scaleX(1.2);
    }
}
</style>

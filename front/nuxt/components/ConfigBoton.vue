<template>
    <div class="mt-6">
        <nuxt-link to="/configuracion" aria-label="Ir a la configuración" class="button-container">
            <Button
                label="Configuración"
                icon="pi pi-cog"
                class="bg-white text-black font-bold py-3 px-8 rounded-full shadow-lg border border-transparent transition-all duration-300 custom-button"
            />
        </nuxt-link>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
</script>

<style scoped>
/* Botón personalizado */
.custom-button:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
}

.custom-button:focus {
    outline: 3px solid #07C8F9;
    outline-offset: 2px;
}
</style>

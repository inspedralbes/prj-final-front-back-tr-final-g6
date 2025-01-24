<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex items-start justify-center animated-bg">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            <NuxtLink v-for="aula in aulas" :key="aula.id" :to="`/aulas/${aula.id}`" class="card-container">
                <Card>
                    <template #header>
                        <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
                    </template>
                    <template #title>
                        <div class="text-center text-2xl font-bold text-gray-900 dark:text-white">
                            Aula: {{ aula.Curs }} - {{ aula.Classe }}
                        </div>
                    </template>
                    <template #subtitle>
                        <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            Etapa: {{ aula.Etapa }}
                        </div>
                    </template>
                    <template #content>
                        <p class="text-gray-900 dark:text-white text-center mt-4">
                            Información de la aula cargada exitosamente.
                        </p>
                    </template>
                </Card>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import { getAulas } from '~/utils/communicationManager';

const aulas = ref([]);

onMounted(async () => {
    try {
        aulas.value = await getAulas();
    } catch (error) {
        console.error('Error al cargar las aulas:', error.message);
    }
});
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

.card-container {
    border: 1px solid black;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

.card-container:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}
</style>

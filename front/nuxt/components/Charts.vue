<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex items-start justify-center mt-0 animated-bg">
        <div class="p-6 w-full max-w-4xl flex flex-col items-center flex-grow">

            <div v-if="aula" class="w-full p-6 mb-6">
                <div class="flex items-center justify-center space-x-8 text-lg text-white">
                    <p><strong>Clase:</strong> {{ aula.Classe || 'Sin clase' }}</p>
                    <p><strong>Etapa:</strong> {{ aula.Etapa }}</p>
                    <p><strong>Planta:</strong> {{ aula.Planta }}</p>
                    <p><strong>Aula:</strong> {{ aula.Aula }}</p>
                </div>
            </div>


            <div class="w-full mb-6 flex justify-center gap-4 items-center">
                <div class="flex gap-4">
                    <Button v-for="item in items" :key="item.label" :label="item.label" :icon="item.icon"
                        @click="selectedChart = item.label"
                        class="p-button p-button-rounded p-button-outlined bg-indigo-600 text-white font-bold uppercase py-3 px-6 focus:outline-none hover:scale-105 hover:shadow-lg transition-all duration-300" />
                </div>

                <Dropdown v-model="selectedRange" :options="ranges" optionLabel="label" optionValue="value"
                    class="w-40 bg-white rounded-md shadow-md p-2" placeholder="Selecciona el Rango"
                    style="background-color: #f0f4f8; border-radius: 8px; padding: 8px;" />
            </div>

            <div class="w-full bg-white p-6 rounded-lg shadow-lg">
                <div class="h-[400px]">
                    <component :is="currentChart" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

import TemperatureChart from './charts/TemperatureChart.vue';
import Co2Chart from './charts/Co2Chart.vue';
import VolumeChart from './charts/VolumeChart.vue';
import { getAulaById } from '~/utils/communicationManager';

const route = useRoute();
const aulaId = route.params.id;
const aula = ref(null);

const items = [
    { label: 'Temperatura', icon: 'pi pi-home', component: TemperatureChart },
    { label: 'Co2', icon: 'pi pi-chart-line', component: Co2Chart },
    { label: 'Volum', icon: 'pi pi-list', component: VolumeChart },
];

const ranges = [
    { label: 'Actual', value: 'actual' },
    { label: 'Diario', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Curso', value: 'course' },
];

const selectedChart = ref('Temperatura');
const selectedRange = ref('actual');

const currentChart = computed(() => {
    const item = items.find((i) => i.label === selectedChart.value);
    return item ? item.component : null;
});

onMounted(async () => {
    try {
        aula.value = await getAulaById(aulaId);
        if (!aula.value) {
            console.log('No se encontraron datos para el aula');
        }
    } catch (error) {
        console.error('Error al obtener el aula:', error);
    }
});
</script>

<style scoped>
button {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

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

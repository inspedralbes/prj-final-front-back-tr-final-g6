<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex items-start justify-center animate-gradient mt-0">
        <div class="p-6 w-full max-w-4xl flex flex-col items-center flex-grow">
            <h1 class="text-2xl text-center text-white mb-6">Aula {{ aulaId }}</h1>

            <div class="w-full mb-6 flex justify-center gap-4">
                <Button v-for="item in items" :key="item.label" :label="item.label" :icon="item.icon"
                    @click="selectedChart = item.label"
                    class="p-button p-button-rounded p-button-outlined bg-emerald-800 text-white font-bold uppercase tracking-wider py-3 px-6 transform transition-all duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-xl focus:outline-none" />
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
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';

import TemperatureChart from './charts/TemperatureChart.vue';
import Co2Chart from './charts/Co2Chart.vue';
import VolumeChart from './charts/VolumeChart.vue';

const route = useRoute();
const aulaId = route.params.id;

const items = [
    { label: 'Temperatura', icon: 'pi pi-home', component: TemperatureChart },
    { label: 'Co2', icon: 'pi pi-chart-line', component: Co2Chart },
    { label: 'Volum', icon: 'pi pi-list', component: VolumeChart },
];

const selectedChart = ref('Temperatura');
const currentChart = computed(() => {
    const item = items.find((i) => i.label === selectedChart.value);
    return item ? item.component : null;
});
</script>

<style>
@keyframes animate-gradient {
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

.animate-gradient {
    background-size: 200% 200%;
    animation: animate-gradient 6s ease infinite;
}
</style>

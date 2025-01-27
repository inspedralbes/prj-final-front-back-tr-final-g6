<template>
    <div class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex items-start justify-center animate-gradient mt-0">
        <div class="p-6 w-full max-w-4xl flex flex-col items-center flex-grow">
            <h1 class="text-2xl text-center text-white mb-6">Aula {{ aulaId }}</h1>

            <div class="w-full mb-6 flex justify-center gap-4">
                <Button v-for="item in items" :key="item.label" :label="item.label" :icon="item.icon"
                        @click="changeChartData(item.label)"
                        class="p-button p-button-rounded p-button-outlined bg-emerald-800 text-white font-bold uppercase tracking-wider py-3 px-6 transform transition-all duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-xl focus:outline-none">
                </Button>
            </div>

            <div class="w-full bg-white p-6 rounded-lg shadow-lg">
                <div class="h-[400px]">
                    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import Button from 'primevue/button';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const route = useRoute();
const aulaId = route.params.id;

const items = ref([
    { label: 'Temperatura', icon: 'pi pi-home' },
    { label: 'Co2', icon: 'pi pi-chart-line' },
    { label: 'Volum', icon: 'pi pi-list' },
]);

const chartData = ref({
    labels: ['January', 'February', 'March'],
    datasets: [
        {
            label: 'Graus Celsius',
            data: [14, -4, 22],
            borderColor: '#0A85ED',
            fill: false,
            tension: 0.4
        }
    ]
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Temperatura'
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    return `Value: ${tooltipItem.raw}`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Mesos'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Graus'
            },
            min: -10
        }
    }
});

const changeChartData = (label) => {
    if (label === 'Temperatura') {
        chartData.value = {
            labels: ['January', 'February', 'March'],
            datasets: [
                {
                    label: 'Graus Celsius',
                    data: [14, -4, 22],
                    borderColor: '#0A85ED',
                    fill: false,
                    tension: 0.4
                }
            ]
        };
        chartOptions.value.plugins.title.text = 'Temperatura';
        chartOptions.value.scales.y.title.text = 'Graus';
    } else if (label === 'Co2') {
        chartData.value = {
            labels: ['January', 'February', 'March'],
            datasets: [
                {
                    label: 'Nivell de CO2',
                    data: [420, 350, 380],
                    borderColor: '#FF5733',
                    fill: false,
                    tension: 0.4
                }
            ]
        };
        chartOptions.value.plugins.title.text = 'Nivell de CO2';
        chartOptions.value.scales.y.title.text = 'CO2 (ppm)';
    } else if (label === 'Volum') {
        chartData.value = {
            labels: ['January', 'February', 'March'],
            datasets: [
                {
                    label: 'Volum',
                    data: [30, 20, 50],
                    borderColor: '#0D41E1',
                    fill: false,
                    tension: 0.4
                }
            ]
        };
        chartOptions.value.plugins.title.text = 'Volum';
        chartOptions.value.scales.y.title.text = 'Volum (m³)';
    }
};
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

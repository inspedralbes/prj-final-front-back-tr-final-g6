<template>
    <Line :options="chartOptions" :data="formattedData" />
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

const formattedData = ref({
    labels: [],
    datasets: []
});

watch(props.data, (newData) => {
    if (newData && newData.length > 0) {
        formattedData.value = {
            labels: newData.map(item => new Date(item.dataIni).toLocaleDateString()), // Ajusta esto según la estructura de tus datos
            datasets: [
                {
                    label: "Nivell de CO2 (ppm)",
                    data: newData.map(item => item.average), // Ajusta esto según la estructura de tus datos
                    borderColor: '#FF5733',
                    fill: false,
                    tension: 0.3
                }
            ]
        };
    }
}, { immediate: true });

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Nivell de CO2 a l'Aula"
        }
    },
    scales: {
        x: {
            title: { 
                display: true, 
                text: 'Días',
                font: {
                    size: 14
                }
            }
        },
        y: {
            title: { 
                display: true, 
                text: 'CO2 (ppm)',
                font: {
                    size: 14
                }
            },
            min: 300,
            max: 500,
            ticks: {
                stepSize: 40,
                font: {
                    size: 12
                }
            }
        }
    }
};
</script>
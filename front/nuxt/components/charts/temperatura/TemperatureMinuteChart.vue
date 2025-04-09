<template>
    <Line :options="chartOptions" :data="formattedData" />
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

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
            labels: newData.map(item => new Date(item.timestamp).toLocaleTimeString()),
            datasets: [
                {
                    label: "Temperatura (°C)",
                    data: newData.map(item => item.temperature),
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 2,
                    fill: true
                }
            ]
        };
    }
}, { immediate: true });

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#E5E7EB'
            }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' },
            title: { display: true, text: 'Hora', color: '#9CA3AF' }
        },
        y: {
            ticks: { color: '#9CA3AF' },
            title: { display: true, text: 'Temperatura (°C)', color: '#9CA3AF' }
        }
    }
};
</script>

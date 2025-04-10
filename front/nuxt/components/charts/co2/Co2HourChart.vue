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
            labels: newData.map(item => new Date(item.timestamp).toLocaleTimeString()),
            datasets: [
                {
                    label: "Concentració CO₂ (ppm)",
                    data: newData.map(item => item.co2),
                    borderColor: '#10B981', // Teal
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5
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
        },
        tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#E5E7EB',
            bodyColor: '#E5E7EB',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            callbacks: {
                label: function (context) {
                    return ` ${context.dataset.label}: ${context.raw} ppm`;
                }
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
            title: { display: true, text: 'CO₂ (ppm)', color: '#9CA3AF' }
        }
    }
};
</script>

<style scoped>
</style>

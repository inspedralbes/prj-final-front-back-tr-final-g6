<template>
    <Line :options="chartOptions" :data="formattedData" />
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    valueKey: {
        type: String,
        default: 'temperature'
    },
    label: {
        type: String,
        default: 'Temperatura (°C)'
    },
    unit: {
        type: String,
        default: '°C'
    },
    color: {
        type: String,
        default: 'rgba(16, 185, 129, 1)' // verde esmeralda
    },
    bgColor: {
        type: String,
        default: 'rgba(16, 185, 129, 0.2)' // fondo verde suave
    }
});

const formattedData = ref({
    labels: [],
    datasets: []
});

watch(() => props.data, (newData) => {
    if (newData && newData.length > 0) {
        formattedData.value = {
            labels: newData.map(item => {
                // Formateamos la fecha para obtener el nombre del mes
                const date = new Date(item.timestamp);
                return date.toLocaleString('default', { month: 'long' }); // Ej. Enero, Febrero, etc.
            }),
            datasets: [
                {
                    label: props.label,
                    data: newData.map(item => item[props.valueKey]),
                    borderColor: props.color,
                    backgroundColor: props.bgColor,
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
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' },
            title: { 
                display: true, 
                text: 'Mes', 
                color: '#9CA3AF' 
            }
        },
        y: {
            ticks: { color: '#9CA3AF' },
            title: {
                display: true,
                text: props.label,
                color: '#9CA3AF'
            }
        }
    }
};
</script>

<style scoped>
</style>

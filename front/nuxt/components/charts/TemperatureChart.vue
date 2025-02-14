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
                    label: "Temperatura Estimada a l'Aula (°C)",
                    data: newData.map(item => item.average), // Ajusta esto según la estructura de tus datos
                    borderColor: '#1E90FF',
                    backgroundColor: 'rgba(30, 144, 255, 0.2)',
                    pointBackgroundColor: '#1E90FF',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    fill: true,
                    tension: 0.2
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
            text: "Temperatura Estimada a l'Aula (°C)",
            font: {
                size: 18
            }
        },
        tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                    return `Día: ${tooltipItem.label}, Temperatura: ${tooltipItem.raw}°C`;
                }
            }
        },
        legend: {
            labels: {
                font: {
                    size: 14
                }
            }
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
            },
            grid: {
                display: false
            }
        },
        y: {
            title: {
                display: true,
                text: 'Temperatura (°C)',
                font: {
                    size: 14
                }
            },
            min: 10,
            max: 35,
            ticks: {
                stepSize: 5,
                font: {
                    size: 12
                }
            },
        }
    }
};
</script>
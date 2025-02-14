<template>
    <Bar :options="chartOptions" :data="formattedData" />
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement, LineController, BarController } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement, LineController, BarController);

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
                    type: 'bar',
                    label: "Mínimo de Decibels (dB)",
                    data: newData.map(item => item.min), // Ajusta esto según la estructura de tus datos
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    stack: 'combined',
                    barThickness: 80
                },
                {
                    type: 'bar',
                    label: "Máximo de Decibels (dB)",
                    data: newData.map(item => item.max - item.min), // Ajusta esto según la estructura de tus datos
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    stack: 'combined',
                    barThickness: 80
                },
                {
                    type: 'line',
                    label: "Media de Decibels (dB)",
                    data: newData.map(item => item.average), // Ajusta esto según la estructura de tus datos
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
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
            text: "Máximo, Mínimo y Media de Decibels a l'Aula (dB)"
        },
        tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                    const dataset = tooltipItem.dataset;
                    const value = dataset.data[tooltipItem.dataIndex];
                    if (dataset.label === "Media de Decibels (dB)") {
                        return `Media: ${value} dB`;
                    } else if (dataset.label === "Máximo de Decibels (dB)") {
                        const min = tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex];
                        return `Máximo: ${value + min} dB`;
                    } else {
                        return `Mínimo: ${value} dB`;
                    }
                }
            }
        }
    },
    scales: {
        x: {
            stacked: true,
            title: { 
                display: true, 
                text: 'Días',
                font: {
                    size: 14
                }
            }
        },
        y: {
            stacked: true,
            title: { 
                display: true, 
                text: 'Decibels (dB)',
                font: {
                    size: 14
                }
            },
            min: 0,
            max: 100,
            ticks: {
                stepSize: 10,
                font: {
                    size: 12
                }
            }
        }
    }
};
</script>
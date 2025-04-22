<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative">
            <Bar :options="chartOptions" :data="formattedData" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const formattedData = ref({
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
        {
            label: 'Temperatura (°C)',
            data: [5, 25, 15, 35],
            backgroundColor: 'rgba(33, 150, 243, 0.8)',
            borderColor: '#2196F3',
            borderWidth: 1,
        },
    ],
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Cambia el eje para barras horizontales
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 14,
                },
                color: 'white',
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Temperatura (°C)',
                font: {
                    size: 14,
                },
                color: 'gray',
            },
            ticks: {
                font: {
                    size: 12,
                },
                color: 'gray',
                min: 0,  // Asegúrate de que el mínimo es 0
                max: 40, // El máximo es 40
                stepSize: 10, // El tamaño del paso es 10
            },
        },
        y: {
            title: {
                display: true,
                text: 'Semanas',
                font: {
                    size: 14,
                },
                color: 'gray',
            },
            ticks: {
                font: {
                    size: 12,
                },
                color: 'gray',
            },
        },
    },
});
</script>

<style scoped>
div.w-full.h-full {
    position: relative;
}
</style>
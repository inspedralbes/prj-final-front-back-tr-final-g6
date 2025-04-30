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
            label: 'Volumen (dB)',
            data: [5, 45, 23, 55],
            backgroundColor: 'rgba(76, 175, 80, 0.6)',
            borderColor: '#4CAF50',
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
                text: 'Volumen (dB)',
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
                max: 60, // El máximo es 60
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
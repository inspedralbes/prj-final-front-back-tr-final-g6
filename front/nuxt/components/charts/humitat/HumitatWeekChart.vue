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
            label: 'CO2 (ppm)',
            data: [500, 1000, 1500, 2000],
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.6)',
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
                text: 'CO2 (ppm)',
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
                max: 2000, // El máximo es 2000
                stepSize: 250, // El tamaño del paso es 500
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
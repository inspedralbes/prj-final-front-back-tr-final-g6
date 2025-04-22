<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative">
            <Bar :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = ref({
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
        {
            label: 'Volumen (dB)',
            data: [5, 45, 23, 55, 13, 33, 43, 55],
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            borderColor: '#4CAF50',
            borderWidth: 1,
        },
    ],
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
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
                text: 'Días de la semana',
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
        y: {
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
                min: 0,
                max: 60,
                stepSize: 10,
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
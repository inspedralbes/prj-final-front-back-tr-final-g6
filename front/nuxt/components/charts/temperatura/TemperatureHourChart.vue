<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const chartData = ref({
    labels: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
    ],
    datasets: [
        {
            label: 'Temperatura (°C)',
            data: [2, 22, 23, 22.5, 23.2, 24, 24.5, 25, 26, 26.5, 27, 27.3, 27.5, 28, 28.3, 28.7, 29, 29.5, 30, 30.5, 30.8, 31, 31.3, 37.5, 39], // Temperaturas para cada hora
            fill: false,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            pointBackgroundColor: '#2196F3',
            pointBorderColor: '#2196F3',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.1,
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
                text: 'Hores',
                font: {
                    size: 14,
                },
                color: 'gray',
            },
            ticks: {
                autoSkip: false, // Desactiva el auto-skip
                font: {
                    size: 12,
                },
                color: 'gray',
            },
        },
        y: {
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
                min: 0,
                max: 40, // Ajusta el rango de la temperatura según tus datos
                stepSize: 5,
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

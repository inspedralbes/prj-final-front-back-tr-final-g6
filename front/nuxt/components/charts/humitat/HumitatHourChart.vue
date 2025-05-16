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

const props = defineProps({
    idAula: {
        type: Number,
        required: true
    }
});

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const chartData = ref({
    labels: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
    ],
    datasets: [
        {
            label: 'CO2 (ppm)',
            data: [150, 420, 450, 480, 500, 520, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000, 1800], // Valores de CO2 para cada hora
            fill: false,
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.2)',
            pointBackgroundColor: '#FF5722',
            pointBorderColor: '#FF5722',
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
                text: 'Horas',
                font: {
                    size: 14,
                },
                color: 'gray',
            },
            ticks: {
                autoSkip: false,
                font: {
                    size: 12,
                },
                color: 'gray',
            },
        },
        y: {
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
                min: 0,
                max: 2000, // Ajusta el rango de CO2
                stepSize: 250,
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

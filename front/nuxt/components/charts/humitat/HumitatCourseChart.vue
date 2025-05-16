<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative">
            <Line :options="chartOptions" :data="formattedData" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

const props = defineProps({
    idAula: {
        type: Number,
        required: true
    }
});

// Registrar los componentes necesarios, incluyendo Filler para el área
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

const formattedData = ref({
    labels: ['2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'],
    datasets: [
        {
            label: 'CO2 (ppm)',
            data: [150, 800, 1200, 1850],
            fill: true, // Habilitar el relleno para el gráfico de áreas
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.2)',
            pointBackgroundColor: '#FF5722',
            pointBorderColor: '#FF5722',
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1, // Suavizar la línea
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
                text: 'Año',
                font: {
                    size: 14,
                },
                color: 'gray',
            },
            ticks: {
                autoSkip: false,
                maxTicksLimit: 13,
                autoSkip: 5,
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
                min: 0,  // Asegúrate de que el mínimo es 0
                max: 2000, // El máximo es 2000
                stepSize: 250, // El tamaño del paso es 500
            },
        },
    },
});
</script>

<style scoped>
div.w-full.h-full {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
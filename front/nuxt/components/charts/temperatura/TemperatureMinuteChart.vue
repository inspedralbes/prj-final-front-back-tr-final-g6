<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
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

// Registra los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const chartData = ref({
    labels: [], // Minutos
    datasets: [
        {
            label: 'Temperatura (°C)',
            data: [], // Temperaturas
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
                text: 'Minut',
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
                max: 40,
                stepSize: 10,
            },
        },
    },
});

// Función para actualizar el gráfico
const updateChartData = (data) => {
    const filteredData = data.filter(item => item.value >= 0 && item.value <= 60);
    const labels = filteredData.map(item => item.time);
    const values = filteredData.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
};

// Datos de ejemplo (temperatura)
const temperatureData = [
    { time: '00:00', value: 21 },
    { time: '00:01', value: 22 },
    { time: '00:02', value: 23 },
    { time: '00:03', value: 22.5 },
    { time: '00:04', value: 23.2 },
    { time: '00:05', value: 24 },
    { time: '00:06', value: 24.5 },
    { time: '00:07', value: 25 },
    { time: '00:08', value: 26 },
    { time: '00:09', value: 26.5 },
    { time: '00:10', value: 27 },
    { time: '00:11', value: 27.3 },
    { time: '00:12', value: 27.5 },
    { time: '00:13', value: 28 },
    { time: '00:14', value: 28.3 },
    { time: '00:15', value: 28.7 },
    { time: '00:16', value: 29 },
    { time: '00:17', value: 29.5 },
    { time: '00:18', value: 30 },
    { time: '00:19', value: 30.5 },
    { time: '00:20', value: 30.8 },
    { time: '00:21', value: 38 },
    { time: '00:22', value: 31.5 },
    { time: '00:23', value: 32 },
    { time: '00:24', value: 31.8 },
    { time: '00:25', value: 31.6 },
    { time: '00:26', value: 31.3 },
    { time: '00:27', value: 31 },
    { time: '00:28', value: 30.5 },
    { time: '00:29', value: 30 },
    { time: '00:30', value: 29.5 },
    { time: '00:31', value: 29 },
    { time: '00:32', value: 28.5 },
    { time: '00:33', value: 28 },
    { time: '00:34', value: 27.5 },
    { time: '00:35', value: 27 },
    { time: '00:36', value: 26.5 },
    { time: '00:37', value: 26 },
    { time: '00:38', value: 25.5 },
    { time: '00:39', value: 25 },
    { time: '00:40', value: 24.5 },
    { time: '00:41', value: 24 },
    { time: '00:42', value: 23.5 },
    { time: '00:43', value: 23 },
    { time: '00:44', value: 22.5 },
    { time: '00:45', value: 22 },
    { time: '00:46', value: 21.5 },
    { time: '00:47', value: 21 },
    { time: '00:48', value: 20.5 },
    { time: '00:49', value: 20 },
    { time: '00:50', value: 19.5 },
    { time: '00:51', value: 19 },
    { time: '00:52', value: 18.5 },
    { time: '00:53', value: 18 },
    { time: '00:54', value: 17.5 },
    { time: '00:55', value: 17 },
    { time: '00:56', value: 16.5 },
    { time: '00:57', value: 16 },
    { time: '00:58', value: 15.5 },
    { time: '00:59', value: 4 },
    { time: '01:00', value: 14.5 },
];

// Inicializar el gráfico
updateChartData(temperatureData);

// Actualizar si cambian los datos
watch(temperatureData, (newData) => {
    updateChartData(newData);
}, { deep: true });
</script>

<style scoped>
div.w-full.h-full {
    position: relative;
}
</style>
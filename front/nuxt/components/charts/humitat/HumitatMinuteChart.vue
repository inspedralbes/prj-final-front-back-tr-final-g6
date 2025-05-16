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

const props = defineProps({
    idAula: {
        type: Number,
        required: true
    }
});

// Registra los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const chartData = ref({
    labels: [], // Minutos
    datasets: [
        {
            label: 'CO2 (ppm)',
            data: [], // Niveles de CO2
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
                text: 'Minuto',
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
                min: 0,
                max: 2000,
                stepSize: 250,
            },
        },
    },
});

// Función para actualizar el gráfico
const updateChartData = (data) => {
    const filteredData = data.filter(item => item.value >= 0 && item.value <= 2000);
    const labels = filteredData.map(item => item.time);
    const values = filteredData.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
};

// Datos de ejemplo (niveles de CO2)
const co2Data = [
    { time: '00:00', value: 15 },
    { time: '00:01', value: 202 },
    { time: '00:02', value: 450 },
    { time: '00:03', value: 460 },
    { time: '00:04', value: 480 },
    { time: '00:05', value: 500 },
    { time: '00:06', value: 520 },
    { time: '00:07', value: 540 },
    { time: '00:08', value: 560 },
    { time: '00:09', value: 580 },
    { time: '00:10', value: 600 },
    { time: '00:11', value: 620 },
    { time: '00:12', value: 640 },
    { time: '00:13', value: 660 },
    { time: '00:14', value: 680 },
    { time: '00:15', value: 700 },
    { time: '00:16', value: 720 },
    { time: '00:17', value: 740 },
    { time: '00:18', value: 760 },
    { time: '00:19', value: 780 },
    { time: '00:20', value: 800 },
    { time: '00:21', value: 820 },
    { time: '00:22', value: 840 },
    { time: '00:23', value: 860 },
    { time: '00:24', value: 880 },
    { time: '00:25', value: 900 },
    { time: '00:26', value: 920 },
    { time: '00:27', value: 940 },
    { time: '00:28', value: 960 },
    { time: '00:29', value: 980 },
    { time: '00:30', value: 1000 },
    { time: '00:31', value: 1020 },
    { time: '00:32', value: 1040 },
    { time: '00:33', value: 1060 },
    { time: '00:34', value: 1080 },
    { time: '00:35', value: 1100 },
    { time: '00:36', value: 1120 },
    { time: '00:37', value: 1140 },
    { time: '00:38', value: 1160 },
    { time: '00:39', value: 1180 },
    { time: '00:40', value: 1200 },
    { time: '00:41', value: 1220 },
    { time: '00:42', value: 1240 },
    { time: '00:43', value: 1260 },
    { time: '00:44', value: 1280 },
    { time: '00:45', value: 1300 },
    { time: '00:46', value: 1320 },
    { time: '00:47', value: 1340 },
    { time: '00:48', value: 1360 },
    { time: '00:49', value: 1380 },
    { time: '00:50', value: 1400 },
    { time: '00:51', value: 1420 },
    { time: '00:52', value: 1440 },
    { time: '00:53', value: 1460 },
    { time: '00:54', value: 1480 },
    { time: '00:55', value: 1500 },
    { time: '00:56', value: 1520 },
    { time: '00:57', value: 1540 },
    { time: '00:58', value: 1560 },
    { time: '00:59', value: 1580 },
    { time: '01:00', value: 1950 },
];

// Inicializar el gráfico
updateChartData(co2Data);

// Actualizar si cambian los datos
watch(co2Data, (newData) => {
    updateChartData(newData);
}, { deep: true });
</script>

<style scoped>
div.w-full.h-full {
    position: relative;
}
</style>
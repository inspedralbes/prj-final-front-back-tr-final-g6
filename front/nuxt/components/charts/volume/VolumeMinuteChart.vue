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
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

// Registra los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const chartData = ref({
    labels: [], // Aquí van las etiquetas de tiempo
    datasets: [
        {
            label: 'Volumen (dB)',
            data: [], // Aquí van los valores de volumen
            fill: false,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#4CAF50',
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
    },
});

// Función para actualizar los datos del gráfico
const updateChartData = (data) => {
    const filteredData = data.filter(item => item.value >= 0 && item.value <= 60); // Filtrar valores entre 10 y 40
    const labels = filteredData.map(item => item.time);
    const values = filteredData.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
};

// Ejemplo de datos que se pasan al gráfico
const volumeData = [
    { time: '00:00', value: 20 },
    { time: '00:01', value: 22 },
    { time: '00:02', value: 2 },
    { time: '00:03', value: 25 },
    { time: '00:04', value: 23 },
    { time: '00:05', value: 21 },
    { time: '00:06', value: 20 },
    { time: '00:07', value: 19 },
    { time: '00:08', value: 17 },
    { time: '00:09', value: 23 },
    { time: '00:10', value: 24 },
    { time: '00:11', value: 26 },
    { time: '00:12', value: 21 },
    { time: '00:13', value: 19 },
    { time: '00:14', value: 22 },
    { time: '00:15', value: 23 },
    { time: '00:16', value: 20 },
    { time: '00:17', value: 18 },
    { time: '00:18', value: 24 },
    { time: '00:19', value: 26 },
    { time: '00:20', value: 27 },
    { time: '00:21', value: 30 },
    { time: '00:22', value: 28 },
    { time: '00:23', value: 29 },
    { time: '00:24', value: 22 },
    { time: '00:25', value: 21 },
    { time: '00:26', value: 24 },
    { time: '00:27', value: 20 },
    { time: '00:28', value: 18 },
    { time: '00:29', value: 25 },
    { time: '00:30', value: 23 },
    { time: '00:31', value: 22 },
    { time: '00:32', value: 20 },
    { time: '00:33', value: 21 },
    { time: '00:34', value: 22 },
    { time: '00:35', value: 24 },
    { time: '00:36', value: 26 },
    { time: '00:37', value: 23 },
    { time: '00:38', value: 25 },
    { time: '00:39', value: 27 },
    { time: '00:40', value: 28 },
    { time: '00:41', value: 29 },
    { time: '00:42', value: 58 },
    { time: '00:43', value: 32 },
    { time: '00:44', value: 31 },
    { time: '00:45', value: 28 },
    { time: '00:46', value: 29 },
    { time: '00:47', value: 30 },
    { time: '00:48', value: 32 },
    { time: '00:49', value: 33 },
    { time: '00:50', value: 30 },
    { time: '00:51', value: 28 },
    { time: '00:52', value: 27 },
    { time: '00:53', value: 26 },
    { time: '00:54', value: 24 },
    { time: '00:55', value: 23 },
    { time: '00:56', value: 22 },
    { time: '00:57', value: 20 },
    { time: '00:58', value: 18 },
    { time: '00:59', value: 19 },
    { time: '01:00', value: 23 }, 
];

// Inicializar el gráfico con los datos
updateChartData(volumeData);

// Si en algún momento los datos cambian, actualizamos el gráfico
watch(volumeData, (newData) => {
    updateChartData(newData);
}, { deep: true });
</script>

<style scoped>
div.w-full.h-full {
    position: relative;
}
</style>

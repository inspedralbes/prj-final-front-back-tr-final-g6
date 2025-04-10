<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative"> <!-- Added 'relative' for better positioning -->
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
            label: 'Volumen',
            data: [], // Aquí van los valores de volumen
            fill: false,
            borderColor: 'rgb(75, 192, 192)', // Color de la línea
            tension: 0.1,
        },
    ],
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 14, // Aumentar el tamaño de la fuente de la leyenda
                },
                color: 'white', // Asegurar que el texto sea visible
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Minut',
                font: {
                    size: 14, // Aumentar el tamaño del título del eje X
                },
                color: 'gray',
            },
            ticks: {
                autoSkip: false, // Mostrar todas las etiquetas
                maxTicksLimit: 13, // Ajustar para incluir las 01:00
                autoSkip: 5,
                font: {
                    size: 12, // Aumentar el tamaño de las etiquetas del eje X
                },
                color: 'gray',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Volumen',
                font: {
                    size: 14, // Aumentar el tamaño del título del eje Y
                },
                color: 'gray',
            },
            ticks: {
                font: {
                    size: 12, // Aumentar el tamaño de las etiquetas del eje Y
                },
                color: 'gray',
            },
        },
    },
});

// Función para actualizar los datos del gráfico
const updateChartData = (data) => {
    const labels = data.map(item => item.time);
    if (!labels.includes('2025-02-10 01:00')) {
        labels.push('2025-02-10 01:00'); // Asegurar que se incluya la etiqueta 01:00
    }
    const values = data.map(item => item.value);
    values.push(null); // Añadir un valor vacío para la etiqueta 01:00

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
};

// Ejemplo de datos que se pasan al gráfico
const volumeData = [
    { time: '2025-02-10 00:00', value: 20 },
    { time: '2025-02-10 00:01', value: 22 },
    { time: '2025-02-10 00:02', value: 18 },
    { time: '2025-02-10 00:03', value: 25 },
    { time: '2025-02-10 00:04', value: 23 },
    { time: '2025-02-10 00:05', value: 21 },
    { time: '2025-02-10 00:06', value: 20 },
    { time: '2025-02-10 00:07', value: 19 },
    { time: '2025-02-10 00:08', value: 17 },
    { time: '2025-02-10 00:09', value: 23 },
    { time: '2025-02-10 00:10', value: 24 },
    { time: '2025-02-10 00:11', value: 26 },
    { time: '2025-02-10 00:12', value: 21 },
    { time: '2025-02-10 00:13', value: 19 },
    { time: '2025-02-10 00:14', value: 22 },
    { time: '2025-02-10 00:15', value: 23 },
    { time: '2025-02-10 00:16', value: 20 },
    { time: '2025-02-10 00:17', value: 18 },
    { time: '2025-02-10 00:18', value: 24 },
    { time: '2025-02-10 00:19', value: 26 },
    { time: '2025-02-10 00:20', value: 27 },
    { time: '2025-02-10 00:21', value: 30 },
    { time: '2025-02-10 00:22', value: 28 },
    { time: '2025-02-10 00:23', value: 29 },
    { time: '2025-02-10 00:24', value: 22 },
    { time: '2025-02-10 00:25', value: 21 },
    { time: '2025-02-10 00:26', value: 24 },
    { time: '2025-02-10 00:27', value: 20 },
    { time: '2025-02-10 00:28', value: 18 },
    { time: '2025-02-10 00:29', value: 25 },
    { time: '2025-02-10 00:30', value: 23 },
    { time: '2025-02-10 00:31', value: 22 },
    { time: '2025-02-10 00:32', value: 20 },
    { time: '2025-02-10 00:33', value: 21 },
    { time: '2025-02-10 00:34', value: 22 },
    { time: '2025-02-10 00:35', value: 24 },
    { time: '2025-02-10 00:36', value: 26 },
    { time: '2025-02-10 00:37', value: 23 },
    { time: '2025-02-10 00:38', value: 25 },
    { time: '2025-02-10 00:39', value: 27 },
    { time: '2025-02-10 00:40', value: 28 },
    { time: '2025-02-10 00:41', value: 29 },
    { time: '2025-02-10 00:42', value: 30 },
    { time: '2025-02-10 00:43', value: 32 },
    { time: '2025-02-10 00:44', value: 31 },
    { time: '2025-02-10 00:45', value: 28 },
    { time: '2025-02-10 00:46', value: 29 },
    { time: '2025-02-10 00:47', value: 30 },
    { time: '2025-02-10 00:48', value: 32 },
    { time: '2025-02-10 00:49', value: 33 },
    { time: '2025-02-10 00:50', value: 30 },
    { time: '2025-02-10 00:51', value: 28 },
    { time: '2025-02-10 00:52', value: 27 },
    { time: '2025-02-10 00:53', value: 26 },
    { time: '2025-02-10 00:54', value: 24 },
    { time: '2025-02-10 00:55', value: 23 },
    { time: '2025-02-10 00:56', value: 22 },
    { time: '2025-02-10 00:57', value: 20 },
    { time: '2025-02-10 00:58', value: 18 },
    { time: '2025-02-10 00:59', value: 19 },
    { time: '2025-02-10 01:00', value: 23 }, // Asegurar que la etiqueta 01:00 esté presente
];

// Inicializar el gráfico con los datos
updateChartData(volumeData);

// Si en algún momento los datos cambian, actualizamos el gráfico
watch(volumeData, (newData) => {
    updateChartData(newData);
}, { deep: true });
</script>

<style scoped>
/* Asegurar que el contenedor del gráfico ocupe todo el espacio disponible */
div.w-full.h-full {
    position: relative;
}
</style>

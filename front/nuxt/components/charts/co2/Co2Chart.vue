<template>
    <Line :options="chartOptions" :data="formattedData" />
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

const formattedData = ref({
    labels: [],
    datasets: []
});

watch(props.data, (newData) => {
    if (newData && newData.length > 0) {
        formattedData.value = {
            labels: newData.map(item => new Date(item.dataIni).toLocaleDateString()),
            datasets: [
                {
                    label: "Nivell de CO₂ (ppm)",
                    data: newData.map(item => item.average),
                    borderColor: '#10B981', // Teal-500
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#10B981',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3
                }
            ]
        };
    }
}, { immediate: true });

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#E5E7EB',
                font: {
                    size: 14
                }
            }
        },
        tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#E5E7EB',
            bodyColor: '#E5E7EB',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            callbacks: {
                label: function (context) {
                    return ` ${context.dataset.label}: ${context.raw} ppm`;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: '#374151'
            },
            ticks: {
                color: '#9CA3AF'
            },
            title: {
                display: true,
                text: 'Data',
                color: '#9CA3AF'
            }
        },
        y: {
            grid: {
                color: '#374151'
            },
            ticks: {
                color: '#9CA3AF',
                stepSize: 40
            },
            title: {
                display: true,
                text: 'CO₂ (ppm)',
                color: '#9CA3AF'
            },
            min: 300,
            max: 500
        }
    }
};
</script>
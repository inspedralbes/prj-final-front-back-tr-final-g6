<template>
    <Line :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const chartData = {
    labels: ['Setembre', 'Octubre', 'Novembre', 'Desembre', 'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny'],
    datasets: [
        {
            label: "Temperatura Estimada a l'Aula (°C)",
            data: [27, 21, 17, 13, 12, 14, 18, 21, 26, 31],
            borderColor: '#1E90FF',
            backgroundColor: 'rgba(30, 144, 255, 0.2)',
            pointBackgroundColor: '#1E90FF',
            pointBorderColor: '#fff',
            pointRadius: 5,
            fill: true,
            tension: 0.2
        }
    ]
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Temperatura Estimada a l'Aula (°C)",
            font: {
                size: 18
            }
        },
        tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                    return `Mes: ${tooltipItem.label}, Temperatura: ${tooltipItem.raw}°C`;
                }
            }
        },
        legend: {
            labels: {
                font: {
                    size: 14
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Mesos',
                font: {
                    size: 14
                }
            },
            grid: {
                display: false
            }
        },
        y: {
            title: {
                display: true,
                text: 'Temperatura (°C)',
                font: {
                    size: 14
                }
            },
            min: 10,
            max: 35,
            ticks: {
                stepSize: 5,
                font: {
                    size: 12
                }
            },
        }
    }
};
</script>

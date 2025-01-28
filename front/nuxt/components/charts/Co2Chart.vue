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
            label: "Nivell de CO2 (ppm)",
            data: [450, 430, 400, 380, 360, 390, 410, 440, 450, 480],
            borderColor: '#FF5733',
            fill: false,
            tension: 0.3
        }
    ]
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Nivell de CO2 a l'Aula"
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
            }
        },
        y: {
            title: { 
                display: true, 
                text: 'CO2 (ppm)',
                font: {
                    size: 14
                }
            },
            min: 300,
            max: 500,
            ticks: {
                stepSize: 40,
                font: {
                    size: 12
                }
            }
        }
    }
};
</script>

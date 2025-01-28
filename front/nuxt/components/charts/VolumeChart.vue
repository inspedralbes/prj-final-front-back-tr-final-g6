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
            label: "Nivell de Decibels (dB)",
            data: [63, 68, 60, 62, 51, 53, 43, 49, 56, 62],
            borderColor: '#28A745',
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
            text: "Nivell de Decibels a l'Aula (dB)"
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
                text: 'Decibels (dB)',
                font: {
                    size: 14
                }
            },
            min: 40,
            max: 70,
            ticks: {
                stepSize: 5,
                font: {
                    size: 12
                }
            }
        }
    }
};
</script>

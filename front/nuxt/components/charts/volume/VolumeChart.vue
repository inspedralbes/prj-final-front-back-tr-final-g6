<template>
    <Bar :options="chartOptions" :data="formattedData" />
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Propietats per rebre les dades
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

// Variable reactiva per a les dades formatades
const formattedData = ref({
    labels: [],
    datasets: []
});

// Observa els canvis en les dades d'entrada i formata-les
watch(props.data, (newData) => {
    if (newData && newData.length > 0) {
        // Debug: Mostra les noves dades per comprovar-ne l'estructura
        console.log("Noves dades:", newData);

        // Assegura que les dades estiguin correctament formatejades
        formattedData.value = {
            labels: newData.map(item => new Date(item.dataIni).toLocaleDateString()),
            datasets: [
                {
                    label: "Mínim (dB)",
                    data: newData.map(item => item.min || 0), // Evita valors indefinits
                    backgroundColor: 'rgba(16, 185, 129, 0.7)', // Verd maragda
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                },
                {
                    label: "Màxim (dB)",
                    data: newData.map(item => item.max || 0), // Evita valors indefinits
                    backgroundColor: 'rgba(239, 68, 68, 0.7)', // Vermell
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                },
                {
                    label: "Mitjana (dB)",
                    data: newData.map(item => item.average || 0), // Evita valors indefinits
                    backgroundColor: 'rgba(99, 102, 241, 0.7)', // Índigo
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }
            ]
        };
    }
}, { immediate: true });

// Configuració del gràfic
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
                    return ` ${context.dataset.label}: ${context.raw} dB`;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: '#374151',
                display: false
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
                stepSize: 10
            },
            title: {
                display: true,
                text: 'Decibels (dB)',
                color: '#9CA3AF'
            },
            min: Math.min(...props.data.map(item => item.min || 0)) - 10,  // Mínim dinàmic
            max: Math.max(...props.data.map(item => item.max || 0)) + 10   // Màxim dinàmic
        }
    }
};
</script>

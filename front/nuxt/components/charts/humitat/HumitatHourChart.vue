<template>
    <div class="dashboard-container">
        <div v-if="loading" class="loading-overlay">
            <div class="loading-message">Carregant dades...</div>
        </div>

        <div v-else-if="error" class="error-overlay">
            <div class="error-message">{{ error }}</div>
        </div>

        <div v-else class="dashboard-content">
            <!-- Header Section -->
            <div class="dashboard-header">
                <div class="humidity-display">
                    <div class="current-humidity" :class="humidityColorClass">
                        {{ currentHumidity !== null ? parseFloat(currentHumidity.avg).toFixed(2) : '--' }}%
                    </div>
                    <div class="humidity-range">
                        <span class="min-humidity">{{ currentHumidity?.min !== undefined ?
                            parseFloat(currentHumidity.min).toFixed(2) : '--' }}%</span>
                        <span class="range-separator">-</span>
                        <span class="max-humidity">{{ currentHumidity?.max !== undefined ?
                            parseFloat(currentHumidity.max).toFixed(2) : '--' }}%</span>
                    </div>
                    <div class="humidity-label">Humitat actual (Mitjana/Mínim/Màxim)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Últimes 24 hores</div>
                    <div class="update-time">Última actualització: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="humidity-chart" />
            </div>

            <!-- Legend Section -->
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color avg-color"></span>
                    <span class="legend-label">Mitjana</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color max-color"></span>
                    <span class="legend-label">Màxim</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color min-color"></span>
                    <span class="legend-label">Mínim</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
import { io } from 'socket.io-client';
import { getBaseUrl, getDadesGrafic } from '~/utils/communicationManager';
import { useRoute } from 'vue-router';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Reactive state
const humidityData = ref([]);
const chartKey = ref(0);
const socket = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();

const props = defineProps({
    idAula: {
        type: Number,
        required: true
    }
});

// Chart data configuration
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Humitat Mitjana (%)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(75, 192, 192, 0.1)',
                below: 'rgba(75, 192, 192, 0.1)'
            },
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointBackgroundColor: '#4bc0c0',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            borderWidth: 2
        },
        {
            label: 'Humitat Màxima (%)',
            data: [],
            borderColor: '#ff9f40',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            pointBackgroundColor: '#ff9f40',
            pointBorderColor: '#fff',
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            borderDash: [5, 5]
        },
        {
            label: 'Humitat Mínima (%)',
            data: [],
            borderColor: '#9966ff',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            pointBackgroundColor: '#9966ff',
            pointBorderColor: '#fff',
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            borderDash: [5, 5]
        }
    ],
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#E5E7EB',
            bodyColor: '#E5E7EB',
            callbacks: {
                label: (context) => {
                    const datasetLabel = context.dataset.label || '';
                    const value = context.raw !== null ? parseFloat(context.raw).toFixed(2) : '--';
                    return `${datasetLabel}: ${value}%`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Hora',
                color: '#9CA3AF',
                font: {
                    size: 12
                }
            },
            ticks: {
                color: '#9CA3AF',
                maxRotation: 45,
                minRotation: 45,
                autoSkip: false,
                callback: function (value, index, values) {
                    if (index === values.length - 1) return '24:00';
                    return this.getLabelForValue(value);
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            },
            min: '00:00',
            max: '24:00'
        },
        y: {
            title: {
                display: true,
                text: 'Humitat (%)',
                color: '#9CA3AF',
                font: {
                    size: 12
                }
            },
            min: 0,
            max: 100,
            ticks: {
                color: '#9CA3AF',
                stepSize: 10
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            }
        }
    }
});

const currentHumidity = computed(() => {
    const latestValidDataPoint = [...humidityData.value]
        .reverse()
        .find(dataPoint => dataPoint.value?.avg !== null && dataPoint.value?.avg !== undefined);
    return latestValidDataPoint?.value || null;
});

const humidityColorClass = computed(() => {
    const hum = currentHumidity.value?.avg;
    if (hum === null || hum === undefined) return 'hum-neutral';
    if (hum < 30) return 'hum-low';
    if (hum < 60) return 'hum-optimal';
    if (hum < 70) return 'hum-medium';
    return 'hum-high';
});

const lastUpdateTime = computed(() => {
    return humidityData.value[humidityData.value.length - 1]?.time || '--:--';
});

const fetchInitialData = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(startOfDay.getDate() + 1);

        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        const data = await getDadesGrafic(
            'hora',
            'humitat',
            idAula,
            startOfDay.toISOString(),
            endOfDay.toISOString()
        );

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error("No se recibieron datos del servidor");
        }

        const labels = Array.from({ length: 25 }, (_, i) => {
            if (i === 24) return '24:00';
            const time = new Date(startOfDay.getTime() + i * 60 * 60 * 1000);
            return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        });

        const completeData = labels.map(label => {
            if (label === '24:00') {
                const midnightData = data.find(item => {
                    const itemHour = new Date(item.dataIni).getHours();
                    return itemHour === 23;
                });
                return midnightData ? {
                    time: '24:00',
                    value: {
                        avg: midnightData.average,
                        min: midnightData.min,
                        max: midnightData.max
                    }
                } : {
                    time: '24:00',
                    value: null
                };
            }

            const hour = parseInt(label.split(':')[0]);
            const found = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return (
                    itemDate.getHours() === hour &&
                    Math.abs(itemDate.getMinutes()) <= 10 // margen de 10 minutos
                );
            });

            return found ? {
                time: label,
                value: {
                    avg: found.average,
                    min: found.min,
                    max: found.max
                }
            } : {
                time: label,
                value: null
            };
        });

        humidityData.value = completeData;
        updateChartData(humidityData.value);
        loading.value = false;
    } catch (err) {
        console.error('Error fetching initial data:', err);
        error.value = err.message || 'Failed to load initial data';
        loading.value = false;
    }
};

const updateChartData = (data) => {
    const labels = data.map((item, index) =>
        index === data.length - 1 ? '24:00' : item.time
    );

    const avgValues = data.map(item => item.value?.avg);
    const minValues = data.map(item => item.value?.min);
    const maxValues = data.map(item => item.value?.max);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = avgValues;
    chartData.value.datasets[1].data = maxValues;
    chartData.value.datasets[2].data = minValues;
    chartKey.value++;
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors || data.timeSpan !== 'hora') return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let totalHumidity = 0;
    let minHumidity = Infinity;
    let maxHumidity = -Infinity;
    let sensorCount = 0;

    Object.values(data.sensors).forEach(sensor => {
        if (sensor.humidity && typeof sensor.humidity.avg === 'number') {
            totalHumidity += sensor.humidity.avg;
            if (sensor.humidity.min < minHumidity) minHumidity = sensor.humidity.min;
            if (sensor.humidity.max > maxHumidity) maxHumidity = sensor.humidity.max;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgHumidity = totalHumidity / sensorCount;

        if (avgHumidity >= 0 && avgHumidity <= 100) {
            const hourIndex = humidityData.value.findIndex(item => item.time === timeString);
            if (hourIndex !== -1) {
                humidityData.value[hourIndex].value = {
                    avg: avgHumidity,
                    min: minHumidity,
                    max: maxHumidity
                };
                humidityData.value = [...humidityData.value];
                updateChartData(humidityData.value);
            }
        }
    }
};

onMounted(() => {
    fetchInitialData();

    try {
        const socketUrl = getBaseUrl();
        socket.value = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.value.on('newAggregatedData', handleNewAggregatedData);
        socket.value.on('connect', () => console.log('Connected to socket server'));
        socket.value.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            error.value = 'Connection error with server';
        });
        socket.value.on('disconnect', (reason) => {
            console.log('Disconnected from server. Reason:', reason);
            if (reason === 'io server disconnect') {
                socket.value.connect();
            }
        });
    } catch (err) {
        console.error('Error initializing socket connection:', err);
        error.value = 'Error initializing connection';
    }
});

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
    }
});
</script>

<style scoped>
.dashboard-container {
    width: 100%;
    height: 100%;
    background: #1a1a2e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    position: relative;
}

.loading-overlay,
.error-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(26, 26, 46, 0.9);
    z-index: 10;
}

.loading-message {
    color: white;
    font-size: 1.125rem;
}

.error-message {
    color: #f87171;
    font-size: 1.125rem;
}

.dashboard-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.dashboard-header {
    padding: 20px;
    background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.humidity-display {
    display: flex;
    flex-direction: column;
}

.current-humidity {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
}

.humidity-range {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}

.min-humidity {
    color: #9966ff;
    font-weight: 500;
}

.max-humidity {
    color: #ff9f40;
    font-weight: 500;
}

.range-separator {
    color: #a1a1aa;
}

.humidity-label {
    font-size: 0.9rem;
    color: #a1a1aa;
    margin-top: 4px;
}

.time-range-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.time-range-indicator {
    background: rgba(75, 192, 192, 0.2);
    color: #4bc0c0;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.update-time {
    font-size: 0.85rem;
    color: #a1a1aa;
}

.chart-container {
    flex: 1;
    padding: 16px;
    min-height: 300px;
}

.humidity-chart {
    width: 100%;
    height: 100%;
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 10px 0;
    background: rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.legend-color {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.avg-color {
    background-color: #4bc0c0;
}

.max-color {
    background-color: #ff9f40;
}

.min-color {
    background-color: #9966ff;
}

.legend-label {
    font-size: 0.8rem;
    color: #a1a1aa;
}

/* Humidity color classes */
.hum-low {
    color: #3498db;
}

.hum-optimal {
    color: #2ecc71;
}

.hum-medium {
    color: #f1c40f;
}

.hum-high {
    color: #e74c3c;
}

.hum-neutral {
    color: #a1a1aa;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
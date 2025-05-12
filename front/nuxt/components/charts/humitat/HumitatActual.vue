<template>
    <div class="dashboard-container">
        <div v-if="loading" class="loading-overlay">
            <div class="loading-message">Loading data...</div>
        </div>

        <div v-else-if="error" class="error-overlay">
            <div class="error-message">{{ error }}</div>
        </div>

        <div v-else class="dashboard-content">
            <!-- Header Section -->
            <div class="dashboard-header">
                <div class="humidity-display">
                    <div class="current-humidity" :class="humidityColorClass">
                        {{ currentHumidity }}%
                    </div>
                    <div class="humidity-label">Current Humidity</div>
                </div>

                <div class="sensor-info">
                    <span class="sensor-id">Sensor ID: {{ sensorId || 'Not available' }}</span>
                    <span class="update-time">Last update: {{ lastUpdate }}</span>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :data="chartData" :options="chartOptions" :key="lineChartKey" class="humidity-chart" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Line } from 'vue-chartjs';
import { getBaseUrl } from '~/utils/communicationManager';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js';
import { io } from 'socket.io-client';

// Register ChartJS components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
);

// Component state
const loading = ref(true);
const error = ref(null);
const socket = ref(null);
const currentHumidity = ref(0);
const sensorId = ref(null);
const lastUpdate = ref('--:--');
const recentHumidityReadings = ref([]);
const lineChartKey = ref(0);

// Computed properties
const humidityColorClass = computed(() => {
    const humidity = currentHumidity.value;
    if (humidity < 30) return 'humidity-low';
    if (humidity < 60) return 'humidity-normal';
    return 'humidity-high';
});

const humidityColors = computed(() => {
    const humidity = currentHumidity.value;
    if (humidity < 30) {
        return {
            borderColor: '#60a5fa', // blue
            backgroundColor: 'rgba(96, 165, 250, 0.2)'
        };
    } else if (humidity < 60) {
        return {
            borderColor: '#34d399', // green
            backgroundColor: 'rgba(52, 211, 153, 0.2)'
        };
    } else {
        return {
            borderColor: '#f87171', // red
            backgroundColor: 'rgba(248, 113, 113, 0.2)'
        };
    }
});

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Humidity (%)',
            data: [],
            borderColor: '#9CA3AF',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            tension: 0,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: {
                target: 'origin',
                above: 'rgba(0, 0, 0, 0.1)',
                below: 'rgba(0, 0, 0, 0.1)'
            },
            segment: {
                borderColor: '#9CA3AF',
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }
        },
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
                label: (context) => `Humidity: ${context.raw}%`
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#9CA3AF',
                maxRotation: 45,
                minRotation: 45,
                autoSkip: true,
                maxTicksLimit: 12
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            }
        },
        y: {
            min: 0,
            max: 100,
            ticks: {
                color: '#9CA3AF',
                stepSize: 10
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            },
            title: {
                display: true,
                text: 'Humidity (%)',
                color: '#9CA3AF'
            }
        }
    },
    elements: {
        line: {
            borderWidth: 2
        }
    }
});

// Socket connection and data handling
onMounted(() => {
    try {
        const socketUrl = getBaseUrl();
        console.log('Connecting to socket at:', socketUrl);
        socket.value = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.value.on('newRawData', (data) => {
            console.log('Received data via socket:', JSON.stringify(data, null, 2));

            if (data && data.humidity !== undefined) {
                const humidityValue = typeof data.humidity === 'string'
                    ? parseFloat(data.humidity)
                    : data.humidity;

                if (!isNaN(humidityValue)) {
                    sensorId.value = data.id_sensor;

                    const date = new Date(data.date);
                    lastUpdate.value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                    addHumidityDataPoint(humidityValue, lastUpdate.value);

                    console.log('Updated data: Humidity =', currentHumidity.value, 'Sensor =', sensorId.value);
                }
            }
        });

        socket.value.on('connect', () => {
            loading.value = false;
            error.value = null;
            console.log('Connected to socket server with ID:', socket.value.id);
        });

        socket.value.on('connect_error', (err) => {
            loading.value = false;
            error.value = 'Connection error with server';
            console.error('Socket connection error:', err);
        });

        socket.value.on('disconnect', (reason) => {
            console.log('Disconnected from server. Reason:', reason);
            if (reason === 'io server disconnect') {
                socket.value.connect();
            }
        });
    } catch (err) {
        loading.value = false;
        error.value = 'Error initializing connection';
        console.error('Error initializing socket connection:', err);
    }
});

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
    }
});

function addHumidityDataPoint(humidity, timestamp) {
    currentHumidity.value = humidity;
    
    recentHumidityReadings.value.push({
        time: timestamp,
        value: humidity
    });

    if (recentHumidityReadings.value.length > 100) {
        recentHumidityReadings.value.shift();
    }

    updateChartData();
    lineChartKey.value++;
}

function updateChartData() {
    const labels = recentHumidityReadings.value.map(item => item.time);
    const dataPoints = recentHumidityReadings.value.map(item => item.value);

    // Definición de colores según los umbrales de humedad
    const colorRanges = [
        { max: 30, border: '#60a5fa', background: 'rgba(96, 165, 250, 0.5)' },  // Azul (humedad baja)
        { max: 60, border: '#34d399', background: 'rgba(52, 211, 153, 0.5)' },  // Verde (humedad normal)
        { max: Infinity, border: '#f87171', background: 'rgba(248, 113, 113, 0.5)' } // Rojo (humedad alta)
    ];

    // Asignar colores a cada punto de forma segura
    const pointColors = dataPoints.map(value => {
        const range = colorRanges.find(r => value < r.max) || colorRanges[colorRanges.length - 1];
        return {
            border: range?.border || '#9CA3AF',
            background: range?.background || 'rgba(0, 0, 0, 0.1)'
        };
    });

    chartData.value = {
        labels: labels,
        datasets: [
            {
                label: 'Humidity (%)',
                data: dataPoints,
                borderColor: pointColors.map(c => c.border),
                backgroundColor: pointColors.map(c => c.background),
                tension: 0,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: {
                    target: 'origin',
                    above: (ctx) => {
                        const index = ctx.dataIndex;
                        return pointColors[index]?.background || 'rgba(0, 0, 0, 0.1)';
                    },
                    below: (ctx) => {
                        const index = ctx.dataIndex;
                        return pointColors[index]?.background || 'rgba(0, 0, 0, 0.1)';
                    }
                },
                segment: {
                    borderColor: ctx => {
                        // Verificación segura de los puntos
                        if (!ctx.p0 || !ctx.p1 || !ctx.p0.parsed || !ctx.p1.parsed) {
                            return pointColors[0]?.border || '#9CA3AF';
                        }
                        
                        const p0 = ctx.p0.parsed.y;
                        const p1 = ctx.p1.parsed.y;
                        const avgValue = (p0 + p1) / 2;
                        const range = colorRanges.find(r => avgValue < r.max) || colorRanges[colorRanges.length - 1];
                        return range?.border || '#9CA3AF';
                    },
                    backgroundColor: ctx => {
                        if (!ctx.p0 || !ctx.p1 || !ctx.p0.parsed || !ctx.p1.parsed) {
                            return pointColors[0]?.background || 'rgba(0, 0, 0, 0.1)';
                        }
                        
                        const p0 = ctx.p0.parsed.y;
                        const p1 = ctx.p1.parsed.y;
                        const avgValue = (p0 + p1) / 2;
                        const range = colorRanges.find(r => avgValue < r.max) || colorRanges[colorRanges.length - 1];
                        return range?.background || 'rgba(0, 0, 0, 0.1)';
                    }
                }
            }
        ]
    };
}
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

.humidity-label {
    font-size: 0.9rem;
    color: #a1a1aa;
    margin-top: 4px;
}

.sensor-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.sensor-id,
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

/* Humidity color classes */
.humidity-low {
    color: #60a5fa; /* Blue */
}

.humidity-normal {
    color: #34d399; /* Green */
}

.humidity-high {
    color: #f87171; /* Red */
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
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
                <div class="temperature-display">
                    <div class="current-temperature" :class="temperatureColorClass">
                        {{ currentTemperature }}°C
                    </div>
                    <div class="temperature-label">Current Temperature</div>
                </div>

                <div class="sensor-info">
                    <span class="sensor-id">Sensor ID: {{ sensorId || 'Not available' }}</span>
                    <span class="update-time">Last update: {{ lastUpdate }}</span>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :data="chartData" :options="chartOptions" :key="lineChartKey" class="temperature-chart" />
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
const currentTemperature = ref(0);
const sensorId = ref(null);
const lastUpdate = ref('--:--');
const recentTemperatures = ref([]);
const lineChartKey = ref(0);

// Computed properties
const temperatureColorClass = computed(() => {
    const temp = currentTemperature.value;
    if (temp < 20) return 'temp-cool';
    if (temp < 30) return 'temp-normal';
    if (temp < 35) return 'temp-warm';
    return 'temp-hot';
});

// Chart configurations
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Temperature (°C)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(33, 150, 243, 0.2)',
                below: 'rgba(33, 150, 243, 0.2)'
            },
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            tension: 0,
            borderWidth: 2,
            pointRadius: 0, // Hide points
            pointHoverRadius: 0 // Hide points on hover
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
                label: (context) => `Temperature: ${context.raw}°C`
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
            max: 40,
            ticks: {
                color: '#9CA3AF',
                stepSize: 5
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            },
            title: {
                display: true,
                text: 'Temperature (°C)',
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
        const socketUrl = getBaseUrl() + '/socket.io';
        console.log('Connecting to socket at:', socketUrl);

        socket.value = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.value.on('newRawData', (data) => {
            console.log('Received data via socket:', JSON.stringify(data, null, 2));

            if (data && data.temperature !== undefined) {
                const tempValue = typeof data.temperature === 'string'
                    ? parseFloat(data.temperature)
                    : data.temperature;

                if (!isNaN(tempValue)) {
                    sensorId.value = data.id_sensor;

                    const date = new Date(data.date);
                    lastUpdate.value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                    addTemperatureDataPoint(tempValue, lastUpdate.value);

                    console.log('Updated data: Temperature =', currentTemperature.value, 'Sensor =', sensorId.value);
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

// Data handling functions
function addTemperatureDataPoint(temp, timestamp) {
    currentTemperature.value = temp;
    
    recentTemperatures.value.push({
        time: timestamp,
        value: temp
    });

    if (recentTemperatures.value.length > 100) {
        recentTemperatures.value.shift();
    }

    chartData.value = {
        ...chartData.value,
        labels: recentTemperatures.value.map(item => item.time),
        datasets: [
            {
                ...chartData.value.datasets[0],
                data: recentTemperatures.value.map(item => item.value)
            }
        ]
    };

    lineChartKey.value++;
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

.temperature-display {
    display: flex;
    flex-direction: column;
}

.current-temperature {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
}

.temperature-label {
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

.temperature-chart {
    width: 100%;
    height: 100%;
}

/* Temperature color classes */
.temp-cool {
    color: #60a5fa;
}

.temp-normal {
    color: #34d399;
}

.temp-warm {
    color: #fbbf24;
}

.temp-hot {
    color: #f87171;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
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
                        {{ currentTemperature !== null ? parseFloat(currentTemperature).toFixed(2) : '--' }}°C
                    </div>
                    <div class="temperature-label">Current Temperature</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Last 60 minutes</div>
                    <div class="update-time">Last update: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="temperature-chart" />
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
import { getBaseUrl } from '~/utils/communicationManager';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Reactive state
const temperatureData = ref([]);
const chartKey = ref(0);
const socket = ref(null);
const loading = ref(true);
const error = ref(null);

// Chart data configuration
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Temperature (°C)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(33, 150, 243, 0.1)',
                below: 'rgba(33, 150, 243, 0.1)'
            },
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            pointBackgroundColor: '#2196F3',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            borderWidth: 2
        },
    ],
});

// Chart options
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
                label: (context) => `Temperature: ${parseFloat(context.raw).toFixed(2)}°C` // Format to 2 decimals
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Time',
                color: '#9CA3AF',
                font: {
                    size: 12
                }
            },
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
            title: {
                display: true,
                text: 'Temperature (°C)',
                color: '#9CA3AF',
                font: {
                    size: 12
                }
            },
            min: 0,
            max: 40,
            ticks: {
                color: '#9CA3AF',
                stepSize: 5
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            }
        }
    }
});

const currentTemperature = computed(() => {
    console.log('Temperature Data:', temperatureData.value); // Log the entire array

    // Find the most recent valid temperature value
    const latestValidDataPoint = [...temperatureData.value]
        .reverse() // Reverse the array to start from the most recent data
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);

    console.log('Latest Valid Data Point:', latestValidDataPoint); // Log the valid data point

    const value = latestValidDataPoint?.value !== undefined
        ? latestValidDataPoint.value // Do not round the value
        : null;

    console.log(`Current Temperature: ${value}`);
    return value;
});

const temperatureColorClass = computed(() => {
    const temp = currentTemperature.value;
    if (temp === null) return 'temp-neutral';
    if (temp < 20) return 'temp-cool';
    if (temp < 30) return 'temp-normal';
    if (temp < 35) return 'temp-warm';
    return 'temp-hot';
});

const lastUpdateTime = computed(() => {
    return temperatureData.value[temperatureData.value.length - 1]?.time || '--:--';
});

// Fetch initial data for the current hour range
const fetchInitialData = async () => {
    try {
        const now = new Date();
        const startOfHour = new Date(now.setMinutes(0, 0, 0));
        const endOfHour = new Date(startOfHour.getTime() + 60 * 60 * 1000);
        const endOfNextHour = new Date(endOfHour.getTime() + 60 * 1000);

        const response = await fetch(
            `${getBaseUrl()}/api/data/mongodb?startDate=${startOfHour.toISOString()}&endDate=${endOfNextHour.toISOString()}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch initial data');
        }

        const data = await response.json();
        const filteredData = data
            .filter(item => item.temperature >= 0 && item.temperature <= 40)
            .map(item => ({
                time: new Date(item.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                value: item.temperature,
            }));

        // Fill missing minutes with null values
        const labels = Array.from({ length: 61 }, (_, i) => {
            const time = new Date(startOfHour.getTime() + i * 60 * 1000);
            return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        });

        const completeData = labels.map(label => {
            const existing = filteredData.find(item => item.time === label);
            return existing || { time: label, value: null };
        });

        temperatureData.value = completeData;
        updateChartData(temperatureData.value);
        loading.value = false;
    } catch (error) {
        console.error('Error fetching initial data:', error);
        error.value = 'Failed to load initial data';
        loading.value = false;
    }
};

// Update chart data
const updateChartData = (data) => {
    const labels = data.map(item => item.time);
    const values = data.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
    chartKey.value++;
};

// Handle new aggregated data from the socket
const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let totalTemp = 0;
    let sensorCount = 0;

    Object.values(data.sensors).forEach(sensor => {
        if (sensor.temperature && typeof sensor.temperature.avg === 'number') {
            totalTemp += sensor.temperature.avg;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgTemp = totalTemp / sensorCount;

        if (avgTemp >= 0 && avgTemp <= 40) {
            const existingIndex = temperatureData.value.findIndex(item => item.time === timeString);
            if (existingIndex !== -1) {
                // Update the value at the existing index
                temperatureData.value[existingIndex].value = avgTemp;
            } else {
                // Add a new entry
                temperatureData.value.push({ time: timeString, value: avgTemp });
            }

            // Reassign the array to itself to trigger reactivity
            temperatureData.value = [...temperatureData.value];

            updateChartData(temperatureData.value);
        }
    }
};

// Lifecycle hooks
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

.time-range-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.time-range-indicator {
    background: rgba(33, 150, 243, 0.2);
    color: #2196f3;
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

.temp-neutral {
    color: #a1a1aa;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
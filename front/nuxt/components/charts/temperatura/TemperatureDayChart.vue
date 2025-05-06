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
                    <div class="time-range-indicator">Last 7 days</div>
                    <div class="update-time">Last update: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Bar :key="chartKey" :data="chartData" :options="chartOptions" class="temperature-chart" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import { io } from 'socket.io-client';
import { getBaseUrl, getDadesGrafic } from '~/utils/communicationManager';
import { useRoute } from 'vue-router';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Reactive state
const temperatureData = ref([]);
const chartKey = ref(0);
const socket = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();

const props = defineProps({
    idAula: {
        type: Number,
        default: null
    }
});

// Chart data configuration
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Temperature (°C)',
            data: [],
            backgroundColor: 'rgba(33, 150, 243, 0.8)',
            borderColor: '#2196F3',
            borderWidth: 1,
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
                label: (context) => `Temperature: ${parseFloat(context.raw).toFixed(2)}°C`
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Days',
                color: '#9CA3AF',
                font: {
                    size: 12
                }
            },
            ticks: {
                color: '#9CA3AF',
                maxRotation: 45,
                minRotation: 45
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
    // Find the most recent valid temperature value
    const latestValidDataPoint = [...temperatureData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    
    return latestValidDataPoint?.value !== undefined 
        ? latestValidDataPoint.value 
        : null;
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
    const latestData = [...temperatureData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestData?.day || '--/--';
});

// Format date to short day format (e.g., "Mon 12")
const formatDayLabel = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return `${dayName} ${dayNumber}`;
};

const fetchInitialData = async () => {
    try {
        // Get the current date
        const now = new Date();
        
        // Calculate start date (7 days ago)
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6); // 7 days total including today
        startDate.setHours(0, 0, 0, 0);
        
        // End date is today
        const endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        
        // Get idAula from props or route
        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);
        
        // Use getDadesGrafic with 'dia' for daily data
        const data = await getDadesGrafic(
            'dia',
            'temperatura',
            idAula,
            startDate.toISOString(),
            endDate.toISOString()
        );
        
        // Process data from the API
        const filteredData = data
            .filter(item => item.average >= 0 && item.average <= 40)
            .map(item => ({
                day: formatDayLabel(new Date(item.dataIni)),
                value: item.average,
                date: new Date(item.dataIni)
            }));

        // Create day-by-day labels for the last 7 days
        const labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return formatDayLabel(date);
        });

        // Fill in missing data points
        const completeData = labels.map(label => {
            const existing = filteredData.find(item => item.day === label);
            return existing || { day: label, value: null, date: new Date(startDate.getTime() + labels.indexOf(label) * 24 * 60 * 60 * 1000) };
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
    const labels = data.map(item => item.day);
    const values = data.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
    chartKey.value++;
};

// Handle new aggregated data from the socket
const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors) return;

    const now = new Date();
    const todayLabel = formatDayLabel(now);

    // Calculate average temperature across all sensors
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
            // Find today in our data
            const dayIndex = temperatureData.value.findIndex(item => item.day === todayLabel);
            
            if (dayIndex !== -1) {
                // Update the temperature for today
                temperatureData.value[dayIndex].value = avgTemp;
                
                // Trigger reactivity
                temperatureData.value = [...temperatureData.value];
                
                updateChartData(temperatureData.value);
            }
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
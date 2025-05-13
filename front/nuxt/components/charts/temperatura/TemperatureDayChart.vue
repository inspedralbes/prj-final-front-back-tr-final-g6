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
                    <div class="temperature-range">
                        <span class="min-temperature">{{ minTemperature !== null ? parseFloat(minTemperature).toFixed(2)
                            : '--' }}°C</span>
                        <span class="range-separator">-</span>
                        <span class="max-temperature">{{ maxTemperature !== null ? parseFloat(maxTemperature).toFixed(2)
                            : '--' }}°C</span>
                    </div>
                    <div class="temperature-label">Current Temperature (Avg/Min/Max)</div>
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

            <!-- Legend Section -->
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color avg-color"></span>
                    <span class="legend-label">Average</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color max-color"></span>
                    <span class="legend-label">Maximum</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color min-color"></span>
                    <span class="legend-label">Minimum</span>
                </div>
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
const minTemperatureData = ref([]);
const maxTemperatureData = ref([]);
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
            label: 'Average Temperature (°C)',
            data: [],
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            borderWidth: 1,
        },
        {
            label: 'Maximum Temperature (°C)',
            data: [],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: '#EF4444',
            borderWidth: 1,
        },
        {
            label: 'Minimum Temperature (°C)',
            data: [],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 1,
        }
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
                label: (context) => {
                    const datasetLabel = context.dataset.label || '';
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)}°C`;
                }
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
    const latestValidDataPoint = [...temperatureData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const minTemperature = computed(() => {
    const latestValidDataPoint = [...minTemperatureData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const maxTemperature = computed(() => {
    const latestValidDataPoint = [...maxTemperatureData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
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

const formatDayLabel = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return {
        label: `${dayName} ${dayNumber}`,
        isWeekend: date.getDay() === 0 || date.getDay() === 6 // 0 = Domingo, 6 = Sábado
    };
};

const fetchInitialData = async () => {
    try {
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6); // 7 días atrás
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        const data = await getDadesGrafic(
            'dia',
            'temperatura',
            idAula,
            startDate.toISOString(),
            endDate.toISOString()
        );

        // Generar etiquetas y filtrar fines de semana
        const dayLabels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return formatDayLabel(date);
        });

        // Filtrar solo días laborables (no fines de semana)
        const weekdays = dayLabels.filter(day => !day.isWeekend);
        const weekdayDates = dayLabels
            .filter(day => !day.isWeekend)
            .map((_, i) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                return date;
            });

        // Procesar datos solo para días laborables
        const completeAvgData = weekdays.map((dayObj, index) => {
            const date = weekdayDates[index];
            const found = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate.getDate() === date.getDate() &&
                    itemDate.getMonth() === date.getMonth() &&
                    itemDate.getFullYear() === date.getFullYear();
            });

            return found ? {
                day: dayObj.label,
                value: found.average,
                date: date
            } : {
                day: dayObj.label,
                value: null,
                date: date
            };
        });

        const completeMinData = weekdays.map((dayObj, index) => {
            const date = weekdayDates[index];
            const found = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate.getDate() === date.getDate() &&
                    itemDate.getMonth() === date.getMonth() &&
                    itemDate.getFullYear() === date.getFullYear();
            });

            return found ? {
                day: dayObj.label,
                value: found.min,
                date: date
            } : {
                day: dayObj.label,
                value: null,
                date: date
            };
        });

        const completeMaxData = weekdays.map((dayObj, index) => {
            const date = weekdayDates[index];
            const found = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate.getDate() === date.getDate() &&
                    itemDate.getMonth() === date.getMonth() &&
                    itemDate.getFullYear() === date.getFullYear();
            });

            return found ? {
                day: dayObj.label,
                value: found.max,
                date: date
            } : {
                day: dayObj.label,
                value: null,
                date: date
            };
        });

        temperatureData.value = completeAvgData;
        minTemperatureData.value = completeMinData;
        maxTemperatureData.value = completeMaxData;
        updateChartData(temperatureData.value, minTemperatureData.value, maxTemperatureData.value);

        loading.value = false;
    } catch (err) {
        console.error('Error fetching initial data:', err);
        error.value = err.message || 'Failed to load initial data';
        loading.value = false;
    }
};

const updateChartData = (avgData, minData, maxData) => {
    const labels = avgData.map(item => item.day);
    const avgValues = avgData.map(item => item.value);
    const minValues = minData.map(item => item.value);
    const maxValues = maxData.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = avgValues;
    chartData.value.datasets[1].data = maxValues;
    chartData.value.datasets[2].data = minValues;
    chartKey.value++;
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors || data.timeSpan !== 'dia') return;

    const now = new Date();
    const todayLabel = formatDayLabel(now);

    // Calculate average, min, and max temperature across all sensors
    let totalTemp = 0;
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let sensorCount = 0;

    Object.values(data.sensors).forEach(sensor => {
        if (sensor.temperature && typeof sensor.temperature.avg === 'number') {
            totalTemp += sensor.temperature.avg;
            if (sensor.temperature.min < minTemp) minTemp = sensor.temperature.min;
            if (sensor.temperature.max > maxTemp) maxTemp = sensor.temperature.max;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgTemp = totalTemp / sensorCount;

        if (avgTemp >= 0 && avgTemp <= 40) {
            // Find today in our data
            const dayIndex = temperatureData.value.findIndex(item => item.day === todayLabel.label);

            if (dayIndex !== -1) {
                // Update all three datasets
                temperatureData.value[dayIndex].value = avgTemp;
                minTemperatureData.value[dayIndex].value = minTemp;
                maxTemperatureData.value[dayIndex].value = maxTemp;

                // Trigger reactivity
                temperatureData.value = [...temperatureData.value];
                minTemperatureData.value = [...minTemperatureData.value];
                maxTemperatureData.value = [...maxTemperatureData.value];

                updateChartData(temperatureData.value, minTemperatureData.value, maxTemperatureData.value);
            }
        }
    }
};

// Lifecycle hooks
onMounted(() => {
    fetchInitialData();

    try {
        const socketUrl = getBaseUrl().replace(/\/back$/, '');

        socket.value = io(socketUrl, {
        path: '/back/socket.io',
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
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

.temperature-range {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}

.min-temperature {
    color: #3B82F6;
    font-weight: 500;
}

.max-temperature {
    color: #EF4444;
    font-weight: 500;
}

.range-separator {
    color: #a1a1aa;
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
    background-color: #4CAF50;
}

.max-color {
    background-color: #EF4444;
}

.min-color {
    background-color: #3B82F6;
}

.legend-label {
    font-size: 0.8rem;
    color: #a1a1aa;
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
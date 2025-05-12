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
                        <span class="min-temp">{{ minTemperature !== null ? parseFloat(minTemperature).toFixed(2) : '--'
                            }}°C</span>
                        <span class="range-separator">-</span>
                        <span class="max-temp">{{ maxTemperature !== null ? parseFloat(maxTemperature).toFixed(2) : '--'
                            }}°C</span>
                    </div>
                    <div class="temperature-label">Current Temperature (Avg/Min/Max)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Last 24 hours</div>
                    <div class="update-time">Last update: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="temperature-chart" />
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
            fill: {
                target: 'origin',
                above: 'rgba(33, 150, 243, 0.1)',
                below: 'rgba(33, 150, 243, 0.1)'
            },
            borderColor: '#10B981',
            backgroundColor: '10B981',
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            borderWidth: 2
        },
        {
            label: 'Maximum Temperature (°C)',
            data: [],
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            pointBackgroundColor: '#EF4444',
            pointBorderColor: '#fff',
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            borderDash: [5, 5]
        },
        {
            label: 'Minimum Temperature (°C)',
            data: [],
            borderColor: '#2196F3',
            backgroundColor: '#2196F3',
            pointBackgroundColor: '#2196F3',
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
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)}°C`;
                }
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
    return temperatureData.value[temperatureData.value.length - 1]?.time || '--:--';
});

const fetchInitialData = async () => {
    try {
        // Get the current time
        const now = new Date();

        // Always start from the beginning of the current day
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(startOfDay.getDate() + 1);

        // Get idAula from props or route
        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        const data = await getDadesGrafic(
            'hora',
            'temperatura',
            idAula,
            startOfDay.toISOString(),
            endOfDay.toISOString()
        );
        console.log('API Response:', data);

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error("No se recibieron datos del servidor");
        }

        // Generate labels from 00:00 to 24:00
        const labels = Array.from({ length: 25 }, (_, i) => {
            if (i === 24) return '24:00';
            const time = new Date(startOfDay.getTime() + i * 60 * 60 * 1000);
            return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        });

        // Map received data to corresponding hours for avg, min, and max
        const completeAvgData = labels.map(label => {
            if (label === '24:00') {
                const midnightData = data.find(item => {
                    const itemHour = new Date(item.dataIni).getHours();
                    return itemHour === 23;
                });
                return midnightData ? {
                    time: '24:00',
                    value: midnightData.average
                } : {
                    time: '24:00',
                    value: null
                };
            }

            const hour = parseInt(label.split(':')[0]);
            const found = data.find(item => {
                const itemHour = new Date(item.dataIni).getHours();
                return itemHour === hour;
            });

            return found ? {
                time: label,
                value: found.average
            } : {
                time: label,
                value: null
            };
        });

        const completeMinData = labels.map(label => {
            if (label === '24:00') {
                const midnightData = data.find(item => {
                    const itemHour = new Date(item.dataIni).getHours();
                    return itemHour === 23;
                });
                return midnightData ? {
                    time: '24:00',
                    value: midnightData.min
                } : {
                    time: '24:00',
                    value: null
                };
            }

            const hour = parseInt(label.split(':')[0]);
            const found = data.find(item => {
                const itemHour = new Date(item.dataIni).getHours();
                return itemHour === hour;
            });

            return found ? {
                time: label,
                value: found.min
            } : {
                time: label,
                value: null
            };
        });

        const completeMaxData = labels.map(label => {
            if (label === '24:00') {
                const midnightData = data.find(item => {
                    const itemHour = new Date(item.dataIni).getHours();
                    return itemHour === 23;
                });
                return midnightData ? {
                    time: '24:00',
                    value: midnightData.max
                } : {
                    time: '24:00',
                    value: null
                };
            }

            const hour = parseInt(label.split(':')[0]);
            const found = data.find(item => {
                const itemHour = new Date(item.dataIni).getHours();
                return itemHour === hour;
            });

            return found ? {
                time: label,
                value: found.max
            } : {
                time: label,
                value: null
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
    const labels = avgData.map((item, index) =>
        index === avgData.length - 1 ? '24:00' : item.time
    );

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
    if (!data || !data.sensors || data.timeSpan !== 'hora') return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

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
            // Find the current hour in our data
            const hourIndex = temperatureData.value.findIndex(item => item.time === timeString);

            if (hourIndex !== -1) {
                // Update all three datasets
                temperatureData.value[hourIndex].value = avgTemp;
                minTemperatureData.value[hourIndex].value = minTemp;
                maxTemperatureData.value[hourIndex].value = maxTemp;

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

.temperature-range {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}

.min-temp {
    color: #10B981;
    font-weight: 500;
}

.max-temp {
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
    background-color: #10B981;
}

.max-color {
    background-color: #EF4444;
}

.min-color {
    background-color: #2196F3;
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
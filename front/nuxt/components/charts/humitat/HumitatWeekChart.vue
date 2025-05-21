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
                    <div class="humidity-label">Humitat Actual (Mitjana/Mínima/Màxima)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Últimes 4 setmanes</div>
                    <div class="update-time">Última actualització: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Bar :key="chartKey" :data="chartData" :options="chartOptions" class="humidity-chart" />
            </div>

            <!-- Legend Section -->
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color avg-color"></span>
                    <span class="legend-label">Mitjana</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color max-color"></span>
                    <span class="legend-label">Màxima</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color min-color"></span>
                    <span class="legend-label">Mínima</span>
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

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Humitat Mitjana (%)',
            data: [],
            backgroundColor: '#10B981',
            borderColor: '#10B981',
            borderWidth: 1,
        },
        {
            label: 'Humitat Màxima (%)',
            data: [],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: '#EF4444',
            borderWidth: 1,
        },
        {
            label: 'Humitat Mínima (%)',
            data: [],
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            borderWidth: 1,
        }
    ],
});

// Chart options
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    indexAxis: 'y', // Horizontal bars
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
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)}%`;
                }
            }
        }
    },
    scales: {
        x: {
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
        },
        y: {
            title: {
                display: true,
                text: 'Setmanes',
                color: '#9CA3AF',
                font: {
                    size: 12
                }
            },
            ticks: {
                color: '#9CA3AF'
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
    if (hum === null || hum === undefined) return 'humidity-neutral';
    if (hum < 30) return 'humidity-low';
    if (hum < 50) return 'humidity-medium-low';
    if (hum < 70) return 'humidity-medium';
    if (hum < 90) return 'humidity-high';
    return 'humidity-extreme';
});

const lastUpdateTime = computed(() => {
    const latestData = [...humidityData.value]
        .reverse()
        .find(dataPoint => dataPoint.value?.avg !== null && dataPoint.value?.avg !== undefined);
    return latestData?.weekLabel || '--/--';
});

const formatWeekLabel = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startDay = startDate.getDate();
    const startMonth = monthNames[startDate.getMonth()];
    const endDay = endDate.getDate();
    const endMonth = monthNames[endDate.getMonth()];

    return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
};

const fetchInitialData = async () => {
    try {
        loading.value = true;
        const now = new Date();

        // Calculate start date (4 weeks ago)
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 28); // 4 weeks * 7 days
        startDate.setHours(0, 0, 0, 0);

        // End date is today
        const endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        // Get weekly data for the last 4 weeks
        const data = await getDadesGrafic(
            'setmana',
            'humitat',
            idAula,
            startDate.toISOString(),
            endDate.toISOString()
        );

        // Create array for the last 4 weeks
        const weeks = Array.from({ length: 4 }, (_, i) => {
            const weekStart = new Date(startDate);
            weekStart.setDate(weekStart.getDate() + (i * 7));
            return {
                weekStart,
                weekLabel: formatWeekLabel(weekStart)
            };
        });

        // Map API data to our weeks
        const completeData = weeks.map(week => {
            const weekEnd = new Date(week.weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            // Find data point that falls within this week
            const dataPoint = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate >= week.weekStart && itemDate <= weekEnd;
            });

            return {
                weekLabel: week.weekLabel,
                value: dataPoint ? {
                    avg: dataPoint.average,
                    min: dataPoint.min,
                    max: dataPoint.max
                } : null,
                date: week.weekStart
            };
        });

        // Ensure we only keep exactly 4 weeks
        humidityData.value = completeData.slice(0, 4);
        updateChartData(humidityData.value);
        loading.value = false;
    } catch (err) {
        console.error('Error fetching weekly data:', err);
        error.value = err.message || 'Failed to load weekly data';
        loading.value = false;
    }
};

const updateChartData = (data) => {
    // Reverse the array to show most recent week at top
    const reversedData = [...data].reverse();
    chartData.value.labels = reversedData.map(item => item.weekLabel);
    chartData.value.datasets[0].data = reversedData.map(item => item.value?.avg || null);
    chartData.value.datasets[1].data = reversedData.map(item => item.value?.max || null);
    chartData.value.datasets[2].data = reversedData.map(item => item.value?.min || null);
    chartKey.value++;
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors || data.timeSpan !== 'setmana') return;

    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    const currentWeekLabel = formatWeekLabel(currentWeekStart);

    // Calculate average, min and max humidity across all sensors
    let totalHum = 0;
    let minHum = Infinity;
    let maxHum = -Infinity;
    let sensorCount = 0;

    Object.values(data.sensors).forEach(sensor => {
        if (sensor.humidity && typeof sensor.humidity.avg === 'number') {
            totalHum += sensor.humidity.avg;
            if (sensor.humidity.min < minHum) minHum = sensor.humidity.min;
            if (sensor.humidity.max > maxHum) maxHum = sensor.humidity.max;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgHum = totalHum / sensorCount;

        if (avgHum >= 0 && avgHum <= 100) {
            // Find current week in our data
            const weekIndex = humidityData.value.findIndex(
                item => item.weekLabel === currentWeekLabel
            );

            if (weekIndex !== -1) {
                humidityData.value[weekIndex].value = {
                    avg: avgHum,
                    min: minHum,
                    max: maxHum
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
    color: #2196F3;
    font-weight: 500;
}

.max-humidity {
    color: #EF4444;
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

/* Humidity color classes */
.humidity-low {
    color: #34d399;
    /* Green for low humidity */
}

.humidity-medium-low {
    color: #60a5fa;
    /* Blue for medium-low humidity */
}

.humidity-medium {
    color: #fbbf24;
    /* Yellow for medium humidity */
}

.humidity-high {
    color: #f97316;
    /* Orange for high humidity */
}

.humidity-extreme {
    color: #f87171;
    /* Red for extreme humidity */
}

.humidity-neutral {
    color: #a1a1aa;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
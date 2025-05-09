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
                <div class="volume-display">
                    <div class="current-volume" :class="volumeColorClass">
                        {{ currentVolume !== null ? parseFloat(currentVolume.avg).toFixed(2) : '--' }}dB
                    </div>
                    <div class="volume-range">
                        <span class="min-volume">{{ currentVolume?.min !== undefined ?
                            parseFloat(currentVolume.min).toFixed(2) : '--' }}dB</span>
                        <span class="range-separator">-</span>
                        <span class="max-volume">{{ currentVolume?.max !== undefined ?
                            parseFloat(currentVolume.max).toFixed(2) : '--' }}dB</span>
                    </div>
                    <div class="volume-label">Current Volume (Avg/Min/Max)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Last 4 weeks</div>
                    <div class="update-time">Last update: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Bar :key="chartKey" :data="chartData" :options="chartOptions" class="volume-chart" />
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
const volumeData = ref([]);
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
            label: 'Average Volume (dB)',
            data: [],
            backgroundColor: '#10B981',
            borderColor: '#10B981',
            borderWidth: 1,
        },
        {
            label: 'Maximum Volume (dB)',
            data: [],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: '#EF4444',
            borderWidth: 1,
        },
        {
            label: 'Minimum Volume (dB)',
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
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)}dB`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Volume (dB)',
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
                text: 'Weeks',
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

const currentVolume = computed(() => {
    const latestValidDataPoint = [...volumeData.value]
        .reverse()
        .find(dataPoint => dataPoint.value?.avg !== null && dataPoint.value?.avg !== undefined);

    return latestValidDataPoint?.value || null;
});

const volumeColorClass = computed(() => {
    const vol = currentVolume.value?.avg;
    if (vol === null || vol === undefined) return 'volume-neutral';
    if (vol < 30) return 'volume-low';
    if (vol < 60) return 'volume-medium';
    if (vol < 80) return 'volume-high';
    return 'volume-extreme';
});

const lastUpdateTime = computed(() => {
    const latestData = [...volumeData.value]
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
            'volum',
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
        volumeData.value = completeData.slice(0, 4);
        updateChartData(volumeData.value);
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

    // Calculate average, min and max volume across all sensors
    let totalVol = 0;
    let minVol = Infinity;
    let maxVol = -Infinity;
    let sensorCount = 0;

    Object.values(data.sensors).forEach(sensor => {
        if (sensor.volume && typeof sensor.volume.avg === 'number') {
            totalVol += sensor.volume.avg;
            if (sensor.volume.min < minVol) minVol = sensor.volume.min;
            if (sensor.volume.max > maxVol) maxVol = sensor.volume.max;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgVol = totalVol / sensorCount;

        if (avgVol >= 0 && avgVol <= 100) {
            // Find current week in our data
            const weekIndex = volumeData.value.findIndex(
                item => item.weekLabel === currentWeekLabel
            );

            if (weekIndex !== -1) {
                volumeData.value[weekIndex].value = {
                    avg: avgVol,
                    min: minVol,
                    max: maxVol
                };
                volumeData.value = [...volumeData.value];
                updateChartData(volumeData.value);
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

.volume-display {
    display: flex;
    flex-direction: column;
}

.current-volume {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
}

.volume-range {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}

.min-volume {
    color: #2196F3;
    font-weight: 500;
}

.max-volume {
    color: #EF4444;
    font-weight: 500;
}

.range-separator {
    color: #a1a1aa;
}

.volume-label {
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

.volume-chart {
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

/* Volume color classes */
.volume-low {
    color: #34d399;
}

.volume-medium {
    color: #fbbf24;
}

.volume-high {
    color: #f97316;
}

.volume-extreme {
    color: #f87171;
}

.volume-neutral {
    color: #a1a1aa;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
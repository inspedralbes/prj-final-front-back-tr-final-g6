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
                        {{ currentVolume !== null ? parseFloat(currentVolume).toFixed(2) : '--' }} dB
                    </div>
                    <div class="volume-range">
                        <span class="min-volume">{{ minVolume !== null ? parseFloat(minVolume).toFixed(2) : '--' }} dB</span>
                        <span class="range-separator">-</span>
                        <span class="max-volume">{{ maxVolume !== null ? parseFloat(maxVolume).toFixed(2) : '--' }} dB</span>
                    </div>
                    <div class="volume-label">Current Course Volume (Avg/Min/Max)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Last 4 courses</div>
                    <div class="update-time">Last update: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="volume-chart" />
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
    PointElement,
    Filler
} from 'chart.js';
import { io } from 'socket.io-client';
import { getBaseUrl, getDadesGrafic } from '~/utils/communicationManager';
import { useRoute } from 'vue-router';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

// Reactive state
const volumeData = ref([]);
const minVolumeData = ref([]);
const maxVolumeData = ref([]);
const chartKey = ref(0);
const socket = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const lastDataFetchTime = ref(null);

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
            label: 'Average Volume (dB)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(76, 175, 80, 0.1)',
                below: 'rgba(76, 175, 80, 0.1)'
            },
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            borderWidth: 2
        },
        {
            label: 'Maximum Volume (dB)',
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
            label: 'Minimum Volume (dB)',
            data: [],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)} dB`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Academic Course',
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
        }
    }
});

const currentVolume = computed(() => {
    const latestValidDataPoint = [...volumeData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const minVolume = computed(() => {
    const validData = minVolumeData.value.filter(d => d.value !== null && d.value !== undefined);
    return validData.length > 0 ? Math.min(...validData.map(d => d.value)) : null;
});

const maxVolume = computed(() => {
    const validData = maxVolumeData.value.filter(d => d.value !== null && d.value !== undefined);
    return validData.length > 0 ? Math.max(...validData.map(d => d.value)) : null;
});

const volumeColorClass = computed(() => {
    const vol = currentVolume.value;
    if (vol === null) return 'vol-neutral';
    if (vol < 30) return 'vol-low';
    if (vol < 50) return 'vol-moderate';
    if (vol < 70) return 'vol-high';
    return 'vol-extreme';
});

const lastUpdateTime = computed(() => {
    return new Date().toLocaleDateString('es-ES');
});

const fetchInitialData = async () => {
    try {
        loading.value = true;
        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-indexed

        const courses = [];

        for (let i = 3; i >= 0; i--) {
            const startYear = currentMonth >= 7 ? currentYear - i : currentYear - i - 1;
            const endYear = startYear + 1;
            const label = `${String(startYear).slice(2)}-${String(endYear).slice(2)}`;

            const startDate = new Date(startYear, 8, 1); // September 1st
            const endDate = new Date(endYear, 5, 24, 23, 59, 59, 999); // June 24th

            const data = await getDadesGrafic(
                'curs',
                'volum',
                idAula,
                startDate.toISOString(),
                endDate.toISOString()
            );

            // Calculate average, min and max for the course
            let avg = null;
            let min = null;
            let max = null;

            if (data?.length) {
                const validData = data.filter(d => d.average !== null && d.min !== null && d.max !== null);
                if (validData.length > 0) {
                    avg = validData.reduce((sum, item) => sum + item.average, 0) / validData.length;
                    min = Math.min(...validData.map(item => item.min));
                    max = Math.max(...validData.map(item => item.max));
                }
            }

            courses.push({
                label,
                avg,
                min,
                max,
                startDate,
                endDate
            });
        }

        // Update chart data
        chartData.value.labels = courses.map(c => c.label);
        chartData.value.datasets[0].data = courses.map(c => c.avg);
        chartData.value.datasets[1].data = courses.map(c => c.max);
        chartData.value.datasets[2].data = courses.map(c => c.min);
        chartKey.value++;

        // Update volume data references
        volumeData.value = courses.map(c => ({
            label: c.label,
            value: c.avg,
            date: c.startDate
        }));

        minVolumeData.value = courses.map(c => ({
            label: c.label,
            value: c.min,
            date: c.startDate
        }));

        maxVolumeData.value = courses.map(c => ({
            label: c.label,
            value: c.max,
            date: c.startDate
        }));

        lastDataFetchTime.value = new Date();
        loading.value = false;
    } catch (err) {
        console.error('Error fetching course data:', err);
        error.value = err.message || 'Failed to load course data';
        loading.value = false;
    }
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors || data.timeSpan !== 'curs') return;

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
            // Get current course label
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const startYear = currentMonth >= 7 ? currentYear : currentYear - 1;
            const endYear = startYear + 1;
            const currentCourseLabel = `${String(startYear).slice(2)}-${String(endYear).slice(2)}`;

            // Find current course in our data
            const courseIndex = volumeData.value.findIndex(
                item => item.label === currentCourseLabel
            );

            if (courseIndex !== -1) {
                // Update all three datasets
                volumeData.value[courseIndex].value = avgVol;
                minVolumeData.value[courseIndex].value = minVol;
                maxVolumeData.value[courseIndex].value = maxVol;

                // Trigger reactivity
                volumeData.value = [...volumeData.value];
                minVolumeData.value = [...minVolumeData.value];
                maxVolumeData.value = [...maxVolumeData.value];

                // Update chart data
                chartData.value.datasets[0].data[courseIndex] = avgVol;
                chartData.value.datasets[1].data[courseIndex] = maxVol;
                chartData.value.datasets[2].data[courseIndex] = minVol;
                chartKey.value++;
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

    onBeforeUnmount(() => {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    });
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
    color: #4CAF50;
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
    background-color: #4CAF50;
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
.vol-low {
    color: #4CAF50;
}

.vol-moderate {
    color: #FFC107;
}

.vol-high {
    color: #FF9800;
}

.vol-extreme {
    color: #F44336;
}

.vol-neutral {
    color: #a1a1aa;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
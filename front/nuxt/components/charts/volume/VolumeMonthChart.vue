<template>
    <div class="dashboard-container">
        <div v-if="loading" class="loading-overlay">
            <div class="loading-message">Carregant dades...</div>
        </div>

        <div v-else-if="error" class="error-overlay">
            <div class="error-message">{{ error }}</div>
        </div>

        <div v-else class="dashboard-content">
            <!-- Secció de Capçalera -->
            <div class="dashboard-header">
                <div class="volume-display">
                    <div class="current-volume" :class="volumeColorClass">
                        {{ currentVolume !== null ? parseFloat(currentVolume).toFixed(2) : '--' }}dB
                    </div>
                    <div class="volume-range">
                        <span class="min-volume">{{ minVolume !== null ? parseFloat(minVolume).toFixed(2) : '--' }}dB</span>
                        <span class="range-separator">-</span>
                        <span class="max-volume">{{ maxVolume !== null ? parseFloat(maxVolume).toFixed(2) : '--' }}dB</span>
                    </div>
                    <div class="volume-label">Volum Actual (Mitjana/Mínim/Màxim)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Últims 12 mesos</div>
                    <div class="update-time">Última actualització: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Secció del Gràfic -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="volume-chart" />
            </div>

            <!-- Llegenda del Gràfic -->
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
    labels: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
    datasets: [
        {
            label: 'Volum Mitjà (dB)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(76, 175, 80, 0.1)',
                below: 'rgba(76, 175, 80, 0.1)'
            },
            borderColor: '#4CAF50',
            backgroundColor: '#4CAF50',
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            borderWidth: 2
        },
        {
            label: 'Volum Màxim (dB)',
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
            label: 'Volum Mínim (dB)',
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
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)}dB`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Mes',
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
                text: 'Volum (dB)',
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
    const latestValidDataPoint = [...minVolumeData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const maxVolume = computed(() => {
    const latestValidDataPoint = [...maxVolumeData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const volumeColorClass = computed(() => {
    const vol = currentVolume.value;
    if (vol === null) return 'volume-neutral';
    if (vol < 30) return 'volume-low';
    if (vol < 60) return 'volume-medium';
    if (vol < 80) return 'volume-high';
    return 'volume-extreme';
});

const lastUpdateTime = computed(() => {
    const latestData = [...volumeData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestData?.monthLabel || '--/--';
});

const formatMonthLabel = (date) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return monthNames[date.getMonth()];
};

const fetchInitialData = async () => {
    try {
        const now = new Date();

        // Check if we already fetched data this month
        if (lastDataFetchTime.value &&
            new Date(lastDataFetchTime.value).getMonth() === now.getMonth() &&
            new Date(lastDataFetchTime.value).getFullYear() === now.getFullYear()) {
            return; // Already fetched data this month
        }

        loading.value = true;
        const currentYear = now.getFullYear();

        // Create array for all months of the current year
        const months = Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(currentYear, i, 1); // January to December
            return {
                monthDate,
                monthLabel: formatMonthLabel(monthDate)
            };
        });

        // Calculate date range for API call (full year)
        const startDate = new Date(currentYear, 0, 1); // January 1st
        const endDate = new Date(currentYear, 11, 31); // December 31st

        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        // Get monthly data for the entire year
        const data = await getDadesGrafic(
            'mes',
            'volum',
            idAula,
            startDate.toISOString(),
            endDate.toISOString()
        );

        // Map API data to our months for avg, min and max
        const completeAvgData = months.map(month => {
            const monthEnd = new Date(month.monthDate);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0); // Last day of month

            // Find data point that falls within this month
            const dataPoint = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate >= month.monthDate && itemDate <= monthEnd;
            });

            return {
                monthLabel: month.monthLabel,
                value: dataPoint?.average || null,
                date: month.monthDate
            };
        });

        const completeMinData = months.map(month => {
            const monthEnd = new Date(month.monthDate);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0); // Last day of month

            // Find data point that falls within this month
            const dataPoint = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate >= month.monthDate && itemDate <= monthEnd;
            });

            return {
                monthLabel: month.monthLabel,
                value: dataPoint?.min || null,
                date: month.monthDate
            };
        });

        const completeMaxData = months.map(month => {
            const monthEnd = new Date(month.monthDate);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0); // Last day of month

            // Find data point that falls within this month
            const dataPoint = data.find(item => {
                const itemDate = new Date(item.dataIni);
                return itemDate >= month.monthDate && itemDate <= monthEnd;
            });

            return {
                monthLabel: month.monthLabel,
                value: dataPoint?.max || null,
                date: month.monthDate
            };
        });

        volumeData.value = completeAvgData;
        minVolumeData.value = completeMinData;
        maxVolumeData.value = completeMaxData;
        updateChartData(volumeData.value, minVolumeData.value, maxVolumeData.value);
        lastDataFetchTime.value = new Date(); // Update last fetch time
        loading.value = false;
    } catch (err) {
        console.error('Error fetching monthly data:', err);
        error.value = err.message || 'Failed to load monthly data';
        loading.value = false;
    }
};

const updateChartData = (avgData, minData, maxData) => {
    chartData.value.datasets[0].data = avgData.map(item => item.value);
    chartData.value.datasets[1].data = maxData.map(item => item.value);
    chartData.value.datasets[2].data = minData.map(item => item.value);
    chartKey.value++;
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors || data.timeSpan !== 'mes') return;

    const now = new Date();
    const currentMonthLabel = formatMonthLabel(now);

    // Only process if we're in a new month since last fetch
    if (lastDataFetchTime.value &&
        new Date(lastDataFetchTime.value).getMonth() === now.getMonth() &&
        new Date(lastDataFetchTime.value).getFullYear() === now.getFullYear()) {
        return;
    }

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
            // Find current month in our data
            const monthIndex = volumeData.value.findIndex(
                item => item.monthLabel === currentMonthLabel
            );

            if (monthIndex !== -1) {
                // Update all three datasets
                volumeData.value[monthIndex].value = avgVol;
                minVolumeData.value[monthIndex].value = minVol;
                maxVolumeData.value[monthIndex].value = maxVol;

                // Trigger reactivity
                volumeData.value = [...volumeData.value];
                minVolumeData.value = [...minVolumeData.value];
                maxVolumeData.value = [...maxVolumeData.value];

                updateChartData(volumeData.value, minVolumeData.value, maxVolumeData.value);
            }
        }
    }
};

const checkForMonthChange = () => {
    const now = new Date();
    if (!lastDataFetchTime.value ||
        new Date(lastDataFetchTime.value).getMonth() !== now.getMonth() ||
        new Date(lastDataFetchTime.value).getFullYear() !== now.getFullYear()) {
        fetchInitialData();
    }
};

onMounted(() => {
    fetchInitialData();

    // Set up interval to check for month change once per day
    const monthCheckInterval = setInterval(checkForMonthChange, 86400000); // 24 hours

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
        clearInterval(monthCheckInterval);
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
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
                        {{ currentHumidity !== null ? parseFloat(currentHumidity).toFixed(2) : '--' }}%
                    </div>
                    <div class="humidity-range">
                        <span class="min-humidity">{{ minHumidity !== null ? parseFloat(minHumidity).toFixed(2) : '--'
                            }}%</span>
                        <span class="range-separator">-</span>
                        <span class="max-humidity">{{ maxHumidity !== null ? parseFloat(maxHumidity).toFixed(2) : '--'
                            }}%</span>
                    </div>
                    <div class="humidity-label">Current Humidity (Avg/Min/Max)</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Last 12 months</div>
                    <div class="update-time">Last update: {{ lastUpdateTime }}</div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="humidity-chart" />
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
const humidityData = ref([]);
const minHumidityData = ref([]);
const maxHumidityData = ref([]);
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
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
        {
            label: 'Average Humidity (%)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(75, 192, 192, 0.1)',
                below: 'rgba(75, 192, 192, 0.1)'
            },
            borderColor: '#4bc0c0',
            backgroundColor: '#4bc0c0',
            pointBackgroundColor: '#4bc0c0',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            borderWidth: 2
        },
        {
            label: 'Maximum Humidity (%)',
            data: [],
            borderColor: '#ff9f40',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            pointBackgroundColor: '#ff9f40',
            pointBorderColor: '#fff',
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            borderDash: [5, 5]
        },
        {
            label: 'Minimum Humidity (%)',
            data: [],
            borderColor: '#9966ff',
            backgroundColor: '#9966ff',
            pointBackgroundColor: '#9966ff',
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
                    return `${datasetLabel}: ${parseFloat(context.raw).toFixed(2)}%`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Month',
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
                text: 'Humidity (%)',
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

const currentHumidity = computed(() => {
    const latestValidDataPoint = [...humidityData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const minHumidity = computed(() => {
    const latestValidDataPoint = [...minHumidityData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const maxHumidity = computed(() => {
    const latestValidDataPoint = [...maxHumidityData.value]
        .reverse()
        .find(dataPoint => dataPoint.value !== null && dataPoint.value !== undefined);
    return latestValidDataPoint?.value !== undefined ? latestValidDataPoint.value : null;
});

const humidityColorClass = computed(() => {
    const hum = currentHumidity.value;
    if (hum === null) return 'humidity-neutral';
    if (hum < 30) return 'humidity-low';
    if (hum < 60) return 'humidity-optimal';
    if (hum < 70) return 'humidity-medium';
    return 'humidity-high';
});

const lastUpdateTime = computed(() => {
    const latestData = [...humidityData.value]
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
            'humitat',
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

        humidityData.value = completeAvgData;
        minHumidityData.value = completeMinData;
        maxHumidityData.value = completeMaxData;
        updateChartData(humidityData.value, minHumidityData.value, maxHumidityData.value);
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
            // Find current month in our data
            const monthIndex = humidityData.value.findIndex(
                item => item.monthLabel === currentMonthLabel
            );

            if (monthIndex !== -1) {
                // Update all three datasets
                humidityData.value[monthIndex].value = avgHum;
                minHumidityData.value[monthIndex].value = minHum;
                maxHumidityData.value[monthIndex].value = maxHum;

                // Trigger reactivity
                humidityData.value = [...humidityData.value];
                minHumidityData.value = [...minHumidityData.value];
                maxHumidityData.value = [...maxHumidityData.value];

                updateChartData(humidityData.value, minHumidityData.value, maxHumidityData.value);
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
    color: #9966ff;
    font-weight: 500;
}

.max-humidity {
    color: #ff9f40;
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
    background: rgba(75, 192, 192, 0.2);
    color: #4bc0c0;
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
    background-color: #4bc0c0;
}

.max-color {
    background-color: #ff9f40;
}

.min-color {
    background-color: #9966ff;
}

.legend-label {
    font-size: 0.8rem;
    color: #a1a1aa;
}

/* Humidity color classes */
.humidity-low {
    color: #60a5fa;
    /* Azul para humedad baja */
}

.humidity-optimal {
    color: #34d399;
    /* Verde para humedad óptima */
}

.humidity-medium {
    color: #fbbf24;
    /* Amarillo para humedad media */
}

.humidity-high {
    color: #f87171;
    /* Rojo para humedad alta */
}

.humidity-neutral {
    color: #a1a1aa;
}

/* Chart.js overrides */
:deep(.chartjs-render-monitor) {
    animation: none !important;
}
</style>
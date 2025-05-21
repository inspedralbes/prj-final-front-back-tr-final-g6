<template>
    <div class="dashboard-container">
        <div v-if="loading" class="loading-overlay">
            <div class="loading-message">Carregant dades...</div>
        </div>

        <div v-else-if="error" class="error-overlay">
            <div class="error-message">{{ error }}</div>
        </div>

        <div v-else class="dashboard-content">
            <!-- Secció de capçalera -->
            <div class="dashboard-header">
                <div class="volume-display">
                    <div class="current-volume" :class="volumeColorClass">
                        {{ currentVolume !== null ? parseFloat(currentVolume).toFixed(2) : '--' }} dB
                    </div>
                    <div class="volume-label">Volum actual</div>
                </div>

                <div class="time-range-info">
                    <div class="time-range-indicator">Últims 60 minuts</div>
                    <div class="update-time">Última actualització: {{ new Date().toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) }}
                    </div>
                </div>
            </div>

            <!-- Secció del gràfic -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="volume-chart" />
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
const chartKey = ref(0);
const socket = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
let currentHour = new Date().getHours(); // Stores current hour

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
            label: 'Volume (dB)',
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
                label: (context) => `Volume: ${parseFloat(context.raw).toFixed(2)} dB`
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
                    // Show only every 5th minute and the last value
                    const time = this.getLabelForValue(value);
                    const minutes = parseInt(time.split(':')[1], 10);
                    if (index === values.length - 1) {
                        // Ensure the last value shows the full hour (e.g., 13:00 instead of 12:59)
                        const lastHour = parseInt(time.split(':')[0], 10) + (minutes === 59 ? 1 : 0);
                        return `${lastHour.toString().padStart(2, '0')}:00`;
                    }
                    return minutes % 5 === 0 ? time : '';
                }
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

const currentVolume = ref(null);

const volumeColorClass = computed(() => {
    const vol = currentVolume.value;
    if (vol === null) return 'vol-neutral';
    if (vol < 30) return 'vol-low';
    if (vol < 60) return 'vol-medium';
    if (vol < 80) return 'vol-high';
    return 'vol-very-high';
});

const lastUpdateTime = computed(() => {
    return volumeData.value[volumeData.value.length - 1]?.time || '--:--';
});

const fetchInitialData = async () => {
    try {
        const now = new Date();

        // Calculate start and end of current hour
        const startOfHour = new Date(now);
        startOfHour.setMinutes(0, 0, 0); // Start of current hour (e.g., 11:00:00)
        const endOfHour = new Date(startOfHour);
        endOfHour.setMinutes(59, 59, 999); // End of current hour (e.g., 11:59:59)

        // Format dates to 'YYYY-MM-DD HH:mm:ss'
        const formatDate = (date) => {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust to local time
            return localDate.toISOString().slice(0, 19).replace('T', ' ');
        };

        const dataIni = formatDate(startOfHour);
        const dataFi = formatDate(endOfHour);

        console.log('Fetching data from:', dataIni, 'to:', dataFi);

        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        const data = await getDadesGrafic(
            'minut',
            'volum',
            idAula,
            dataIni,
            dataFi
        );

        console.log('API response data:', data);

        // Generate labels for the entire current hour time range
        const labels = [];
        for (let i = 0; i < 60; i++) {
            const label = new Date(startOfHour.getTime() + i * 60000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            labels.push(label);
        }

        // Map received data to generated labels
        const values = labels.map(label => {
            const dataPoint = data.find(item => {
                const itemTime = new Date(item.dataIni).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return itemTime === label;
            });
            return dataPoint ? dataPoint.average : null; // Fill with null if no data
        });

        console.log('Generated labels:', labels);
        console.log('Aligned values:', values);

        // Update chart data
        chartData.value.labels = labels;
        chartData.value.datasets[0].data = values;
        chartKey.value++;

        // Update current volume
        const lastValue = values.filter(value => value !== null).pop();
        currentVolume.value = lastValue !== undefined ? lastValue : null;

        loading.value = false;
    } catch (err) {
        console.error('Error fetching initial data:', err);
        error.value = 'Error loading initial data';
        loading.value = false;
    }
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let totalVolume = 0;
    let sensorCount = 0;

    // Calculate average volume from sensors
    Object.values(data.sensors).forEach(sensor => {
        if (sensor.volume && typeof sensor.volume.avg === 'number') {
            totalVolume += sensor.volume.avg;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgVolume = totalVolume / sensorCount;

        if (avgVolume >= 0 && avgVolume <= 100) {
            currentVolume.value = avgVolume;

            // Find position of label corresponding to current minute
            const labelIndex = chartData.value.labels.indexOf(timeString);

            if (labelIndex !== -1) {
                // If label exists, update corresponding value
                chartData.value.datasets[0].data[labelIndex] = avgVolume;
            } else {
                // If label doesn't exist, add it at the end
                chartData.value.labels.push(timeString);
                chartData.value.datasets[0].data.push(avgVolume);

                // Keep only the last 60 points
                if (chartData.value.labels.length > 60) {
                    chartData.value.labels.shift(); // Remove first element
                    chartData.value.datasets[0].data.shift(); // Remove first value
                }
            }

            chartKey.value++; // Force chart update
        }
    }
};

const checkForHourChange = () => {
    const now = new Date();
    const newHour = now.getHours();

    if (newHour !== currentHour) {
        currentHour = newHour; // Update current hour
        console.log('Hour change detected. Updating chart...');
        fetchInitialData(); // Update chart data and labels
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

        // Start interval to check for hour changes
        const hourChangeInterval = setInterval(checkForHourChange, 60000); // Check every minute

        // Clean up interval when component unmounts
        onBeforeUnmount(() => {
            clearInterval(hourChangeInterval);
            if (socket.value) {
                socket.value.disconnect();
                socket.value = null;
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
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
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

/* Volume color classes */
.vol-low {
    color: #4CAF50;
}

.vol-medium {
    color: #FFC107;
}

.vol-high {
    color: #FF9800;
}

.vol-very-high {
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
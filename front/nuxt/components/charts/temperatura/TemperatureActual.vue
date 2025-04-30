<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full h-full relative">
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
                <div class="text-white text-lg">Loading data...</div>
            </div>

            <div v-else-if="error" class="absolute inset-0 flex items-center justify-center">
                <div class="text-red-400 text-lg">{{ error }}</div>
            </div>

            <div v-else class="flex flex-col h-full">
                <!-- Current Temperature Value Display -->
                <div class="mb-4 text-center">
                    <div class="text-6xl font-bold" :class="{
                        'text-blue-400': currentTemperature < 20,
                        'text-green-400': currentTemperature >= 20 && currentTemperature < 30,
                        'text-orange-400': currentTemperature >= 30 && currentTemperature < 35,
                        'text-red-400': currentTemperature >= 35
                    }">
                        {{ currentTemperature }}°C
                    </div>
                    <div class="text-teal-400 text-sm">Current Temperature</div>
                </div>

                <!-- Sensor Info -->
                <div class="text-center mb-4">
                    <span class="text-gray-400 text-sm">Sensor ID: {{ sensorId || 'Not available' }}</span>
                    <span class="text-gray-400 text-sm ml-4">Last update: {{ lastUpdate }}</span>
                </div>

                <!-- Chart Container -->
                <div class="flex-1 relative flex items-center justify-center">
                    <!-- Line Chart -->
                    <div class="w-full h-[350px]">
                        <Line :data="chartData" :options="chartOptions" :key="lineChartKey" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Line } from 'vue-chartjs';
import { getBaseUrl } from '~/utils/communicationManager';
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

// Register ChartJS components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
);

// Component state
const loading = ref(true);
const error = ref(null);
const socket = ref(null);
const currentTemperature = ref(0);
const sensorId = ref(null);
const lastUpdate = ref('--:--');
const recentTemperatures = ref([]);
const lineChartKey = ref(0);

// Chart configurations
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Temperature (°C)',
            data: [],
            fill: {
                target: 'origin',
                above: 'rgba(33, 150, 243, 0.2)',
                below: 'rgba(33, 150, 243, 0.2)'
            },
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            pointBackgroundColor: '#2196F3',
            pointBorderColor: '#fff',
            pointRadius: 0,
            pointHoverRadius: 6,
            tension: 0.2,
            borderWidth: 2
        },
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
                label: (context) => `Temperature: ${context.raw}°C`
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#9CA3AF',
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 8
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            }
        },
        y: {
            min: 0,
            max: 40,
            ticks: {
                color: '#9CA3AF',
                stepSize: 5
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            },
            title: {
                display: true,
                text: 'Temperature (°C)',
                color: '#9CA3AF'
            }
        }
    },
    elements: {
        line: {
            borderWidth: 3
        },
    }
});

// Socket connection and data handling
onMounted(() => {
    try {
        const socketUrl = getBaseUrl();
        console.log('Connecting to socket at:', socketUrl);
        socket.value = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.value.on('newRawData', (data) => {
            console.log('Received data via socket:', JSON.stringify(data, null, 2));

            if (data && data.temperature !== undefined) {
                const tempValue = typeof data.temperature === 'string'
                    ? parseFloat(data.temperature)
                    : data.temperature;

                if (!isNaN(tempValue)) {
                    currentTemperature.value = tempValue;
                    sensorId.value = data.id_sensor;

                    const date = new Date(data.date);
                    lastUpdate.value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                    addTemperatureDataPoint(tempValue, lastUpdate.value);
                    
                    console.log('Updated data: Temperature =', currentTemperature.value, 'Sensor =', sensorId.value);
                }
            }
        });

        socket.value.on('connect', () => {
            loading.value = false;
            error.value = null;
            console.log('Connected to socket server with ID:', socket.value.id);
        });

        socket.value.on('connect_error', (err) => {
            loading.value = false;
            error.value = 'Connection error with server';
            console.error('Socket connection error:', err);
        });

        socket.value.on('disconnect', (reason) => {
            console.log('Disconnected from server. Reason:', reason);
            if (reason === 'io server disconnect') {
                socket.value.connect();
            }
        });
    } catch (err) {
        loading.value = false;
        error.value = 'Error initializing connection';
        console.error('Error initializing socket connection:', err);
    }
});

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
    }
});

// Data handling functions
function addTemperatureDataPoint(temp, timestamp) {
    recentTemperatures.value.push({
        time: timestamp,
        value: temp
    });

    if (recentTemperatures.value.length > 100) {
        recentTemperatures.value.shift();
    }

    chartData.value = {
        ...chartData.value,
        labels: recentTemperatures.value.map(item => item.time),
        datasets: [
            {
                ...chartData.value.datasets[0],
                data: recentTemperatures.value.map(item => item.value)
            }
        ]
    };

    lineChartKey.value++;
}
</script>

<style scoped>
.w-full.h-full {
    position: relative;
}

.text-6xl {
    font-size: 3.75rem;
    line-height: 1;
    transition: color 0.5s ease;
}
</style>
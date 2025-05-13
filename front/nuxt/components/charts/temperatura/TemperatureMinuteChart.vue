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
                    <div class="time-range-indicator">Last 60 minutes</div>
                    <div class="update-time">Last update: {{ new Date().toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) }}
                    </div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <Line :key="chartKey" :data="chartData" :options="chartOptions" class="temperature-chart" />
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
const chartKey = ref(0);
const socket = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
let currentHour = new Date().getHours(); // Almacena la hora actual

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
            fill: {
                target: 'origin',
                above: 'rgba(33, 150, 243, 0.1)',
                below: 'rgba(33, 150, 243, 0.1)'
            },
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            pointBackgroundColor: '#2196F3',
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
                label: (context) => `Temperature: ${parseFloat(context.raw).toFixed(2)}°C`
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

const currentTemperature = ref(null);

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
        const now = new Date();

        // Calcular el inicio y el final de la hora actual
        const startOfHour = new Date(now);
        startOfHour.setMinutes(0, 0, 0); // Inicio de la hora actual (e.g., 11:00:00)
        const endOfHour = new Date(startOfHour);
        endOfHour.setMinutes(59, 59, 999); // Final de la hora actual (e.g., 11:59:59)

        // Formatear las fechas al formato 'YYYY-MM-DD HH:mm:ss'
        const formatDate = (date) => {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Ajustar al horario local
            return localDate.toISOString().slice(0, 19).replace('T', ' ');
        };

        const dataIni = formatDate(startOfHour);
        const dataFi = formatDate(endOfHour);

        console.log('Obteniendo datos desde:', dataIni, 'hasta:', dataFi);

        const idAula = props.idAula || (route.params.id ? Number(route.params.id) : 1);

        const data = await getDadesGrafic(
            'minut',
            'temperatura',
            idAula,
            dataIni,
            dataFi
        );

        console.log('Datos recibidos de la API:', data);

        // Generar etiquetas para toda la franja horaria actual
        const labels = [];
        for (let i = 0; i < 60; i++) {
            const label = new Date(startOfHour.getTime() + i * 60000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            labels.push(label);
        }

        // Mapear los datos recibidos a las etiquetas generadas
        const values = labels.map(label => {
            const dataPoint = data.find(item => {
                const itemTime = new Date(item.dataIni).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return itemTime === label;
            });
            return dataPoint ? dataPoint.average : null; // Rellenar con null si no hay datos
        });

        console.log('Etiquetas generadas:', labels);
        console.log('Valores alineados:', values);

        // Actualizar los datos del gráfico
        chartData.value.labels = labels;
        chartData.value.datasets[0].data = values;
        chartKey.value++;

        // Actualizar la temperatura actual
        const lastValue = values.filter(value => value !== null).pop();
        currentTemperature.value = lastValue !== undefined ? lastValue : null;

        loading.value = false;
    } catch (error) {
        console.error('Error al obtener los datos iniciales:', error);
        error.value = 'Error al cargar los datos iniciales';
        loading.value = false;
    }
};

// Update chart data
const updateChartData = (data) => {
    const labels = data.map(item => item.time);
    const values = data.map(item => item.value);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = values;
    chartKey.value++;
};

const handleNewAggregatedData = (data) => {
    if (!data || !data.sensors) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let totalTemp = 0;
    let sensorCount = 0;

    // Calcular el promedio de temperatura de los sensores
    Object.values(data.sensors).forEach(sensor => {
        if (sensor.temperature && typeof sensor.temperature.avg === 'number') {
            totalTemp += sensor.temperature.avg;
            sensorCount++;
        }
    });

    if (sensorCount > 0) {
        const avgTemp = totalTemp / sensorCount;

        if (avgTemp >= 0 && avgTemp <= 40) {
            currentTemperature.value = avgTemp;

            // Buscar la posición de la etiqueta correspondiente al minuto actual
            const labelIndex = chartData.value.labels.indexOf(timeString);

            if (labelIndex !== -1) {
                // Si la etiqueta ya existe, actualiza el valor correspondiente
                chartData.value.datasets[0].data[labelIndex] = avgTemp;
            } else {
                // Si la etiqueta no existe, agregarla al final
                chartData.value.labels.push(timeString);
                chartData.value.datasets[0].data.push(avgTemp);

                // Mantener solo los últimos 60 puntos
                if (chartData.value.labels.length > 60) {
                    chartData.value.labels.shift(); // Eliminar el primer elemento
                    chartData.value.datasets[0].data.shift(); // Eliminar el primer valor
                }
            }

            chartKey.value++; // Forzar la actualización del gráfico
        }
    }
};

const checkForHourChange = () => {
    const now = new Date();
    const newHour = now.getHours();

    if (newHour !== currentHour) {
        currentHour = newHour; // Actualiza la hora actual
        console.log('Cambio de franja horaria detectado. Actualizando gráfico...');
        fetchInitialData(); // Actualiza los datos y las etiquetas del gráfico
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

        // Inicia un intervalo para verificar el cambio de franja horaria
        const hourChangeInterval = setInterval(checkForHourChange, 60000); // Verifica cada minuto

        // Limpia el intervalo al desmontar el componente
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
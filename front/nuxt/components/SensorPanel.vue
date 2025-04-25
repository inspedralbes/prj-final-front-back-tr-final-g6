<template>
    <div class="min-h-screen bg-slate-800 flex flex-col">
        <!-- Custom Header Component -->
        <Header />

        <!-- Main Content -->
        <div v-if="loading" class="text-center text-white py-4">
            Carregant...
        </div>

        <div class="flex-grow w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
            <!-- Tabs for Sensor Types -->
            <div class="flex border-b border-slate-600">
                <button @click="activeTab = 'active'"
                    :class="{ 'border-b-2 border-teal-500 text-teal-400': activeTab === 'active', 'text-slate-400': activeTab !== 'active' }"
                    class="px-4 py-2 font-medium">
                    Sensores Activos
                </button>
                <button @click="activeTab = 'pending'"
                    :class="{ 'border-b-2 border-teal-500 text-teal-400': activeTab === 'pending', 'text-slate-400': activeTab !== 'pending' }"
                    class="px-4 py-2 font-medium">
                    Sensores Pendientes
                </button>
                <button @click="activeTab = 'banned'"
                    :class="{ 'border-b-2 border-teal-500 text-teal-400': activeTab === 'banned', 'text-slate-400': activeTab !== 'banned' }"
                    class="px-4 py-2 font-medium">
                    Sensores Bannejats
                </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 justify-center">
                <button @click="navigateToMapas"
                    class="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Veure Mapes
                </button>

                <button @click="navigateToAulas"
                    class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5" />
                    </svg>
                    Configurar Aules
                </button>
            </div>

            <!-- Active Sensors List -->
            <div v-if="activeTab === 'active'" class="space-y-6">
                <div v-for="sensor in filteredActiveSensors" :key="sensor.idSensor"
                    class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-all duration-300">
                    <div class="p-6 cursor-pointer" @click="sensor.showDetails = !sensor.showDetails">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-white">{{ sensor.nombre || `Sensor ${sensor.mac}` }}
                                </h2>
                                <div class="flex items-center mt-1">
                                    <span class="text-sm text-teal-400">{{ sensor.ubicacion || 'Ubicació no definida'
                                        }}</span>
                                    <span v-if="sensor.idAula" class="mx-2 text-slate-400">•</span>
                                    <span v-if="sensor.idAula" class="text-sm text-slate-300">{{
                                        getAulaName(sensor.idAula) }}</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="h-3 w-3 rounded-full mr-2 bg-green-500"></div>
                                <span class="text-green-400 text-sm">Actiu</span>
                            </div>
                        </div>

                        <!-- Sensor Details (same as banned sensors) -->
                        <div v-if="sensor.showDetails" class="mt-6 space-y-4" @click.stop>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-slate-400">ID:</p>
                                    <p class="text-lg text-white">{{ sensor.idSensor }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">MAC:</p>
                                    <p class="text-lg text-white">{{ sensor.mac }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Nom:</p>
                                    <p class="text-lg text-white">{{ sensor.nombre || 'No disponible' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Ubicació:</p>
                                    <p class="text-lg text-white">{{ sensor.ubicacion || 'No definida' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada X:</p>
                                    <p class="text-lg text-white">{{ sensor.x }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada Y:</p>
                                    <p class="text-lg text-white">{{ sensor.y }}</p>
                                </div>
                                <div v-if="sensor.idAula">
                                    <p class="text-sm text-slate-400">Aula assignada:</p>
                                    <p class="text-lg text-white">{{ getAulaName(sensor.idAula) }}</p>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-3 pt-4">
                                <button @click.stop="handleBanSensor(sensor)"
                                    class="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    Bannejar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Sensors List -->
            <div v-if="activeTab === 'pending'" class="space-y-6">
                <div v-for="sensor in filteredPendingSensors" :key="sensor.idSensor"
                    class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-all duration-300">
                    <div class="p-6 cursor-pointer" @click="sensor.showDetails = !sensor.showDetails">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-white">{{ sensor.nombre || `Sensor ${sensor.mac}` }}
                                </h2>
                                <div class="flex items-center mt-1">
                                    <span class="text-sm text-teal-400">{{ sensor.ubicacion || 'Ubicació no definida'
                                        }}</span>
                                    <span v-if="sensor.idAula" class="mx-2 text-slate-400">•</span>
                                    <span v-if="sensor.idAula" class="text-sm text-slate-300">{{
                                        getAulaName(sensor.idAula) }}</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="h-3 w-3 rounded-full mr-2 bg-green-500"></div>
                                <span class="text-green-400 text-sm">Actiu</span>
                            </div>
                        </div>

                        <!-- Sensor Details -->
                        <div v-if="sensor.showDetails" class="mt-6 space-y-4" @click.stop>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-slate-400">ID:</p>
                                    <p class="text-lg text-white">{{ sensor.idSensor }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">MAC:</p>
                                    <p class="text-lg text-white">{{ sensor.mac }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Nom:</p>
                                    <p class="text-lg text-white">{{ sensor.nombre || 'No disponible' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Ubicació:</p>
                                    <p class="text-lg text-white">{{ sensor.ubicacion || 'No definida' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada X:</p>
                                    <p class="text-lg text-white">{{ sensor.x }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada Y:</p>
                                    <p class="text-lg text-white">{{ sensor.y }}</p>
                                </div>
                                <div v-if="sensor.idAula">
                                    <p class="text-sm text-slate-400">Aula assignada:</p>
                                    <p class="text-lg text-white">{{ getAulaName(sensor.idAula) }}</p>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-3 pt-4">
                                <button @click.stop="acceptPendingSensor(sensor)"
                                    class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Acceptar
                                </button>
                                <button @click.stop="handleBanPendingSensor(sensor)"
                                    class="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Bannejar
                                </button>
                                <button @click.stop="handleDeletePendingSensor(sensor.idSensor)"
                                    class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Banned Sensors List -->
            <div v-if="activeTab === 'banned'" class="space-y-6">
                <div v-for="sensor in filteredBannedSensors" :key="sensor.idSensor"
                    class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-all duration-300">
                    <div class="p-6 cursor-pointer" @click="sensor.showDetails = !sensor.showDetails">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-white">{{ sensor.nombre || `Sensor ${sensor.mac}` }}
                                </h2>
                                <div class="flex items-center mt-1">
                                    <span class="text-sm text-teal-400">{{ sensor.ubicacion || 'Ubicació no definida'
                                        }}</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="h-3 w-3 rounded-full mr-2 bg-red-500"></div>
                                <span class="text-red-400 text-sm">Bannejat</span>
                            </div>
                        </div>

                        <!-- Sensor Details (same as active sensors) -->
                        <div v-if="sensor.showDetails" class="mt-6 space-y-4" @click.stop>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-slate-400">ID:</p>
                                    <p class="text-lg text-white">{{ sensor.idSensor }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">MAC:</p>
                                    <p class="text-lg text-white">{{ sensor.mac }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Nom:</p>
                                    <p class="text-lg text-white">{{ sensor.nombre || 'No disponible' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Ubicació:</p>
                                    <p class="text-lg text-white">{{ sensor.ubicacion || 'No definida' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada X:</p>
                                    <p class="text-lg text-white">{{ sensor.x }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada Y:</p>
                                    <p class="text-lg text-white">{{ sensor.y }}</p>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-3 pt-4">
                                <button @click.stop="handleBanSensor(sensor)"
                                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    Desbannejar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
    getNewsensors,
    acceptSensor,
    deletePendingSensor,
    updateSensor,
    banPendingSensor,
    getBannedSensors,
    getAllSensors,
    banSensor
} from '~/utils/communicationManager';
import { getTotesAulas } from '~/utils/communicationManager';

const router = useRouter();
const activeSensors = ref([]);
const pendingSensors = ref([]);
const bannedSensors = ref([]);
const aulas = ref([]);
const activeTab = ref('active');
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const [sensorsData, aulasData, bannedData] = await Promise.all([
            getAllSensors(),
            getTotesAulas(),
            getBannedSensors()
        ]);

        // Process active sensors (non-banned)
        activeSensors.value = sensorsData
            .filter(sensor => !bannedData.some(banned => banned.idSensor === sensor.idSensor))
            .map(sensor => ({
                ...sensor,
                showDetails: false,
                banned: false
            }));

        // Process pending sensors (from newsensor table)
        const pendingData = await getNewsensors(); // Already filtered by backend
        pendingSensors.value = pendingData.map(sensor => ({
            ...sensor,
            showDetails: false
        }));

        // Process banned sensors (combine with sensor details)
        bannedSensors.value = bannedData.map(banned => {
            const sensorDetails = sensorsData.find(s => s.idSensor === banned.idSensor);
            return {
                ...banned,
                ...sensorDetails,
                showDetails: false,
                banned: true
            };
        });

        aulas.value = aulasData;
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar los datos: ' + error.message);
    } finally {
        loading.value = false;
    }
});

const filteredActiveSensors = computed(() => {
    return activeSensors.value;
});

const filteredPendingSensors = computed(() => {
    return pendingSensors.value;
});

const filteredBannedSensors = computed(() => {
    return bannedSensors.value;
});

const getAulaName = (aulaId) => {
    const aula = aulas.value.find(a => a.id === aulaId);
    return aula ? `${aula.id} - ${aula.Curs}` : 'No assignada';
};

const toggleDetails = (sensor) => {
    sensor.showDetails = !sensor.showDetails;
};

const handleBanSensor = async (sensor) => {
    try {
        await banSensor(sensor.idSensor, !sensor.banned);
        sensor.banned = !sensor.banned;

        // Move sensor between active and banned lists
        if (sensor.banned) {
            activeSensors.value = activeSensors.value.filter(s => s.idSensor !== sensor.idSensor);
            bannedSensors.value.push(sensor);
        } else {
            bannedSensors.value = bannedSensors.value.filter(s => s.idSensor !== sensor.idSensor);
            activeSensors.value.push(sensor);
        }

        alert(sensor.banned ? 'Sensor bannejat' : 'Sensor desbannejat');
    } catch (error) {
        console.error('Error banning sensor:', error);
        alert('Error al bannejar el sensor: ' + error.message);
    }
};

const acceptPendingSensor = async (sensor) => {
    try {
        await acceptSensor(sensor.idSensor);
        pendingSensors.value = pendingSensors.value.filter(s => s.idSensor !== sensor.idSensor);
        alert('Sensor acceptat correctament');

        // Refresh active sensors list
        const sensorsData = await getAllSensors();
        activeSensors.value = sensorsData
            .filter(s => !bannedSensors.value.some(banned => banned.idSensor === s.idSensor))
            .map(s => ({
                ...s,
                showDetails: false,
                banned: false
            }));
    } catch (error) {
        console.error('Error accepting sensor:', error);
        alert('Error al acceptar el sensor: ' + error.message);
    }
};

const handleBanPendingSensor = async (sensor) => {
    try {
        await banPendingSensor(sensor.idSensor, true);
        pendingSensors.value = pendingSensors.value.filter(s => s.idSensor !== sensor.idSensor);
        bannedSensors.value.push({
            ...sensor,
            banned: true,
            showDetails: false
        });
        alert('Sensor bannejat correctament');
    } catch (error) {
        console.error('Error banning pending sensor:', error);
        alert('Error al bannejar el sensor: ' + error.message);
    }
};

const handleDeletePendingSensor = async (id) => {
    if (confirm('Estàs segur que vols eliminar aquest sensor?')) {
        try {
            await deletePendingSensor(id);
            pendingSensors.value = pendingSensors.value.filter(sensor => sensor.idSensor !== id);
            alert('Sensor eliminat correctament');
        } catch (error) {
            console.error('Error deleting sensor:', error);
            alert('Error al eliminar el sensor: ' + error.message);
        }
    }
};

const navigateToMapas = () => {
    router.push('/mapas');
};

const navigateToAulas = () => {
    router.push('/admin');
};
</script>

<style scoped>
.custom-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: none;
}

.custom-select:focus {
    box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
}
</style>
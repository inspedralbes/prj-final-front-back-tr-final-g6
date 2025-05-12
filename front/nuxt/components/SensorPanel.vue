<template>
    <div class="min-h-screen bg-slate-800 flex flex-col">
        <!-- Custom Header Component -->
        <Header />

        <!-- Confirmation Popup -->
        <div v-if="showConfirmationPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-white mb-4">Confirmació</h2>
                    <p class="text-slate-400 mb-6">{{ confirmationMessage }}</p>
                    <div class="flex justify-end gap-3">
                        <button @click="closeConfirmationPopup"
                            class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all">
                            Tancar
                        </button>
                        <button @click="executeConfirmationAction"
                            class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all">
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div v-if="loading" class="text-center text-white py-4">
            Carregant...
        </div>

        <!-- Edit Sensor Modal -->
        <div v-if="showEditModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-white mb-6">Editar Sensor</h2>

                    <form @submit.prevent="submitEditForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">Nom</label>
                            <input v-model="editForm.nombre" type="text"
                                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">Ubicació</label>
                            <input v-model="editForm.ubicacion" type="text"
                                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-400 mb-1">Coordenada X</label>
                                <input v-model.number="editForm.x" type="number"
                                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-400 mb-1">Coordenada Y</label>
                                <input v-model.number="editForm.y" type="number"
                                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">Aula</label>
                            <select v-model="editForm.idAula"
                                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                                <option :value="null">No assignada</option>
                                <option v-for="aula in aulas" :key="aula.id" :value="aula.id">
                                    {{ aula.id }} - {{ aula.Curs }}
                                </option>
                            </select>
                        </div>

                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showEditModal = false"
                                class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all">
                                Cancel·lar
                            </button>
                            <button type="submit"
                                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all">
                                Guardar Canvis
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-white mb-6">Confirmar Eliminació</h2>
                    <p class="text-slate-400 mb-6">
                        Estàs segur que vols eliminar el sensor
                        <span class="text-white font-bold">{{ sensorToDelete?.nombre || `Sensor ${sensorToDelete?.mac}`
                            }}</span>?
                    </p>
                    <div class="flex justify-end gap-3">
                        <button @click="showDeleteModal = false"
                            class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all">
                            Cancel·lar
                        </button>
                        <button @click="confirmDeleteSensor"
                            class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
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
                <button @click="activeTab = 'settings'"
                    :class="{ 'border-b-2 border-teal-500 text-teal-400': activeTab === 'settings', 'text-slate-400': activeTab !== 'settings' }"
                    class="px-4 py-2 font-medium">
                    Configurar Sensors
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
                                    <p class="text-sm text-slate-400">IP:</p>
                                    <p class="text-lg text-white">{{ sensor.ip || 'No disponible' }}</p>
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
                                <button @click.stop="handleEditSensor(sensor)"
                                    class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Editar
                                </button>
                                <button @click.stop="handleDeleteSensor(sensor)"
                                    class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Eliminar
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
                                <div class="h-3 w-3 rounded-full mr-2 bg-yellow-500"></div>
                                <span class="text-yellow-400 text-sm">Pendent</span>
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
                                    <p class="text-sm text-slate-400">IP:</p>
                                    <p class="text-lg text-white">{{ sensor.ip || 'No disponible' }}</p>
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
                                    <p class="text-lg text-white">{{ sensor.x || 'No disponible' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Coordenada Y:</p>
                                    <p class="text-lg text-white">{{ sensor.y || 'No disponible' }}</p>
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
                                <button @click.stop="handleRejectPendingSensor(sensor)"
                                    class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Rebutjar
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
                                <button @click.stop="handleUnbanSensor(sensor)"
                                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    Desbannejar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings Tab -->
            <div v-if="activeTab === 'settings'" class="space-y-6">
                <ConfigurarSensors v-if="activeTab === 'settings'" />
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
    banSensor,
    deleteSensor,
    updateSensorById,
    updateSensorStatus,
    unbanSensor
} from '~/utils/communicationManager';
import { getTotesAulas } from '~/utils/communicationManager';
import ConfigurarSensors from '~/components/ConfigurarSensors.vue';

const router = useRouter();
const activeSensors = ref([]);
const pendingSensors = ref([]);
const bannedSensors = ref([]);
const aulas = ref([]);
const activeTab = ref('active');
const loading = ref(false);

// Edit modal state
const showEditModal = ref(false);
const editForm = ref({
    idSensor: null,
    nombre: '',
    ubicacion: '',
    x: 0,
    y: 0,
    idAula: null
});
const currentEditingSensor = ref(null);

const handleEditSensor = (sensor) => {
    currentEditingSensor.value = sensor;
    editForm.value = {
        idSensor: sensor.idSensor,
        nombre: sensor.nombre || '',
        ubicacion: sensor.ubicacion || '',
        x: sensor.x || 0,
        y: sensor.y || 0,
        idAula: sensor.idAula || null
    };
    showEditModal.value = true;
};

const submitEditForm = async () => {
    try {
        await updateSensorById(editForm.value.idSensor, {
            nombre: editForm.value.nombre,
            ubicacion: editForm.value.ubicacion,
            x: editForm.value.x,
            y: editForm.value.y,
            idAula: editForm.value.idAula
        });

        // Actualizar el sensor en la lista correspondiente
        const updateSensorInList = (list) => {
            const index = list.value.findIndex(s => s.idSensor === editForm.value.idSensor);
            if (index !== -1) {
                list.value[index] = { ...list.value[index], ...editForm.value };
            }
        };

        updateSensorInList(activeSensors);
        updateSensorInList(pendingSensors);
        updateSensorInList(bannedSensors);

        showEditModal.value = false;
        alert('Sensor actualitzat correctament');
    } catch (error) {
        console.error('Error al actualizar el sensor:', error);
        alert('Error al actualizar el sensor: ' + error.message);
    }
};

const showDeleteModal = ref(false);
const sensorToDelete = ref(null);

const handleDeleteSensor = (sensor) => {
    sensorToDelete.value = sensor;
    showDeleteModal.value = true;
};

const confirmDeleteSensor = async () => {
    try {
        await deleteSensor(sensorToDelete.value.idSensor);
        activeSensors.value = activeSensors.value.filter(s => s.idSensor !== sensorToDelete.value.idSensor);
        showDeleteModal.value = false;
    } catch (error) {
        console.error('Error al eliminar el sensor:', error);
        alert('Error al eliminar el sensor: ' + error.message);
    }
};

onMounted(async () => {
    loading.value = true;
    try {
        const [sensorsData, aulasData, bannedData, pendingData, newsensorsData] = await Promise.all([
            getAllSensors(),
            getTotesAulas(),
            getBannedSensors(),
            getNewsensors(),
            getNewsensors()
        ]);

        activeSensors.value = sensorsData.map(sensor => {
            const newsensor = newsensorsData.find(n => n.idSensor === sensor.idSensor);
            return {
                ...sensor,
                ip: newsensor?.ip_sensor || sensor.ip || 'No disponible',
                showDetails: false,
                banned: false
            };
        });

        pendingSensors.value = pendingData.map(sensor => {
            const sensorDetails = sensorsData.find(s => s.idSensor === sensor.idSensor) || {};
            return {
                ...sensorDetails,
                ...sensor,
                ip: sensor.ip_sensor || sensorDetails.ip || 'No disponible',
                showDetails: false
            };
        });

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

// Popup state
const showConfirmationPopup = ref(false);
const confirmationMessage = ref('');
let confirmationAction = null;

const openConfirmationPopup = (message, action) => {
    confirmationMessage.value = message;
    confirmationAction = action;
    showConfirmationPopup.value = true;
};

const closeConfirmationPopup = () => {
    showConfirmationPopup.value = false;
    confirmationMessage.value = '';
    confirmationAction = null;
};

const executeConfirmationAction = () => {
    if (confirmationAction) {
        confirmationAction();
    }
    closeConfirmationPopup();
};

// Updated action handlers
const handleBanSensor = (sensor) => {
    openConfirmationPopup('Estàs segur que vols bannejar aquest sensor?', async () => {
        try {
            await banSensor(sensor.idSensor, true);
            activeSensors.value = activeSensors.value.filter(s => s.idSensor !== sensor.idSensor);
            bannedSensors.value.push({ ...sensor, banned: true, showDetails: false });
        } catch (error) {
            console.error('Error banning sensor:', error);
        }
    });
};

const handleUnbanSensor = (sensor) => {
    openConfirmationPopup('Estàs segur que vols desbannejar aquest sensor?', async () => {
        try {
            await unbanSensor(sensor.idSensor);
            bannedSensors.value = bannedSensors.value.filter(s => s.idSensor !== sensor.idSensor);
            pendingSensors.value.push({ ...sensor, banned: false, showDetails: false });
        } catch (error) {
            console.error('Error unbanning sensor:', error);
        }
    });
};

const acceptPendingSensor = (sensor) => {
    openConfirmationPopup('Estàs segur que vols acceptar aquest sensor?', async () => {
        try {
            await updateSensorStatus(sensor.idSensor, 'accept');
            pendingSensors.value = pendingSensors.value.filter(s => s.idSensor !== sensor.idSensor);
            activeSensors.value.push({ ...sensor, banned: false, showDetails: false });
        } catch (error) {
            console.error('Error accepting sensor:', error);
        }
    });
};

const handleRejectPendingSensor = (sensor) => {
    openConfirmationPopup('Estàs segur que vols rebutjar aquest sensor?', async () => {
        try {
            await updateSensorStatus(sensor.idSensor, 'reject');
            pendingSensors.value = pendingSensors.value.filter(s => s.idSensor !== sensor.idSensor);
            bannedSensors.value.push({ ...sensor, banned: true, showDetails: false });
        } catch (error) {
            console.error('Error rejecting sensor:', error);
        }
    });
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
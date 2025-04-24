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
                    <div class="p-6 cursor-pointer" @click="sensor.showDetailsActive = !sensor.showDetailsActive">
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
                                <div class="h-3 w-3 rounded-full mr-2"
                                    :class="{ 'bg-green-500': !sensor.banned, 'bg-red-500': sensor.banned }"></div>
                                <span :class="{ 'text-green-400': !sensor.banned, 'text-red-400': sensor.banned }"
                                    class="text-sm">
                                    {{ sensor.banned ? 'Bannejat' : 'Actiu' }}
                                </span>
                            </div>
                        </div>

                        <!-- Mostrar detalles del sensor -->
                        <div v-if="sensor.showDetailsActive" class="mt-6 space-y-4" @click.stop>
                            <template v-if="!sensor.editing">
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
                                    <button @click.stop="startEditing(sensor)"
                                        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </button>
                                    <button @click.stop="handleBanSensor(sensor)" class="px-5 py-2.5"
                                        :class="{ 'bg-yellow-600 hover:bg-yellow-700': !sensor.banned, 'bg-green-600 hover:bg-green-700': sensor.banned }">
                                        {{ sensor.banned ? 'Desbannejar' : 'Bannejar' }}
                                    </button>
                                </div>
                            </template>
                            <form v-else @submit.prevent="saveEdit(sensor)" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Nom:</label>
                                        <input v-model="editData.nombre" type="text" placeholder="Nom del sensor"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">MAC:</label>
                                        <input v-model="editData.mac" type="text" placeholder="Adreça MAC" disabled
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Aula:</label>
                                        <select v-model="editData.idAula"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all">
                                            <option :value="null">No assignada</option>
                                            <option v-for="aula in aulas" :key="aula.id" :value="aula.id">
                                                {{ aula.id }} - {{ aula.Curs }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Ubicació:</label>
                                        <input v-model="editData.ubicacion" type="text" placeholder="Ubicació"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Coordenada
                                            X:</label>
                                        <input v-model="editData.x" type="number" placeholder="Coordenada X"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Coordenada
                                            Y:</label>
                                        <input v-model="editData.y" type="number" placeholder="Coordenada Y"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-3 pt-4">
                                    <button type="submit"
                                        class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        Guardar
                                    </button>
                                    <button type="button" @click.stop="cancelEdit(sensor)"
                                        class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        Cancel·lar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Sensors List -->
            <div v-if="activeTab === 'pending'" class="space-y-6">
                <div v-for="sensor in filteredPendingSensors" :key="sensor.idSensor"
                    class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-all duration-300">
                    <div class="p-6 cursor-pointer" @click="toggleDetails(sensor)">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-white">{{ sensor.mac }}</h2>
                                <div class="flex items-center mt-1">
                                    <span class="text-sm text-slate-300">IP: {{ sensor.ip_sensor || 'No disponible'
                                        }}</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="h-3 w-3 rounded-full mr-2"
                                    :class="{ 'bg-green-500': sensor.accepted, 'bg-yellow-500': !sensor.accepted }">
                                </div>
                                <span
                                    :class="{ 'text-green-400': sensor.accepted, 'text-yellow-400': !sensor.accepted }"
                                    class="text-sm">
                                    {{ sensor.accepted ? 'Acceptat' : 'Pendent' }}
                                </span>
                            </div>
                        </div>

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
                                    <p class="text-lg text-white">{{ sensor.ip_sensor || 'No disponible' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Estat:</p>
                                    <p class="text-lg text-white">{{ sensor.accepted ? 'Acceptat' : 'Pendent' }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-400">Bannejat:</p>
                                    <p class="text-lg text-white">{{ sensor.banned ? 'Sí' : 'No' }}</p>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-3 pt-4">
                                <button v-if="!sensor.accepted" @click.stop="acceptPendingSensor(sensor)"
                                    class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all flex items-center">
                                    Acceptar
                                </button>
                                <button @click.stop="handleBanPendingSensor(sensor)" class="px-5 py-2.5"
                                    :class="{ 'bg-yellow-600 hover:bg-yellow-700': !sensor.banned, 'bg-green-600 hover:bg-green-700': sensor.banned }">
                                    {{ sensor.banned ? 'Desbannejar' : 'Bannejar' }}
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

            <div v-if="activeTab === 'banned'" class="space-y-6">
                <div v-for="sensor in filteredBannedSensors" :key="sensor.idSensor"
                    class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-all duration-300">
                    <div class="p-6 cursor-pointer" @click="sensor.showDetailsBanned = !sensor.showDetailsBanned">
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

                        <!-- Mostrar detalles del sensor -->
                        <div v-if="sensor.showDetailsBanned" class="mt-6 space-y-4" @click.stop>
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
                                    class="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    {{ sensor.banned ? 'Desbannejar' : 'Bannejar' }}
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
    getAllSensors
} from '~/utils/communicationManager';
import { getTotesAulas } from '~/utils/communicationManager';

const router = useRouter();
const activeSensors = ref([]);
const pendingSensors = ref([]);
const aulas = ref([]);
const activeTab = ref('active');

onMounted(async () => {
    try {
        // Cargar datos en paralelo
        const [newsensorsData, aulasData, bannedSensorsData] = await Promise.all([
            getNewsensors(),
            getTotesAulas(),
            getBannedSensors(),
            getAllSensors()
        ]);

        // Filtrar y formatear sensores activos
        activeSensors.value = formatSensors(
            newsensorsData.filter(sensor => !sensor.banned) // Excluir sensores baneados
        );

        // Formatear y asignar sensores pendientes
        pendingSensors.value = formatSensors(newsensorsData);

        // Asignar aulas
        aulas.value = aulasData;

        // Formatear y asignar sensores baneados
        activeSensors.value = activeSensors.value.concat(
            bannedSensorsData.map(sensor => ({
                ...sensor,
                showDetailsBanned: false
            }))
        );
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar datos: ' + error.message);
    }
});

const formatSensors = (sensors) => {
    return sensors.map(sensor => ({
        ...sensor,
        showDetailsActive: false, // Para la pestaña de sensores activos
        showDetailsBanned: false  // Para la pestaña de sensores baneados
    }));
};

const filteredActiveSensors = computed(() => {
    return activeSensors.value.filter(sensor => sensor.accepted === 0 && sensor.banned === 0);
});

const filteredPendingSensors = computed(() => {
    return pendingSensors.value;
});

const filteredBannedSensors = computed(() => {
    return activeSensors.value.filter(sensor => sensor.banned); // Only show banned sensors
});
const getAulaName = (aulaId) => {
    const aula = aulas.value.find(a => a.id === aulaId);
    return aula ? `${aula.id} - ${aula.Curs}` : 'No assignada';
};

const toggleDetails = (sensor) => sensor.showDetails = !sensor.showDetails;
const editData = ref({});

const startEditing = (sensor) => {
    sensor.editing = true;
    editData.value = { ...sensor };
};

const cancelEdit = (sensor) => {
    sensor.editing = false;
    editData.value = {};
};

const saveEdit = async (sensor) => {
    try {
        // Update the sensor object
        Object.assign(sensor, {
            nombre: editData.value.nombre,
            mac: editData.value.mac,
            ubicacion: editData.value.ubicacion,
            idAula: editData.value.idAula,
            x: editData.value.x,
            y: editData.value.y
        });

        // Send update to server
        await updateSensor({
            MAC: sensor.mac,
            nombre: editData.value.nombre,
            ubicacion: editData.value.ubicacion,
            x: editData.value.x,
            y: editData.value.y
        });

        sensor.editing = false;
        editData.value = {};
        alert('Sensor actualitzat correctament');
    } catch (error) {
        console.error('Error en actualitzar el sensor:', error.message);
        alert('Error al actualizar el sensor: ' + error.message);
    }
};

const handleBanSensor = async (sensor) => {
    try {
        await banSensor(sensor.idSensor, !sensor.banned);
        sensor.banned = !sensor.banned;
        alert(sensor.banned ? 'Sensor bannejat' : 'Sensor desbannejat');
    } catch (error) {
        console.error('Error en bannejar el sensor:', error.message);
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
            console.error('Error en eliminar el sensor:', error.message);
            alert('Ha ocurrido un error al eliminar el sensor.');
        }
    }
};

const handleBanPendingSensor = async (sensor) => {
    try {
        await banPendingSensor(sensor.idSensor, !sensor.banned);
        sensor.banned = !sensor.banned;
        alert(sensor.banned ? 'Sensor bannejat' : 'Sensor desbannejat');
    } catch (error) {
        console.error('Error en bannejar el sensor:', error.message);
        alert('Error al bannejar el sensor: ' + error.message);
    }
};

const acceptPendingSensor = async (sensor) => {
    try {
        await acceptSensor(sensor.idSensor);
        sensor.accepted = true;

        const activeSensorsData = await getNewsensors();
        activeSensors.value = activeSensorsData.map(s => ({
            ...s,
            showDetails: false,
            editing: false
        }));

        alert('Sensor acceptat correctament');
    } catch (error) {
        console.error('Error en acceptar el sensor:', error.message);
        alert('Error al acceptar el sensor: ' + error.message);
    }
};

const navigateToMapas = () => {
    router.push('/mapas');
};

const navigateToAulas = () => {
    router.push('/admin');
};

const loading = ref(false);
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
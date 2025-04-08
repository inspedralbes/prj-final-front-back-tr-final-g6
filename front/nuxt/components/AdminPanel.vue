<template>
    <div class="min-h-screen bg-slate-900 flex flex-col">
        <!-- Header Section -->
        <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-8 shadow-lg">
            <div class="max-w-7xl mx-auto flex flex-col items-center">
                <div class="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                    Panell d'Administració
                </h1>
                <p class="text-teal-200 font-medium text-lg">
                    Institut Pedralbes • Gestió d'Aules
                </p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
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

                <button @click="showCreateAulaForm = !showCreateAulaForm"
                    class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {{ showCreateAulaForm ? 'Cancel·lar' : 'Crear Aula' }}
                </button>
            </div>

            <!-- Search and Filter -->
            <div class="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <div class="relative flex-grow">
                        <input v-model="searchQuery" type="text" placeholder="Cercar Aula..."
                            class="w-full p-3 pl-10 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all" />
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 absolute left-3 top-3.5"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div class="relative w-full md:w-48">
                        <select v-model="selectedEtapa"
                            class="custom-select appearance-none w-full p-3 pr-10 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all">
                            <option :value="null">Totes les etapes</option>
                            <option v-for="etapa in etapas" :key="etapa.value" :value="etapa.value">
                                {{ etapa.label }}
                            </option>
                        </select>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <button v-if="searchQuery || selectedEtapa" @click="clearFilters"
                        class="whitespace-nowrap px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors flex items-center justify-center border border-slate-600">
                        <span class="text-lg mr-1">&times;</span>
                        <span>Netejar filtres</span>
                    </button>
                </div>
            </div>

            <!-- Create Aula Form -->
            <div v-if="showCreateAulaForm" class="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                <h2 class="text-2xl font-bold text-white mb-6">Crear Nova Aula</h2>
                <form @submit.prevent="handleCreateAula" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="Curs" class="block text-sm font-medium text-slate-300 mb-2">Curs:</label>
                            <input v-model="newAula.Curs" type="text" placeholder="Curs"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                            <label for="Classe" class="block text-sm font-medium text-slate-300 mb-2">Classe:</label>
                            <input v-model="newAula.Classe" type="text" placeholder="Classe"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                            <label for="Etapa" class="block text-sm font-medium text-slate-300 mb-2">Etapa:</label>
                            <select v-model="newAula.Etapa"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all">
                                <option value="" disabled selected>Seleccionar Etapa</option>
                                <option v-for="etapa in etapas" :key="etapa.value" :value="etapa.value">
                                    {{ etapa.label }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label for="Planta" class="block text-sm font-medium text-slate-300 mb-2">Planta:</label>
                            <input v-model="newAula.Planta" type="number" placeholder="Planta"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                            <label for="Aula" class="block text-sm font-medium text-slate-300 mb-2">Aula:</label>
                            <input v-model="newAula.Aula" type="number" placeholder="Aula"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                            <label for="turn" class="block text-sm font-medium text-slate-300 mb-2">Torn:</label>
                            <input v-model="newAula.turn" type="text" placeholder="Torn"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                        </div>
                    </div>
                    <div class="flex justify-end pt-4">
                        <button type="submit"
                            class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            Crear Aula
                        </button>
                    </div>
                </form>
            </div>

            <!-- Aules List -->
            <div class="space-y-6">
                <div v-for="aula in filteredAulas" :key="aula.id"
                    class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-all duration-300">
                    <div class="p-6 cursor-pointer" @click="toggleDetails(aula)">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-bold text-white">{{ aula.id }} - {{ aula.Curs || 'Sense classe'
                                    }}</h2>
                                <p class="text-sm text-teal-400">Etapa: {{ aula.Etapa || 'Sense etapa' }}</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <label :for="'toggle-' + aula.id" class="flex items-center cursor-pointer">
                                    <div class="relative">
                                        <input type="checkbox" :id="'toggle-' + aula.id" :checked="aula.activa === 1"
                                            @change="toggleActive(aula)" class="sr-only">
                                        <div class="block bg-slate-600 w-14 h-8 rounded-full"></div>
                                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform"
                                            :class="{ 'translate-x-6 bg-teal-500': aula.activa === 1 }"></div>
                                    </div>
                                    <div class="ml-3 text-sm font-medium text-slate-300">
                                        {{ aula.activa === 1 ? 'Activa' : 'Inactiva' }}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div v-if="aula.showDetails" class="mt-6 space-y-4" @click.stop>
                            <template v-if="!aula.editing">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-slate-400">Classe:</p>
                                        <p class="text-lg text-white">{{ aula.Classe || 'Sense classe' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-slate-400">Planta:</p>
                                        <p class="text-lg text-white">{{ aula.Planta !== undefined ? aula.Planta :
                                            'Sense planta' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-slate-400">Aula:</p>
                                        <p class="text-lg text-white">{{ aula.Aula || 'Sense aula' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-slate-400">Torn:</p>
                                        <p class="text-lg text-white">{{ aula.turn || 'Sense torn' }}</p>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-3 pt-4">
                                    <button @click.stop="startEditing(aula)"
                                        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </button>
                                    <button @click.stop="handleDeleteAula(aula.id)"
                                        class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar
                                    </button>
                                </div>
                            </template>
                            <form v-else @submit.prevent="saveEdit(aula)" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Curs:</label>
                                        <input v-model="aula.Curs" type="text" placeholder="Curs"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Classe:</label>
                                        <input v-model="aula.Classe" type="text" placeholder="Classe"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Planta:</label>
                                        <input v-model="aula.Planta" type="number" placeholder="Planta"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Aula:</label>
                                        <input v-model="aula.Aula" type="number" placeholder="Aula"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Torn:</label>
                                        <input v-model="aula.turn" type="text" placeholder="Torn"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-3 pt-4">
                                    <button type="submit"
                                        class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        Guardar
                                    </button>
                                    <button @click.stop="cancelEdit(aula)"
                                        class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel·lar
                                    </button>
                                </div>
                            </form>
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
import { getTotesAulas, createAula, deleteAula } from '~/utils/communicationManager';

const router = useRouter();
const aulas = ref([]);
const searchQuery = ref('');
const selectedEtapa = ref(null);
const showCreateAulaForm = ref(false);
const newAula = ref({
    Curs: '',
    Classe: '',
    Etapa: '',
    Planta: 0,
    Aula: '',
    activa: 0,
    turn: ''
});

const etapas = [
    { label: 'ESO', value: 'ESO' },
    { label: 'BATX', value: 'BATX' },
    { label: 'PFI', value: 'PFI' },
    { label: 'CFGM', value: 'CFGM' },
    { label: 'CFGS', value: 'CFGS' },
    { label: 'ALTRES', value: 'ALTRES' }
];

onMounted(async () => {
    try {
        aulas.value = await getTotesAulas();
        aulas.value = aulas.value.map(aula => ({
            ...aula,
            showDetails: false,
            editing: false
        }));
    } catch (error) {
        console.error('Error al cargar las aulas:', error.message);
    }
});

const filteredAulas = computed(() => {
    return aulas.value.filter(aula => {
        const matchesSearch = aula.Curs.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            aula.Aula.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesEtapa = !selectedEtapa.value || aula.Etapa === selectedEtapa.value;
        return matchesSearch && matchesEtapa;
    });
});

const clearFilters = () => {
    searchQuery.value = '';
    selectedEtapa.value = null;
};

const toggleDetails = (aula) => aula.showDetails = !aula.showDetails;
const startEditing = (aula) => aula.editing = true;
const cancelEdit = (aula) => aula.editing = false;

const saveEdit = async (aula) => {
    try {
        await updateAula(aula.id, aula);
        aula.editing = false;
        alert('Aula actualitzada correctament');
    } catch (error) {
        console.error('Error en actualitzar l\'aula:', error.message);
        alert('Ha ocurrido un error al actualizar el aula.');
    }
};

const handleDeleteAula = async (id) => {
    if (confirm('Estàs segur que vols eliminar aquesta aula?')) {
        try {
            await deleteAula(id);
            aulas.value = aulas.value.filter(aula => aula.id !== id);
            alert('Aula eliminada correctament');
        } catch (error) {
            console.error('Error en eliminar l\'aula:', error.message);
            alert('Ha ocurrido un error al eliminar el aula.');
        }
    }
};

const toggleActive = async (aula) => {
    try {
        const updatedAula = {
            id: aula.id,
            activa: aula.activa ? 0 : 1
        };
        await habilitarAula(updatedAula);
        aula.activa = !aula.activa;
    } catch (error) {
        console.error('Error al cambiar el estado del aula:', error.message);
        aula.activa = !aula.activa;
    }
};

const navigateToMapas = () => {
    router.push('/mapas');
};

const handleCreateAula = async () => {
    try {
        await createAula(newAula.value.Curs, newAula.value.Classe, newAula.value.Etapa);
        alert('Aula creada correctament!');
        newAula.value = { Curs: '', Classe: '', Etapa: '', Planta: 0, Aula: '', activa: 0, turn: '' };
        showCreateAulaForm.value = false;
        aulas.value = await getTotesAulas();
    } catch (error) {
        console.error("Error al crear el aula:", error.message);
        alert('Ha ocurrido un error al crear el aula.');
    }
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

/* Gradient animation for the header */
.bg-gradient-to-r {
    background-size: 200% 200%;
    animation: gradient-shift 10s ease infinite;
}

@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* Toggle switch styling */
.dot {
    transition: all 0.3s ease-in-out;
}
</style>
<template>
    <div class="min-h-screen bg-slate-800 flex flex-col">
        <!-- Custom Header Component -->
        <Header />

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

                <button @click="navigateToSensors"
                    class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Configurar Sensors
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
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                            <select v-model="newAula.turn"
                                class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all">
                                <option value="mati">Mati</option>
                                <option value="tarda">Tarda</option>
                                <option value="mati i tarda">Mati i tarda</option>
                            </select>
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
                        </div>

                        <div v-if="aula.showDetails" class="mt-6 space-y-4" @click.stop>
                            <template v-if="!aula.editing">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-slate-400">Classe:</p>
                                        <p class="text-lg text-white">{{ aula.Classe || 'Sense classe' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-slate-400">Etapa:</p>
                                        <p class="text-lg text-white">{{ aula.Etapa || 'Sense etapa' }}</p>
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
                                        <input v-model="editData.Curs" type="text" placeholder="Curs"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Classe:</label>
                                        <select v-model="editData.Classe"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all">
                                            <option value="">Seleccionar Classe</option>
                                            <option v-for="classe in uniqueClasses" :key="classe" :value="classe">
                                                {{ classe }}
                                            </option>
                                            <option value="_new">+ Afegir nova classe</option>
                                        </select>
                                        <input v-if="editData.Classe === '_new'" v-model="editData.newClasse"
                                            type="text" placeholder="Escriu el nom de la nova classe"
                                            class="w-full mt-2 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                                            @keydown.enter.prevent="addNewClasse(aula)" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Etapa:</label>
                                        <select v-model="editData.Etapa"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all">
                                            <option value="" disabled>Seleccionar Etapa</option>
                                            <option v-for="etapa in etapas" :key="etapa.value" :value="etapa.value">
                                                {{ etapa.label }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Planta:</label>
                                        <input v-model="editData.Planta" type="number" placeholder="Planta"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Aula:</label>
                                        <input v-model="editData.Aula" type="number" placeholder="Aula"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Torn:</label>
                                        <select v-model="editData.turn"
                                            class="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all">
                                            <option value="mati">Mati</option>
                                            <option value="tarda">Tarda</option>
                                            <option value="mati i tarda">Mati i tarda</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-3 pt-4">
                                    <button type="submit"
                                        class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center">
                                        Guardar
                                    </button>
                                    <button type="button" @click.stop="cancelEdit(aula)"
                                        class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all flex items-center">
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
import { getTotesAulas, createAula, deleteAula, updateAula, habilitarAula } from '~/utils/communicationManager';

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
    Aula: 0,
    turn: 'mati',
    activa: 1
});

const etapas = [
    { label: 'ESO', value: 'ESO' },
    { label: 'BATX', value: 'BATX' },
    { label: 'PFI', value: 'PFI' },
    { label: 'CFGM', value: 'CFGM' },
    { label: 'CFGS', value: 'CFGS' },
    { label: 'ALTRES', value: 'ALTRES' }
];

// Get unique classes from aulas data
const uniqueClasses = computed(() => {
  const classes = new Set();
  aulas.value.forEach(aula => {
    if (aula.Classe && aula.Classe.trim() !== '') {
      classes.add(aula.Classe);
    }
  });
  return Array.from(classes).sort();
});

onMounted(async () => {
    try {
        const data = await getTotesAulas();
        aulas.value = data.map(aula => ({
            ...aula,
            showDetails: false,
            editing: false,
            newClasse: ''
        }));
    } catch (error) {
        console.error('Error al cargar las aulas:', error.message);
        alert('Error al cargar las aulas: ' + error.message);
    }
});

const filteredAulas = computed(() => {
    return aulas.value.filter(aula => {
        const matchesSearch = aula.Curs?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            aula.Aula?.toString().includes(searchQuery.value.toLowerCase());
        const matchesEtapa = !selectedEtapa.value || aula.Etapa === selectedEtapa.value;
        return matchesSearch && matchesEtapa;
    });
});

const clearFilters = () => {
    searchQuery.value = '';
    selectedEtapa.value = null;
};

const toggleDetails = (aula) => aula.showDetails = !aula.showDetails;
const editData = ref({});

const startEditing = (aula) => {
    aula.editing = true;
    editData.value = {
        ...aula,
        newClasse: ''
    };
};

const cancelEdit = (aula) => {
    aula.editing = false;
    editData.value = {};
};

const addNewClasse = (aula) => {
    if (editData.value.newClasse && editData.value.newClasse.trim() !== '') {
        editData.value.Classe = editData.value.newClasse;
        editData.value.newClasse = '';
    }
};

const saveEdit = async (aula) => {
    try {
        // Handle new class if selected
        if (editData.value.Classe === '_new' && editData.value.newClasse) {
            editData.value.Classe = editData.value.newClasse;
        }

        // Update the aula object
        Object.assign(aula, {
            Curs: editData.value.Curs,
            Classe: editData.value.Classe,
            Etapa: editData.value.Etapa,
            Planta: editData.value.Planta,
            Aula: editData.value.Aula,
            turn: editData.value.turn,
            activa: editData.value.activa
        });

        // Send update to server
        await updateAula(aula.id, {
            Curs: editData.value.Curs,
            Classe: editData.value.Classe,
            Etapa: editData.value.Etapa,
            Planta: editData.value.Planta,
            Aula: editData.value.Aula,
            turn: editData.value.turn,
            activa: editData.value.activa
        });

        aula.editing = false;
        editData.value = {};
        alert('Aula actualitzada correctament');
    } catch (error) {
        console.error('Error en actualitzar l\'aula:', error.message);
        alert('Error al actualizar el aula: ' + error.message);
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

const navigateToMapas = () => {
    router.push('/mapas');
};

const navigateToSensors = () => {
    router.push('/sensors');
};

const handleCreateAula = async () => {
    try {
        // Validate required fields
        if (!newAula.value.Curs || !newAula.value.Etapa) {
            throw new Error('Els camps Curs i Etapa són obligatoris');
        }

        // Create the new aula
        const createdAula = await createAula({
            Curs: newAula.value.Curs,
            Classe: newAula.value.Classe,
            Etapa: newAula.value.Etapa,
            Planta: newAula.value.Planta,
            Aula: newAula.value.Aula,
            turn: newAula.value.turn,
            activa: newAula.value.activa
        });

        // Add to local state
        aulas.value.push({
            ...createdAula,
            showDetails: false,
            editing: false,
            newClasse: ''
        });

        // Reset form
        newAula.value = {
            Curs: '',
            Classe: '',
            Etapa: '',
            Planta: 0,
            Aula: 0,
            turn: 'mati',
            activa: 1
        };
        showCreateAulaForm.value = false;
        
        alert('Aula creada correctament!');
    } catch (error) {
        console.error("Error al crear el aula:", error.message);
        alert('Error al crear el aula: ' + error.message);
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
</style>
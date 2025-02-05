<template>
    <div>
        <Header />
        <div
            class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center p-8 animated-bg">
            <!-- Filtres -->
            <div class="flex space-x-4">
            <button @click="navigateToMapas"
                class="px-4 py-2 my-4 bg-emerald-700 text-white rounded-lg hover:bg-blue-600 transition-all">
                Veure Mapes
            </button>
            
            <button @click="showCreateAulaForm = !showCreateAulaForm"
                class="px-4 py-2 my-4 bg-emerald-700 text-white rounded-lg hover:bg-blue-600 transition-all">
                Crear Aula
            </button>
            </div>
            
            <div class="w-full max-w-3xl mb-8 bg-white p-6 rounded-lg shadow-lg">
                <div class="flex flex-wrap gap-4">
                    <input v-model="searchQuery" type="text" placeholder="Cercar Aula..."
                        class="flex-grow p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all" />
                    <Dropdown v-model="selectedEtapa" :options="etapas" option-label="label" option-value="value"
                        placeholder="Filtrar Etapa" class="w-48" />
                    <button v-if="searchQuery || selectedEtapa" @click="clearFilters"
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                        Netejar filtres
                    </button>
                </div>
            </div>


            <div v-if="showCreateAulaForm" class="w-full max-w-3xl mb-8 bg-white p-6 rounded-lg shadow-lg">
                <form @submit.prevent="handleCreateAula">
                    <label for="Curs" class="block text-sm text-gray-700">Curs:</label>
                    <input v-model="newAula.Curs" type="text" placeholder="Curs"
                        class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 mb-4" />
                    <label for="Classe" class="block text-sm text-gray-700">Classe:</label>
                    <input v-model="newAula.Classe" type="text" placeholder="Classe"
                        class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 mb-4" />
                    <label for="Etapa" class="block text-sm text-gray-700">Etapa:</label>
                    <Dropdown v-model="newAula.Etapa" :options="etapas" option-label="label" option-value="value"
                        placeholder="Seleccionar Etapa" class="w-full mb-4" />
                    <label for="Planta" class="block text-sm text-gray-700">Planta:</label>
                    <input v-model="newAula.Planta" type="number" placeholder="Planta"
                        class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 mb-4" />
                    <label for="Aula" class="block text-sm text-gray-700">Aula:</label>
                    <input v-model="newAula.Aula" type="number" placeholder="Aula"
                        class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 mb-4" />
                    <label for="turn" class="block text-sm text-gray-700">Torn:</label>
                    <input v-model="newAula.turn" type="text" placeholder="Torn"
                        class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 mb-4" />
                    <button type="submit"
                        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                        Crear
                    </button>
                </form>
            </div>

            <!-- Llista d'Aules -->
            <div class="w-full max-w-3xl space-y-6">
                <div v-for="aula in filteredAulas" :key="aula.id"
                    class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                    <div class="p-6 cursor-pointer" @click="toggleDetails(aula)">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-2xl font-semibold text-gray-900">{{ aula.id }} - {{ aula.Curs || 'Sense classe' }}</h2>
                                <p class="text-sm text-gray-700">Etapa: {{ aula.Etapa || 'Sense etapa' }}</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <label :for="'toggle-' + aula.id"
                                    class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" :id="'toggle-' + aula.id" :checked="aula.activa === 1"
                                        @change="toggleActive(aula)" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full">
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div v-if="aula.showDetails" class="mt-4 space-y-4" @click.stop>
                            <template v-if="!aula.editing">
                                <p class="text-sm text-gray-700">Classe: {{ aula.Classe || 'Sense classe' }}</p>
                                <p class="text-sm text-gray-700">Planta: {{ aula.Planta !== undefined ? aula.Planta :
                                    'Sense planta' }}</p>
                                <p class="text-sm text-gray-700">Aula: {{ aula.Aula || 'Sense aula' }}</p>
                                <p class="text-sm text-gray-700">Torn: {{ aula.turn || 'Sense torn' }}</p>
                                <div class="flex space-x-4">
                                    <button @click.stop="startEditing(aula)"
                                        class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all">Editar</button>
                                    <button @click.stop="handleDeleteAula(aula.id)"
                                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">Eliminar</button>
                                </div>
                            </template>
                            <form v-else @submit.prevent="saveEdit(aula)" class="space-y-4">
                                <label for="curs" class="block text-sm text-gray-700">Curs:</label>
                                <input v-model="aula.Curs" type="text" placeholder="Curs"
                                    class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500" />
                                <label for="clase" class="block text-sm text-gray-700">Classe:</label>
                                <input v-model="aula.Classe" type="text" placeholder="Classe"
                                    class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500" />
                                <label for="planta" class="block text-sm text-gray-700">Planta:</label>
                                <input v-model="aula.Planta" type="number" placeholder="Planta"
                                    class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500" />
                                <label for="aula" class="block text-sm text-gray-700">Aula:</label>
                                <input v-model="aula.Aula" type="number" placeholder="Aula"
                                    class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500" />
                                <label for="turn" class="block text-sm text-gray-700">Torn:</label>
                                <input v-model="aula.turn" type="text" placeholder="Torn"
                                    class="w-full p-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500" />
                                <div class="flex space-x-4">
                                    <button type="submit"
                                        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">Guardar</button>
                                    <button @click.stop="cancelEdit(aula)"
                                        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all">Cancelar</button>
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
import Dropdown from 'primevue/dropdown';
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
        // Aquí pasamos los valores de newAula
        await createAula(newAula.value.Curs, newAula.value.Classe, newAula.value.Etapa);
        alert('Aula creada correctament!');
        // Limpia el formulario después de crear
        newAula.value = { Curs: '', Classe: '', Etapa: '', Planta: 0, Aula: '', activa: 0, turn: '' };
        showCreateAulaForm.value = false;
        // Recarga las aulas para mostrar la nueva
        aulas.value = await getTotesAulas();
    } catch (error) {
        console.error("Error al crear el aula:", error.message);
        alert('Ha ocurrido un error al crear el aula.');
    }
};

</script>

<style scoped>
.animated-bg {
    background-size: 400% 400%;
    animation: move-bg 15s ease infinite;
}

@keyframes move-bg {
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

input[type="text"],
.p-dropdown {
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

input[type="text"]:focus,
.p-dropdown:focus {
    border-color: #3B82F6;
}

button {
    transition: background-color 0.3s ease-in-out;
    font-size: 1rem;
    font-weight: 600;
}

button:hover {
    background-color: #E11D48;
}
</style>

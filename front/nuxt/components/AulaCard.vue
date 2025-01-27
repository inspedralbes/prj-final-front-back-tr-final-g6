<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center justify-start animated-bg">
        
        <!-- Espacio entre el header y el buscador -->
        <div class="mt-[42px] w-full sm:w-2/3 lg:w-1/2 mb-6 flex items-center justify-center space-x-4">
            <!-- Buscador -->
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar Aula..."
                class="w-full p-3 rounded-lg border border-gray-300"
            />
            
            <!-- Filtro -->
            <Dropdown 
                v-model="selectedEtapa" 
                :options="etapas" 
                option-label="label" 
                option-value="value"
                placeholder="Filtrar Etapa"
                class="w-full sm:w-48"
            />
            
            <!-- Botón para limpiar filtros -->
            <button
                v-if="searchQuery || selectedEtapa"
                @click="clearFilters"
                class="ml-2 p-2 rounded-full bg-gray-300 hover:bg-gray-400 text-white"
            >
                <span class="text-lg">&times;</span> <!-- Icono de cruz -->
            </button>
        </div>

        <!-- Cards debajo del buscador -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            <NuxtLink
                v-for="aula in filteredAulas" 
                :key="aula.id" 
                :to="`/aulas/${aula.id}`" 
                class="card-container"
            >
                <Card class="custom-card">
                    <template #header>
                        <img
                            alt="user header"
                            src="https://primefaces.org/cdn/primevue/images/usercard.png"
                            class="rounded-t-lg"
                        />
                    </template>
                    <template #title>
                        <div class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                            Aula: {{ aula.Curs }} - {{ aula.Classe }}
                        </div>
                    </template>
                    <template #subtitle>
                        <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            Etapa: {{ aula.Etapa }}
                        </div>
                    </template>
                    <template #content>
                        <p class="text-gray-900 dark:text-white text-center mt-4">
                            Información de la aula cargada exitosamente.
                        </p>
                    </template>
                </Card>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import { getAulas } from '~/utils/communicationManager';

const aulas = ref([]);
const searchQuery = ref('');
const selectedEtapa = ref(null);

// Opciones del filtro (etapas)
const etapas = [
    { label: 'ESO', value: 'ESO' },
    { label: 'Bachillerato', value: 'Bachillerato' },
    { label: 'PFI', value: 'PFI' },
    { label: 'CFGM', value: 'CFGM' },
    { label: 'CFGS', value: 'CFGS' }
];

onMounted(async () => {
    try {
        aulas.value = await getAulas();
    } catch (error) {
        console.error('Error al cargar las aulas:', error.message);
    }
});

// Filtrar aulas conforme al texto de búsqueda y el filtro de etapa
const filteredAulas = computed(() => {
    // Si no hay búsqueda ni filtro de etapa, mostrar todas las aulas
    if (!searchQuery.value && !selectedEtapa.value) {
        return aulas.value;
    }

    return aulas.value.filter(aula => {
        const matchesSearch = aula.Curs.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                              aula.Classe.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesEtapa = selectedEtapa ? aula.Etapa === selectedEtapa : true;
        return matchesSearch && matchesEtapa;
    });
});

// Función para limpiar los filtros
const clearFilters = () => {
    searchQuery.value = '';
    selectedEtapa.value = null;
};
</script>

<style scoped>
.animated-bg {
    background-size: 200% 200%;
    animation: move-bg 6s ease infinite;
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

.card-container {
    border: 1px solid black;
    border-radius: 10px;
    background: white;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.card-container:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.custom-card {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>

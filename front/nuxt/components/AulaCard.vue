<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center justify-start animated-bg">

        <div class="mt-[42px] w-full sm:w-2/3 lg:w-1/2 mb-6 flex items-center justify-center space-x-4">
            <input v-model="searchQuery" type="text" placeholder="Buscar Aula..."
                class="w-full p-3 rounded-lg border border-gray-300" />

            <Dropdown v-model="selectedEtapa" :options="etapas" option-label="label" option-value="value"
                placeholder="Filtrar Etapa" class="w-full sm:w-48" />

            <button v-if="searchQuery || selectedEtapa" @click="clearFilters"
                class="ml-2 p-2 rounded-full bg-gray-300 hover:bg-gray-400 text-white">
                <span class="text-lg">&times;</span>
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            <NuxtLink v-for="aula in filteredAulas" :key="aula.id" :to="`/aulas/${aula.id}`" class="card-container">
                <Card class="custom-card">
                    <template #header>
                        <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png"
                            class="rounded-t-lg" />
                    </template>
                    <template #title>
                        <div class="text-center text-xl font-semibold text-gray-900 dark:text-white">
                            {{ aula.Curs || 'Sin clase' }}
                        </div>
                    </template>
                    <template #subtitle>
                        <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            Etapa: {{ aula.Etapa }}
                        </div>
                    </template>
                    <template #content>
                        <p class="text-gray-900 dark:text-white text-center mt-4">
                            Pis {{ aula.Planta }} - Classe: {{ aula.Aula }}
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
        aulas.value = await getAulas();
    } catch (error) {
        console.error('Error al cargar las aulas:', error.message);
    }
});

const filteredAulas = computed(() => {
    let filtered = aulas.value.filter(aula => {
        const matchesSearch = aula.Curs.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            aula.Classe.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesSearch;
    });

    if (selectedEtapa.value) {
        filtered = filtered.filter(aula => aula.Etapa === selectedEtapa.value);
    }

    return filtered;
});

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

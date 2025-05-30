<template>
  <div class="min-h-screen bg-slate-900 flex flex-col">
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6">
      <div class="max-w-7xl mx-auto flex flex-col items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Monitorització d'Aules
        </h1>
        <p class="text-teal-200 font-medium">
          Institut Pedralbes • Visualització de totes les aules
        </p>
      </div>
    </div>

    <!-- Search and Filter Controls -->
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div class="relative flex-grow">
          <input v-model="searchQuery" type="text" placeholder="Cercar aula..."
            class="w-full p-3 pl-10 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 absolute left-3 top-3.5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="w-full sm:w-64">
          <div class="relative">
            <select v-model="selectedEtapa"
              class="custom-select appearance-none w-full p-3 pr-10 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all">
              <option :value="null">Totes les etapes</option>
              <option v-for="etapa in etapas" :key="etapa.value" :value="etapa.value">
                {{ etapa.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <button v-if="searchQuery || selectedEtapa" @click="clearFilters"
          class="whitespace-nowrap p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center border border-slate-700">
          <span class="text-lg mr-1">&times;</span>
          <span class="text-sm">Netejar</span>
        </button>
      </div>
    </div>

    <!-- Aulas Grid -->
    <div class="flex-grow w-full max-w-7xl mx-auto px-4 pb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink v-for="aula in filteredAulas" :key="aula.id" :to="`/aulas/${aula.id}`" class="card-link">
          <div
            class="h-full bg-slate-800 rounded-xl shadow-lg hover:shadow-xl border border-slate-700 hover:border-teal-500 transition-all duration-300 flex flex-col">
            <!-- Card Header -->
            <div
              class="relative h-56 bg-gradient-to-br from-teal-700 to-blue-800 rounded-t-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-28 w-28 text-white opacity-90" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <span
                class="absolute bottom-4 right-4 bg-slate-900/90 text-white text-sm px-3 py-1 rounded-full font-medium">
                Pis {{ aula.Planta }}
              </span>
            </div>

            <!-- Card Content -->
            <div class="flex-grow p-6 flex flex-col">
              <div class="text-center text-2xl font-bold text-white mb-2">
                {{ aula.Curs || "Sense classe" }}
              </div>
              <div class="text-center text-lg font-medium text-teal-400 mb-4">
                {{ aula.Etapa }}
              </div>
              <p class="text-slate-300 text-center text-xl font-medium mb-4">
                {{ aula.Aula }}
              </p>

              <!-- Indicadores de sensores -->
              <div class="grid grid-cols-3 gap-3 mb-6">
                <!-- Temperatura -->
                <div
                  class="flex flex-col items-center p-2 rounded-lg border"
                  :style="getTempStyle(sensorValues[aula.id]?.temperatura)"
                >
                  <i class="fas fa-temperature-high text-amber-400 mb-1"></i>
                  <span class="text-xs text-slate-300">Temp.</span>
                  <span class="text-sm font-medium text-white">
                    {{ sensorValues[aula.id]?.temperatura != null
                      ? sensorValues[aula.id].temperatura.toFixed(1) + '°C'
                      : '--°C' }}
                  </span>
                </div>
                <!-- Humetat -->
                <div
                  class="flex flex-col items-center p-2 rounded-lg border"
                  :style="getHumitatStyle(sensorValues[aula.id]?.humitat)"
                >
                  <i class="fas fa-tint text-emerald-400 mb-1"></i>
                  <span class="text-xs text-slate-300">Humitat</span>
                  <span class="text-sm font-medium text-white">
                    {{ sensorValues[aula.id]?.humitat != null
                      ? sensorValues[aula.id].humitat.toFixed(1) + '%'
                      : '--%' }}
                  </span>
                </div>
                <!-- Volumen -->
                <div
                  class="flex flex-col items-center p-2 rounded-lg border"
                  :style="getVolumStyle(sensorValues[aula.id]?.volum)"
                >
                  <i class="fas fa-volume-up text-blue-400 mb-1"></i>
                  <span class="text-xs text-slate-300">Volum</span>
                  <span class="text-sm font-medium text-white">
                    {{ sensorValues[aula.id]?.volum != null
                      ? sensorValues[aula.id].volum.toFixed(0) + 'dB'
                      : '--dB' }}
                  </span>
                </div>
              </div>

              <div class="mt-auto flex justify-center">
                <span
                  class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white text-base font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                  Veure detalls
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { getAulas, getUltimsSensorsAula } from "~/utils/communicationManager";

const aulas = ref([]);
const searchQuery = ref("");
const selectedEtapa = ref(null);
const sensorValues = ref({});

const etapas = [
  { name: "ESO", value: "ESO" },
  { name: "BATX", value: "BATX" },
  { name: "PFI", value: "PFI" },
  { name: "CFGM", value: "CFGM" },
  { name: "CFGS", value: "CFGS" },
  { name: "ALTRES", value: "ALTRES" },
];

let refreshInterval = null;

onMounted(async () => {
  await loadAulasAndSensors();
  refreshInterval = setInterval(loadAulasAndSensors, 2000); // refresca cada 2s
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});

async function loadAulasAndSensors() {
  try {
    const aulasData = await getAulas();
    aulas.value = aulasData.map((aula) => ({
      ...aula,
      sensorActivo: true,
    }));

    for (const aula of aulas.value) {
      const ultims = await getUltimsSensorsAula(aula.id);
      sensorValues.value[aula.id] = {
        temperatura: ultims.temperatura ? ultims.temperatura.average : null,
        humitat: ultims.humitat ? ultims.humitat.average : null,
        volum: ultims.volum ? ultims.volum.average : null,
      };
    }
  } catch (error) {
    console.error("Error en carregar les aules o sensors:", error.message);
  }
}

async function fetchLastSensorValues(aulaId) {
  const dataIni = '2000-01-01 00:00:00';
  const dataFi = '2100-01-01 00:00:00';
  const [temp] = await getDadesGrafic('hora', 'temperatura', aulaId, dataIni, dataFi);
  const [hum] = await getDadesGrafic('hora', 'humitat', aulaId, dataIni, dataFi);
  const [vol] = await getDadesGrafic('hora', 'volum', aulaId, dataIni, dataFi);

  return {
    temperatura: temp ? temp.average : null,
    humitat: hum ? hum.average : null,
    volum: vol ? vol.average : null,
  };
}

const toggleSensor = (aulaId) => {
  const aula = aulas.value.find((a) => a.id === aulaId);
  if (aula) {
    aula.sensorActivo = !aula.sensorActivo;
    // Aquí podries fer una crida a l'API per actualitzar l'estat al backend
    console.log(
      `Sensor de l'aula ${aulaId} ${aula.sensorActivo ? "activat" : "desactivat"}`
    );
  }
};

const filteredAulas = computed(() => {
  let filtered = aulas.value.filter((aula) => {
    const matchesSearch =
      aula.Curs?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      aula.Aula?.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesSearch;
  });

  if (selectedEtapa.value) {
    filtered = filtered.filter((aula) => aula.Etapa === selectedEtapa.value);
  }

  return filtered;
});

const clearFilters = () => {
  searchQuery.value = "";
  selectedEtapa.value = null;
};

// --- COLORS DINÀMICS PER ALS INDICADORS ---

const tempColorRanges = [
  { max: 20, border: '#60a5fa', background: 'rgba(96, 165, 250, 0.5)' }, // blau
  { max: 30, border: '#34d399', background: 'rgba(52, 211, 153, 0.5)' }, // verd
  { max: Infinity, border: '#f87171', background: 'rgba(248, 113, 113, 0.5)' } // vermell
];

const volumColorRanges = [
  { max: 70, border: '#2ecc71', background: 'rgba(46, 204, 113, 0.5)' }, // verd
  { max: 80, border: '#f1c40f', background: 'rgba(241, 196, 15, 0.5)' }, // groc
  { max: Infinity, border: '#e73c3c', background: 'rgba(231, 60, 60, 0.5)' } // vermell
];

function getTempStyle(temp) {
  if (temp == null) return {};
  const range = tempColorRanges.find(r => temp <= r.max);
  return {
    borderColor: range.border,
    background: range.background
  };
}

function getVolumStyle(volum) {
  if (volum == null) return {};
  const range = volumColorRanges.find(r => volum <= r.max);
  return {
    borderColor: range.border,
    background: range.background
  };
}

function getHumitatStyle(humitat) {
  if (humitat == null) return {};
  if (humitat < 30) {
    return { borderColor: '#60a5fa', background: 'rgba(96, 165, 250, 0.5)' }; // blau
  }
  if (humitat < 60) {
    return { borderColor: '#34d399', background: 'rgba(52, 211, 153, 0.5)' }; // verd
  }
  return { borderColor: '#f87171', background: 'rgba(248, 113, 113, 0.5)' }; // vermell
}
</script>

<style scoped>
.card-link {
  border-radius: 0.75rem;
  transition: transform 0.3s ease;
  display: block;
  height: 100%;
}

.card-link:hover {
  transform: translateY(-5px);
}

.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}

.custom-select option {
  background-color: rgb(30, 41, 59);
  color: white;
  padding: 0.5rem;
}

.custom-select:focus {
  box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
}
</style>
<template>
  <div class="min-h-screen bg-slate-900">
    <Header />
    <!-- Header con gradiente -->
    <div class="bg-gradient-to-r from-teal-800 to-blue-900 py-8">
      <div class="container mx-auto px-4 text-center">
        <div class="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <v-icon icon="pi pi-chart-bar" class="text-white" size="32" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Rankings d'Aules</h1>
        <p class="text-teal-200">Institut Pedralbes • Estadístiques en Temps Real</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-8">
      <v-card class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div class="retro-tabs-container bg-slate-750 border-b border-slate-700 px-4 py-2">
          <div class="retro-tabs flex justify-center space-x-4">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'retro-tab px-6 py-3 text-lg font-medium transition-all duration-300',
                activeTab === tab.value ? 'active' : ''
              ]"
            >
              <v-icon :icon="tab.icon" class="mr-2" />
              {{ tab.label }}
            </button>
          </div>
        </div>

        <v-window v-model="activeTab" class="bg-slate-800 pa-6">
          <!-- Panel de Sonido -->
          <v-window-item value="so">
            <v-list class="bg-transparent pa-0 space-y-2">
              <v-list-item
                v-for="(aula, index) in rankingSo"
                :key="aula.id"
                :title="aula.nom"
                :subtitle="`${aula.volum} dB`"
                class="rounded-lg border border-slate-700 mb-2 transition-all duration-300"
                density="comfortable"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40" class="mr-3">
                    <span class="text-lg font-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <span class="text-body-2 text-medium-emphasis mr-2">
                      {{ getVolumeStatus(aula.volum) }}
                    </span>
                    <v-icon :icon="getVolumeIcon(aula.volum)" :color="getVolumeColor(aula.volum)" />
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-window-item>

          <!-- Panel de Temperatura -->
          <v-window-item value="temperatura">
            <v-list class="bg-transparent pa-0 space-y-2">
              <v-list-item
                v-for="(aula, index) in rankingTemperatura"
                :key="aula.id"
                :title="aula.nom"
                :subtitle="`${aula.temperatura}°C`"
                class="rounded-lg border border-slate-700 mb-2 transition-all duration-300"
                density="comfortable"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40" class="mr-3">
                    <span class="text-lg font-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-icon icon="pi pi-thermometer" :color="getTempColor(aula.temperatura)" />
                </template>
              </v-list-item>
            </v-list>
          </v-window-item>

          <!-- Panel de Humedad -->
          <v-window-item value="humitat">
            <v-list class="bg-transparent pa-0 space-y-2">
              <v-list-item
                v-for="(aula, index) in rankingHumitat"
                :key="aula.id"
                :title="aula.nom"
                :subtitle="`${aula.humitat}%`"
                class="rounded-lg border border-slate-700 mb-2 transition-all duration-300"
                density="comfortable"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40" class="mr-3">
                    <span class="text-lg font-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-progress-circular
                    :model-value="aula.humitat"
                    :color="getHumidityColor(aula.humitat)"
                    size="32"
                    width="3"
                  >
                    <small>{{ aula.humitat }}%</small>
                  </v-progress-circular>
                </template>
              </v-list-item>
            </v-list>
          </v-window-item>
        </v-window>
      </v-card>

      <!-- Info de actualización -->
      <div class="mt-6 text-center">
        <v-chip
          class="ma-2 pa-4"
          color="teal"
          variant="outlined"
        >
          <v-icon start icon="pi pi-sync" class="animate-spin-slow mr-2" />
          Última actualització: {{ lastUpdate.toLocaleTimeString() }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Header from "../components/header.vue";

const activeTab = ref('so');
const tabs = [
  { value: 'so', label: 'So', icon: 'pi pi-volume-off' },
  { value: 'temperatura', label: 'Temperatura', icon: 'pi pi-sun' },
  { value: 'humitat', label: 'Humitat', icon: 'pi pi-cloud' }
];
const rankingSo = ref([]);
const rankingTemperatura = ref([]);
const rankingHumitat = ref([]);

// Función para obtener el color según la posición
const getRankingColor = (index) => {
  const colors = {
    0: "amber-darken-2",    // Oro
    1: "grey-lighten-1",    // Plata
    2: "deep-orange-lighten-1", // Bronce
  };
  return colors[index] || "grey-darken-3";
};

// Función para obtener el icono de volumen
const getVolumeIcon = (volume) => {
  if (volume < 35) return "pi pi-volume-off";
  if (volume < 45) return "pi pi-volume-down";
  return "pi pi-volume-up";
};

// Función para obtener el estado de volumen como texto
const getVolumeStatus = (volume) => {
  if (volume < 35) return "Silenciós";
  if (volume < 45) return "Moderat";
  return "Sorollós";
};

// Función para obtener el color del icono de volumen
const getVolumeColor = (volume) => {
  if (volume < 35) return "success";
  if (volume < 45) return "warning";
  return "error";
};

// Función para obtener el color según temperatura
const getTempColor = (temp) => {
  if (temp < 22) return "blue";
  if (temp < 24) return "success";
  return "orange";
};

// Función para obtener el color según humedad
const getHumidityColor = (humidity) => {
  if (humidity < 40) return "warning";
  if (humidity < 60) return "success";
  return "info";
};

const lastUpdate = ref(new Date());

const updateRankings = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/aules/sensors');
    const data = await response.json();

    // Procesar datos para cada ranking
    const processedData = data.map(aula => ({
      id: aula.id,
      nom: aula.nom,
      volum: aula.volum?.average || 0,
      temperatura: aula.temperatura?.average || 0,
      humitat: aula.humitat?.average || 0
    }));

    // Actualizar rankings
    rankingSo.value = [...processedData].sort((a, b) => b.volum - a.volum);
    rankingTemperatura.value = [...processedData].sort((a, b) => b.temperatura - a.temperatura);
    rankingHumitat.value = [...processedData].sort((a, b) => b.humitat - a.humitat);

    lastUpdate.value = new Date();
  } catch (error) {
    console.error("Error al cargar los datos del ranking:", error);
  }
};

onMounted(async () => {
  await updateRankings();
  // Actualizar cada 30 segundos
  setInterval(updateRankings, 30000);
});
</script>

<style scoped>
.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  transform: translateX(4px);
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

/* Estilo retro para las pestañas */
.retro-tabs-container {
  position: relative;
  background: linear-gradient(to bottom, #1a2234, #1e293b);
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.1);
}

.retro-tabs {
  position: relative;
  z-index: 1;
}

.retro-tab {
  position: relative;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-radius: 8px 8px 0 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  overflow: hidden;
}

.retro-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.retro-tab:hover::before {
  opacity: 0.1;
}

.retro-tab.active {
  color: #14b8a6;
  background: rgba(20, 184, 166, 0.1);
  box-shadow: 
    inset 0 2px 0 #14b8a6,
    0 0 20px rgba(20, 184, 166, 0.2);
}

.retro-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: #14b8a6;
  box-shadow: 0 0 10px #14b8a6;
}

/* Animación de brillo para las pestañas activas */
@keyframes glow {
  0%, 100% {
    box-shadow: 
      inset 0 2px 0 #14b8a6,
      0 0 20px rgba(20, 184, 166, 0.2);
  }
  50% {
    box-shadow: 
      inset 0 2px 0 #14b8a6,
      0 0 30px rgba(20, 184, 166, 0.4);
  }
}

.retro-tab.active {
  animation: glow 3s ease-in-out infinite;
}
</style>

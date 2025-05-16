<template>
  <div class="min-h-screen bg-slate-900 flex flex-col">
    <Header />
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6">
      <div class="max-w-7xl mx-auto flex flex-col items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Rankings d'Aules
        </h1>
        <p class="text-teal-200 font-medium">
          Institut Pedralbes • Estadístiques en Temps Real
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-7xl mx-auto px-4 py-6 flex-grow">
      <v-card
        class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg"
      >
        <div class="bg-slate-800 p-6 mb-6">
          <div class="flex flex-wrap gap-3 justify-center">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02]',
                activeTab === tab.value
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-slate-700 border-slate-600 text-white',
              ]"
            >
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
                :subtitle="`${aula.volum.toFixed(1)} dB`"
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
                    <v-icon
                      :icon="getVolumeIcon(aula.volum)"
                      :color="getVolumeColor(aula.volum)"
                    />
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
                :subtitle="`${aula.temperatura.toFixed(1)}°C`"
                class="rounded-lg border border-slate-700 mb-2 transition-all duration-300"
                density="comfortable"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40" class="mr-3">
                    <span class="text-lg font-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-icon
                    icon="pi pi-thermometer"
                    :color="getTempColor(aula.temperatura)"
                  />
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
                :subtitle="`${aula.humitat.toFixed(1)}%`"
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
        <v-chip class="ma-2 pa-4" color="teal" variant="outlined">
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

const activeTab = ref("so");
const tabs = [
  { value: "so", label: "So" },
  { value: "temperatura", label: "Temperatura" },
  { value: "humitat", label: "Humitat" },
];
const rankingSo = ref([]);
const rankingTemperatura = ref([]);
const rankingHumitat = ref([]);

// Función para obtener el color según la posición
const getRankingColor = (index) => {
  const colors = {
    0: "amber-darken-2", // Oro
    1: "grey-lighten-1", // Plata
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
    // Obtener todos los sensores activos
    const responseSensors = await fetch("http://localhost:3000/api/v1/sensors");
    const sensors = await responseSensors.json();

    // Obtener los últimos datos de cada tipo
    const [responseMinut] = await Promise.all([
      fetch("http://localhost:3000/api/v1/registres/minut"),
    ]);

    const minutData = await responseMinut.json();

    // Procesar los datos para cada sensor activo
    const processedData = sensors
      .filter((sensor) => sensor.actiu === 1) // Solo sensores activos
      .map((sensor) => {
        // Buscar el último registro para este sensor
        const lastRecord = minutData.find(
          (record) => record.id_sensor === sensor.id
        );

        return {
          id: sensor.id,
          nom: sensor.nom,
          volum: sensor.tipus === "volum" ? lastRecord?.valor || 0 : null,
          temperatura: sensor.tipus === "temperatura" ? lastRecord?.valor || 0 : null,
          humitat: sensor.tipus === "humitat" ? lastRecord?.valor || 0 : null,
          volumActive: sensor.tipus === "volum",
          temperaturaActive: sensor.tipus === "temperatura",
          humitatActive: sensor.tipus === "humitat",
        };
      });

    console.log("Processed Data:", processedData); // Para debug

    // Actualizar rankings (solo incluir sensores activos para cada métrica)
    rankingSo.value = processedData
      .filter((sensor) => sensor.volumActive && sensor.volum !== null)
      .sort((a, b) => b.volum - a.volum);

    rankingTemperatura.value = processedData
      .filter((sensor) => sensor.temperaturaActive && sensor.temperatura !== null)
      .sort((a, b) => b.temperatura - a.temperatura);

    rankingHumitat.value = processedData
      .filter((sensor) => sensor.humitatActive && sensor.humitat !== null)
      .sort((a, b) => b.humitat - a.humitat);

    lastUpdate.value = new Date();
  } catch (error) {
    console.error("Error al cargar les dades del ranking:", error);
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

/* Animación para el fondo del header */
.w-full.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

@keyframes gradient {
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

/* Animación de entrada para el título */
h1 {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto hover para los botones */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Animaciones para los elementos de la lista */
.v-list-item {
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Estilos para los chips y badges */
.v-chip {
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: scale(1.05);
}
</style>

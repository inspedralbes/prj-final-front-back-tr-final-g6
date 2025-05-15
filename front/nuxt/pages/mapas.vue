<template>
  <div class="min-h-screen bg-slate-900 flex flex-col">
    <Header />
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6">
      <div class="max-w-7xl mx-auto flex flex-col items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Mapes
        </h1>
        <p class="text-teal-200 font-medium">
          Institut Pedralbes • Visualització de totes les plantes
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-7xl mx-auto px-4 py-6 flex-grow">
      <!-- Plantas Selection -->
      <div class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg text-center">
        <h2 class="text-xl font-semibold text-white mb-4">Selecciona una Planta</h2>
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="planta in plantas"
            :key="planta"
            @click="seleccionarPlanta(planta)"
            :class="[
              'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02]',
              plantaSeleccionada === planta
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-slate-700 border-slate-600 text-white',
            ]"
          >
            {{ planta }}
          </button>
        </div>
      </div>

      <div
        v-if="userStore.user?.admin === 1"
        class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg"
      >
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Botones a la izquierda -->
          <div class="flex flex-wrap gap-3 w-full md:w-auto">
            <button
              @click="togglePopupMode"
              :class="[
                'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 shadow-md hover:shadow-teal-500/20',
                isAddingPopup
                  ? 'bg-red-600 border-red-600 text-white hover:shadow-red-500/20'
                  : 'bg-teal-600 border-teal-600 text-white',
              ]"
            >
              <i :class="isAddingPopup ? 'fas fa-times' : 'fas fa-microchip'"></i>
              <span>{{ isAddingPopup ? "Cancelar" : "Agregar Sensor" }}</span>
            </button>
            <button
              v-if="customPopups.length > 0"
              @click="toggleDeleteMode"
              :class="[
                'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 shadow-md hover:shadow-amber-500/20',
                isDeletingPopup
                  ? 'bg-emerald-600 border-emerald-600 text-white hover:shadow-emerald-500/20'
                  : 'bg-amber-600 border-amber-600 text-white',
              ]"
            >
              <i :class="isDeletingPopup ? 'fas fa-check' : 'fas fa-trash'"></i>
              <span>{{ isDeletingPopup ? "Terminar Borrado" : "Borrar Sensor" }}</span>
            </button>
          </div>

          <div class="flex items-center gap-4 rounded-lg px-5 py-3 w-full md:w-auto">
            <label
              for="dataType"
              class="text-white whitespace-nowrap text-base font-semibold"
              >Tipus de dada:</label
            >
            <select
              id="dataType"
              v-model="selectedSensorType"
              class="bg-slate-800 border-2 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base hover:border-slate-500 transition-colors"
            >
              <option value="temperature">Temperatura</option>
              <option value="humetat">Humitat</option>
              <option value="volume">Volum</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="bg-slate-800 rounded-lg p-2 shadow-lg mb-6">
        <div
          class="relative w-full h-[65vh] min-h-[600px] rounded-xl overflow-hidden border-2 border-slate-700"
          @click="handleMapClick"
          :style="{ cursor: isAddingPopup ? 'crosshair' : 'default' }"
        >
          <Mapaplanta1
            v-if="plantaSeleccionada === 'PLANTA 1'"
            :aulaData="aulaData"
            imageUrl="/planos/planta1.png"
          />
          <Mapaplanta2
            v-if="plantaSeleccionada === 'PLANTA 2'"
            :aulaData="aulaData"
            imageUrl="/planos/planta2.png"
          />
          <Mapaplanta3
            v-if="plantaSeleccionada === 'PLANTA 3'"
            :aulaData="aulaData"
            imageUrl="/planos/planta3.png"
          />
          <MapaPlantaBaixa
            v-if="plantaSeleccionada === 'PLANTA BAJA'"
            :aulaData="aulaData"
            imageUrl="/planos/plantabaja.png"
          />
          <MapaPlantaSubterranea
            v-if="plantaSeleccionada === 'PLANTA SUBTERRANEA'"
            :aulaData="aulaData"
            imageUrl="/planos/plantasubterranea.png"
          />

          <!-- Pop-ups personalizados -->
          <div
            v-for="popup in filteredPopups"
            :key="popup.id"
            :style="{ left: popup.x + 'px', top: popup.y + 'px' }"
            class="custom-popup absolute"
          >
            <!-- Punto indicador -->
            <div
              :class="[
                'marker-point w-8 h-8 rounded-full absolute -top-4 -left-4 border-4 border-white cursor-pointer flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform duration-200 bg-gradient-to-r',
                getMarkerColor(popup),
              ]"
              @click.stop="
                isDeletingPopup ? deletePopup(popup.id) : handlePopupClick(popup)
              "
            >
              <i class="fas fa-map-marker-alt text-white"></i>
            </div>
            <!-- Contenido del popup -->
            <div
              v-if="showingPopupId === popup.id"
              class="popup-content bg-slate-700/90 border-2 border-teal-500 rounded-xl p-8 shadow-2xl min-w-[400px] relative animate-fadeIn overflow-hidden"
            >
              <button
                @click="showingPopupId = null"
                class="delete-btn absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:bg-red-700 transition-all"
              >
                <i class="fas fa-times"></i>
              </button>
              <div
                class="text-white text-lg font-semibold mb-2 flex items-center justify-between"
              >
                <span>{{ popup.text }}</span>
                <span class="text-sm text-gray-400">ID: {{ popup.id }}</span>
              </div>

              <div v-if="lastSensorValues[popup.idAula || popup.id]">
                <div
                  v-if="!lastSensorValues[popup.idAula || popup.id].error"
                  class="mt-4 space-y-2"
                >
                  <div
                    class="flex items-center justify-between p-2 bg-slate-800/70 rounded-lg"
                  >
                    <span class="text-sm text-white">Última Temperatura</span>
                    <span class="text-lg font-bold text-white">
                      {{
                        lastSensorValues[popup.idAula || popup.id].temperatura
                          ?.average !== undefined
                          ? Number(
                              lastSensorValues[popup.idAula || popup.id].temperatura
                                .average
                            ).toFixed(2)
                          : "N/A"
                      }}°C
                    </span>
                  </div>
                  <div
                    class="flex items-center justify-between p-2 bg-slate-800/70 rounded-lg"
                  >
                    <span class="text-sm text-white">Última Humitat</span>
                    <span class="text-lg font-bold text-white">
                      {{
                        lastSensorValues[popup.idAula || popup.id].humitat?.average !==
                        undefined
                          ? Number(
                              lastSensorValues[popup.idAula || popup.id].humitat.average
                            ).toFixed(2)
                          : "N/A"
                      }}ppm
                    </span>
                  </div>
                  <div
                    class="flex items-center justify-between p-2 bg-slate-800/70 rounded-lg"
                  >
                    <span class="text-sm text-white">Últim Volum</span>
                    <span class="text-lg font-bold text-white">
                      {{
                        lastSensorValues[popup.idAula || popup.id].volum?.average !==
                        undefined
                          ? Number(
                              lastSensorValues[popup.idAula || popup.id].volum.average
                            ).toFixed(2)
                          : "N/A"
                      }}
                      dB
                    </span>
                  </div>
                </div>
                <div v-else class="mt-4 text-red-500">Error al cargar los datos</div>
              </div>

              <button
                v-if="isDeletingPopup"
                @click.stop="deletePopup(popup.id)"
                class="delete-btn absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selector de sensores activos -->
    <div
      v-if="showPopupForm"
      class="popup-form fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md w-full">
        <div class="form-header text-xl font-bold text-white mb-4">
          Seleccionar Sensor
        </div>

        <!-- Lista de sensores activos -->
        <div class="space-y-2 max-h-[400px] overflow-y-auto mb-4">
          <div
            v-for="sensor in availableSensors"
            :key="sensor.idSensor"
            @click="selectSensor(sensor)"
            class="p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
          >
            <div class="flex justify-between items-center text-white">
              <div>
                <div class="font-semibold">{{ sensor.nombre }}</div>
                <div class="text-sm text-gray-400">MAC: {{ sensor.mac }}</div>
                <div class="text-sm text-gray-400">Ubicación: {{ sensor.ubicacion }}</div>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Botón para cancelar -->
        <div class="flex justify-end">
          <button
            @click="cancelNewPopup"
            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-colors border border-red-700 hover:scale-[1.02]"
          >
            <i class="fas fa-times mr-2"></i>Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMapa, getAllSensors } from "~/utils/communicationManager";
import Header from "../components/header.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/userStore";
import Dropdown from "primevue/dropdown";
import { getUltimsSensorsAula } from "~/utils/communicationManager";

import Mapaplanta1 from "~/components/Plantes/MapaPlanta-1.vue";
import Mapaplanta2 from "~/components/Plantes/MapaPlanta-2.vue";
import Mapaplanta3 from "~/components/Plantes/MapaPlanta-3.vue";
import MapaPlantaBaixa from "~/components/Plantes/MapaPlantaBaixa.vue";
import MapaPlantaSubterranea from "~/components/Plantes/MapaPlantaSubterranea.vue";

const plantas = ["PLANTA BAJA", "PLANTA 1", "PLANTA 2", "PLANTA 3", "PLANTA SUBTERRANEA"];
const plantaSeleccionada = ref("PLANTA 1");
const aulaData = ref([]);
const fetchDataText = ref("");
const selectedSensorType = ref("temperature");
const lastSensorValues = ref({}); // Guarda los últimos valores por sensor

// Estado para los pop-ups personalizados
const activeSensors = ref([]);
const customPopups = ref([]);
const showingPopupId = ref(null);
const isAddingPopup = ref(false);
const isDeletingPopup = ref(false);

// Cargar sensores activos al montar el componente (persistencia local)
onMounted(async () => {
  const savedSensors = localStorage.getItem("activeSensors");
  if (savedSensors) {
    try {
      activeSensors.value = JSON.parse(savedSensors);
    } catch (e) {
      activeSensors.value = [];
    }
  } else {
    try {
      const data = await getAllSensors();
      activeSensors.value = data
        .filter((sensor) => sensor.mac && sensor.ubicacion && sensor.ubicacion !== null)
        .map((sensor) => ({
          ...sensor,
          temperature: sensor.temperature || 0,
          humetat: sensor.humetat || 0,
          volume: sensor.volume || 0,
        }));
    } catch (error) {
      activeSensors.value = [];
    }
  }
});

const showPopupForm = ref(false);
const newPopupText = ref("");
const tempPopupPosition = ref(null);

// Cargar pop-ups guardados al iniciar (si usas customPopups)
onMounted(() => {
  const savedPopups = localStorage.getItem("customMapPopups");
  if (savedPopups) {
    customPopups.value = JSON.parse(savedPopups);
  } else {
    customPopups.value = [];
  }
});

// Guardar sensores activos en localStorage cuando cambien
watch(
  activeSensors,
  (newSensors) => {
    localStorage.setItem("activeSensors", JSON.stringify(newSensors));
  },
  { deep: true }
);

// Filtrar pop-ups por planta seleccionada
const filteredPopups = computed(() => {
  return activeSensors.value.filter((sensor) => {
    return sensor.planta === plantaSeleccionada.value;
  });
});

const deletePopup = (id) => {
  activeSensors.value = activeSensors.value.filter(
    (sensor) => sensor.id !== id && sensor.idSensor !== id
  );
  customPopups.value = customPopups.value.filter((popup) => popup.id !== id);
};

const togglePopupMode = () => {
  isAddingPopup.value = !isAddingPopup.value;
  isDeletingPopup.value = false;
};

const toggleDeleteMode = () => {
  isDeletingPopup.value = !isDeletingPopup.value;
  isAddingPopup.value = false;
};

const handleMapClick = async (event) => {
  if (!isAddingPopup.value) return;

  const mapContent = event.currentTarget;
  const rect = mapContent.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  tempPopupPosition.value = { x, y };
  await loadAvailableSensors();
  showPopupForm.value = true;
};

const availableSensors = ref([]);

const loadAvailableSensors = async () => {
  try {
    const data = await getAllSensors();
    // Filtra los sensores que ya están colocados en cualquier planta
    const placedIds = activeSensors.value.map((s) => s.idSensor || s.id);
    availableSensors.value = data
      .filter((sensor) => sensor.mac && !placedIds.includes(sensor.idSensor || sensor.id))
      .map((sensor) => ({
        ...sensor,
        temperature: sensor.temperature || 0,
        humetat: sensor.humetat || 0,
        volume: sensor.volume || 0,
      }));
  } catch (error) {
    availableSensors.value = [];
  }
};

const selectSensor = (sensor) => {
  if (!tempPopupPosition.value) return;

  const newSensor = {
    ...sensor,
    x: tempPopupPosition.value.x,
    y: tempPopupPosition.value.y,
    planta: plantaSeleccionada.value,
    temperature: sensor.temperature || 0,
    humetat: sensor.humetat || 0,
    volume: sensor.volume || 0,
  };

  activeSensors.value.push(newSensor);
  cancelNewPopup();
  isAddingPopup.value = false;
  showingPopupId.value = sensor.idSensor || sensor.id;
};

const cancelNewPopup = () => {
  showPopupForm.value = false;
  newPopupText.value = "";
  tempPopupPosition.value = null;
};

const getMarkerColor = (popup) => {
  const value = popup[selectedSensorType.value];
  const range = getSensorRange(selectedSensorType.value);

  if (value >= range.high) {
    return "bg-red-500";
  } else if (value >= range.medium) {
    return "bg-yellow-500";
  } else {
    return "bg-green-500";
  }
};

const getSensorLabel = () => {
  switch (selectedSensorType.value) {
    case "temperature":
      return "Temperatura";
    case "humetat":
      return "Humitat";
    case "volume":
      return "Volumen";
    default:
      return "";
  }
};

const getSensorRange = (type) => {
  switch (type) {
    case "temperature":
      return { low: 15, medium: 25, high: 30 };
    case "humetat":
      return { low: 400, medium: 1000, high: 2000 };
    case "volume":
      return { low: 40, medium: 60, high: 80 };
    default:
      return { low: 0, medium: 50, high: 100 };
  }
};

const getSensorStatusColorByValue = (value, type) => {
  const range = getSensorRange(type);

  if (value >= range.high) {
    return "bg-red-500";
  } else if (value >= range.medium) {
    return "bg-yellow-500";
  } else {
    return "bg-green-500";
  }
};

const getSensorValue = (popup) => {
  const value = popup[selectedSensorType.value];
  switch (selectedSensorType.value) {
    case "temperature":
      return `${value}°C`;
    case "humetat":
      return `${value}ppm`;
    case "volume":
      return `${value} dB`;
    default:
      return value;
  }
};

const getSensorStatusColorByType = (popup) => {
  const value = popup[selectedSensorType.value];
  return getSensorStatusColorByValue(value, selectedSensorType.value);
};

const getPopupPosition = (popup) => {
  const mapContainer = document.querySelector(".map-content");
  if (!mapContainer) return { class: "" };

  const mapRect = mapContainer.getBoundingClientRect();
  const centerX = mapRect.width / 2;
  const centerY = mapRect.height / 2;

  const isLeft = popup.x < centerX;
  const isTop = popup.y < centerY;

  return {
    class: `popup-${isTop ? "bottom" : "top"}-${isLeft ? "right" : "left"}`,
  };
};

const handlePopupClick = async (popup) => {
  if (isDeletingPopup.value) {
    deletePopup(popup.id);
  } else {
    showingPopupId.value = popup.id;
    // Cargar últimos valores solo si no están ya cargados
    if (!lastSensorValues.value[popup.idAula || popup.id]) {
      try {
        // popup.idAula o popup.id según tu estructura
        const data = await getUltimsSensorsAula(popup.idAula || popup.id);
        lastSensorValues.value[popup.idAula || popup.id] = data;
      } catch (e) {
        lastSensorValues.value[popup.idAula || popup.id] = { error: true };
      }
    }
  }
};
const fetchData = async () => {
  try {
    const bodyRequest = {
      aules: [8, 10, 12, 9, 11, 13, 42, 49, 43, 54, 44, 45, 46],
      data: "2025-02-10",
      tipus: "volum",
    };

    const response = await getMapa(bodyRequest);
    aulaData.value = response;
  } catch (error) {
    // Manejo de error
  }
};

const seleccionarPlanta = (planta) => {
  plantaSeleccionada.value = planta;
};

const router = useRouter();
const userStore = useUserStore();

const isAdmin = computed(() => userStore.user?.admin === 1);

onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
/* Estilos para el contenedor del mapa */
.map-container {
  background: linear-gradient(135deg, #0f172a 70%, #134e4a 100%);
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.45);
}

/* Estilos para los pop-ups */
.custom-popup {
  pointer-events: none;
  z-index: 20;
}

.popup-content {
  position: absolute;
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(51, 65, 85, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 116, 139, 0.5);
  z-index: 50;
}

/* Orientaciones del popup */
.popup-top-left {
  transform: translate(-100%, -100%) translate(32px, 32px);
  left: -16px;
  top: -16px;
}

.popup-top-right {
  transform: translate(0%, -100%) translate(-32px, 32px);
  left: 16px;
  top: -16px;
}

.popup-bottom-left {
  transform: translate(-100%, 0%) translate(32px, -32px);
  left: -16px;
  top: 16px;
}

.popup-bottom-right {
  transform: translate(0%, 0%) translate(-32px, -32px);
  left: 16px;
  top: 16px;
}

.custom-popup .marker-point,
.custom-popup .popup-content,
.custom-popup .delete-btn {
  pointer-events: auto;
}

.popup-content {
  position: absolute;
  transform: translate(-50%, 10px);
  left: 50%;
  max-width: 450px;
  width: max-content;
  z-index: 9999;
  background: rgba(51, 65, 85, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
  border: 1px solid rgba(100, 116, 139, 0.5);
  will-change: transform;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.popup-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(0,255,0,0.1), rgba(255,0,0,0.1));
  opacity: 0.6;
  z-index: 0;
  filter: blur(20px);
  animation: temperatureGradient 5s infinite;
}

@keyframes temperatureGradient {
  0% {
    background: linear-gradient(45deg, rgba(0,255,0,0.2), rgba(255,255,0,0.2));
    transform: scale(1);
  }
  50% {
    background: linear-gradient(45deg, rgba(255,255,0,0.2), rgba(255,0,0,0.2));
    transform: scale(1.05);
  }
  100% {
    background: linear-gradient(45deg, rgba(0,255,0,0.2), rgba(255,255,0,0.2));
    transform: scale(1);
  }
}

.popup-content > * {
  position: relative;
  z-index: 1;
}

.marker-point {
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.marker-point i {
  position: relative;
  z-index: 2;
}

.bg-red-500 {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  animation: markerGradientHot 4s infinite;
}

.bg-yellow-500 {
  background: linear-gradient(45deg, #eab308, #f59e0b);
  animation: markerGradientWarm 4s infinite;
}

.bg-green-500 {
  background: linear-gradient(45deg, #22c55e, #15803d);
  animation: markerGradientCool 4s infinite;
}

@keyframes markerGradientHot {
  0% {
    background: linear-gradient(0deg, #ef4444, #dc2626);
  }
  50% {
    background: linear-gradient(180deg, #b91c1c, #ef4444);
  }
  100% {
    background: linear-gradient(360deg, #ef4444, #dc2626);
  }
}

@keyframes markerGradientWarm {
  0% {
    background: linear-gradient(0deg, #eab308, #f59e0b);
  }
  50% {
    background: linear-gradient(180deg, #d97706, #eab308);
  }
  100% {
    background: linear-gradient(360deg, #eab308, #f59e0b);
  }
}

@keyframes markerGradientCool {
  0% {
    background: linear-gradient(0deg, #22c55e, #15803d);
  }
  50% {
    background: linear-gradient(180deg, #16a34a, #22c55e);
  }
  100% {
    background: linear-gradient(360deg, #22c55e, #15803d);
  }
}

.marker-point::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.8;
  z-index: -1;
  animation: pulseGlow 3s infinite;
}

.bg-red-500::before {
  background: radial-gradient(circle at center, rgba(255,0,0,0.4), transparent 70%);
}

.bg-yellow-500::before {
  background: radial-gradient(circle at center, rgba(255,200,0,0.4), transparent 70%);
}

.bg-green-500::before {
  background: radial-gradient(circle at center, rgba(0,255,0,0.4), transparent 70%);
}

.marker-point::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle at center, rgba(255,255,255,0.3), transparent 70%);
  border-radius: 50%;
  filter: blur(4px);
  opacity: 0.4;
  z-index: -1;
  animation: pulseGlow 3s infinite reverse;
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.delete-btn {
  transition: all 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.1);
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
button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Estilos para el dropdown de selección */
select {
  background: rgb(51, 65, 85);
  border: 1px solid rgb(71, 85, 105);
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
}

select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
  border-color: rgb(45, 212, 191);
}
</style>

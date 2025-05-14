<template>
  <div class="min-h-screen bg-slate-900 flex flex-col">
    <Header />
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6 relative">
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
      <div class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-semibold text-white mb-4">Selecciona una Planta</h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="planta in plantas"
            :key="planta"
            @click="seleccionarPlanta(planta)"
            :class="[
              'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02]',
              plantaSeleccionada === planta
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700',
            ]"
          >
            {{ planta }}
          </button>
        </div>
      </div>

      <!-- Sensor Controls -->
      <div class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex flex-wrap gap-3">
            <button
              @click="togglePopupMode"
              :class="[
                'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02] flex items-center gap-2',
                isAddingPopup
                  ? 'bg-red-600 border-red-600 text-white'
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
                'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02] flex items-center gap-2',
                isDeletingPopup
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-amber-600 border-amber-600 text-white',
              ]"
            >
              <i :class="isDeletingPopup ? 'fas fa-check' : 'fas fa-trash'"></i>
              <span>{{ isDeletingPopup ? "Terminar Borrado" : "Borrar Sensor" }}</span>
            </button>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm text-teal-400 font-medium">Tipo de Sensor:</label>
            <select
              v-model="selectedSensorType"
              class="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="temperature">Temperatura</option>
              <option value="co2">CO2</option>
              <option value="volume">Volumen</option>
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
          <Mapaplanta1 v-if="plantaSeleccionada === 'PLANTA 1'" :aulaData="aulaData" />
          <Mapaplanta2 v-if="plantaSeleccionada === 'PLANTA 2'" :aulaData="aulaData" />
          <Mapaplanta3 v-if="plantaSeleccionada === 'PLANTA 3'" :aulaData="aulaData" />
          <MapaPlantaBaixa
            v-if="plantaSeleccionada === 'PLANTA BAJA'"
            :aulaData="aulaData"
          />
          <MapaPlantaSubterranea
            v-if="plantaSeleccionada === 'PLANTA SUBTERRANEA'"
            :aulaData="aulaData"
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
                'marker-point w-6 h-6 rounded-full absolute -top-3 -left-3 border-4 border-white cursor-pointer flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform duration-200',
                getMarkerColor(popup),
              ]"
              @click.stop="
                isDeletingPopup ? deletePopup(popup.id) : (showingPopupId = popup.id)
              "
            >
              <i class="fas fa-map-marker-alt text-white"></i>
            </div>
            <!-- Contenido del popup -->
            <div
              v-if="showingPopupId === popup.id"
              :class="[
                'popup-content bg-slate-700 border-2 border-teal-500 rounded-2xl p-6 shadow-2xl min-w-[300px] relative animate-fadeIn',
                getPopupPosition(popup).class,
              ]"
              class="popup-content bg-slate-700 border-2 border-teal-500 rounded-xl p-6 shadow-2xl min-w-[300px] relative animate-fadeIn"
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
              <div class="text-gray-300">
                <div
                  class="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      :class="['w-3 h-3 rounded-full', getSensorStatusColorByType(popup)]"
                    ></div>
                    <span class="text-sm">{{ getSensorLabel() }}</span>
                  </div>
                  <span
                    :class="[getSensorStatusColorByType(popup).replace('bg-', 'text-')]"
                    class="text-lg font-bold"
                    >{{ getSensorValue(popup) }}</span
                  >
                </div>
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

    <!-- Formulario para nuevo pop-up -->
    <div
      v-if="showPopupForm"
      class="popup-form fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md w-full">
        <div class="form-header text-xl font-bold text-white mb-4">Nuevo Sensor</div>
        <input
          v-model="newPopupText"
          placeholder="Texto del Sensor"
          class="popup-input w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all mb-4"
          @keyup.enter="confirmNewPopup"
          @keyup.esc="cancelNewPopup"
        />
        <div class="flex space-x-3 justify-end">
          <button
            @click="confirmNewPopup"
            class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors border border-emerald-700 hover:scale-[1.02]"
          >
            <i class="fas fa-check mr-2"></i>Confirmar
          </button>
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
import Header from "../components/header.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/userStore";

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

// Estado para los pop-ups personalizados
const activeSensors = ref([]);
const customPopups = ref([]);
const showingPopupId = ref(null);
const isAddingPopup = ref(false);
const isDeletingPopup = ref(false);

// Cargar sensores activos al montar el componente
onMounted(async () => {
  try {
    // Aquí deberías hacer la llamada a tu API para obtener los sensores activos
    const response = await fetch("http://localhost:3000/api/sensors/active");
    const data = await response.json();
    activeSensors.value = data.map((sensor) => ({
      id: sensor.idSensor,
      x: sensor.x,
      y: sensor.y,
      nombre: sensor.nombre,
      ubicacion: sensor.ubicacion,
      mac: sensor.mac,
    }));
  } catch (error) {
    console.error("Error al cargar los sensores activos:", error);
  }
});
const showPopupForm = ref(false);
const newPopupText = ref("");
const tempPopupPosition = ref(null);

// Cargar pop-ups guardados al iniciar
onMounted(() => {
  const savedPopups = localStorage.getItem("customMapPopups");
  if (savedPopups) {
    customPopups.value = JSON.parse(savedPopups);
  } else {
    customPopups.value = [];
  }
});

// Guardar pop-ups cuando cambien
watch(
  customPopups,
  (newPopups) => {
    localStorage.setItem("customMapPopups", JSON.stringify(newPopups));
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
  activeSensors.value = activeSensors.value.filter((sensor) => sensor.id !== id);
  customPopups.value = customPopups.value.filter((popup) => popup.id !== id);
};

// Funciones para gestionar pop-ups
const togglePopupMode = () => {
  isAddingPopup.value = !isAddingPopup.value;
  isDeletingPopup.value = false;
};

const toggleDeleteMode = () => {
  isDeletingPopup.value = !isDeletingPopup.value;
  isAddingPopup.value = false;
};

const handleMapClick = (event) => {
  if (!isAddingPopup.value) return;

  const mapContent = event.currentTarget;
  const rect = mapContent.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  tempPopupPosition.value = { x, y };
  showPopupForm.value = true;
};

const confirmNewPopup = () => {
  if (newPopupText.value.trim() && tempPopupPosition.value) {
    const newSensor = {
      id: Date.now(),
      text: newPopupText.value,
      x: tempPopupPosition.value.x,
      y: tempPopupPosition.value.y,
      planta: plantaSeleccionada.value,
      temperature: Math.floor(Math.random() * (25 - 18 + 1)) + 18, // 18-25°C
      humedat: Math.floor(Math.random() * (70 - 30 + 1)) + 30, // 30-70%
      volume: Math.floor(Math.random() * (80 - 40 + 1)) + 40, // 40-80 dB
    };
    customPopups.value.push(newSensor);
    cancelNewPopup();
    isAddingPopup.value = false;
  }
};

const cancelNewPopup = () => {
  showPopupForm.value = false;
  newPopupText.value = "";
  tempPopupPosition.value = null;
};

const getMarkerColor = (popup) => {
  const value = popup[selectedSensorType.value];
  const range = getSensorRange();

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
    case "co2":
      return "CO2";
    case "volume":
      return "Volumen";
    default:
      return "";
  }
};

const getSensorRange = () => {
  switch (selectedSensorType.value) {
    case "temperature":
      return { low: 18, medium: 22, high: 25 };
    case "humetat":
      return { low: 30, medium: 50, high: 70 };
    case "volume":
      return { low: 40, medium: 60, high: 80 };
    default:
      return { low: 0, medium: 50, high: 100 };
  }
};

const getSensorValue = (popup) => {
  const value = popup[selectedSensorType.value];
  switch (selectedSensorType.value) {
    case "temperature":
      return `${value}°C`;
    case "humetat":
      return `${value}%`;
    case "volume":
      return `${value} dB`;
    default:
      return value;
  }
};

const getSensorStatusColorByType = (popup) => {
  const value = popup[selectedSensorType.value];
  const range = getSensorRange();

  if (value >= range.high) {
    return "bg-red-500";
  } else if (value >= range.medium) {
    return "bg-yellow-500";
  } else {
    return "bg-green-500";
  }
};

const getSensorStatusColor = (value, min, max) => {
  const colors = [
    "bg-blue-400", // 0-10%
    "bg-blue-300", // 10-20%
    "bg-cyan-400", // 20-30%
    "bg-teal-400", // 30-40%
    "bg-green-400", // 40-50%
    "bg-yellow-400", // 50-60%
    "bg-orange-400", // 60-70%
    "bg-orange-500", // 70-80%
    "bg-red-400", // 80-90%
    "bg-red-500", // 90-100%
  ];

  const normalized = (value - min) / (max - min);
  const colorIndex = Math.min(Math.floor(normalized * 10), 9);
  return colors[Math.max(0, colorIndex)];
};

const getPopupPosition = (popup) => {
  const mapContainer = document.querySelector(".map-content");
  if (!mapContainer) return { class: "" };

  const mapRect = mapContainer.getBoundingClientRect();
  const centerX = mapRect.width / 2;
  const centerY = mapRect.height / 2;

  // Determinar en qué cuadrante está el popup respecto al centro
  const isLeft = popup.x < centerX;
  const isTop = popup.y < centerY;

  // Retornar la clase correspondiente para la orientación
  return {
    class: `popup-${isTop ? "bottom" : "top"}-${isLeft ? "right" : "left"}`,
  };
};

const handlePopupClick = (popup) => {
  if (isDeletingPopup.value) {
    deletePopup(popup.id);
  } else {
    showingPopupId.value = popup.id;
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

    console.log("Datos recibidos:", aulaData.value);
  } catch (error) {
    console.error("Error al obtener datos:", error);
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
  max-width: 300px;
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

.marker-point {
  transition: transform 0.2s, box-shadow 0.2s;
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

/* Estilo para los botones */
button {
  transition: all 0.3s ease;
}

/* Efecto hover para los botones */
button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

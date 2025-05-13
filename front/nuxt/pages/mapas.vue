<template>
  <div class="min-h-screen flex flex-col bg-slate-900">
    <Header />
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6 relative">
      <!-- Botón de retroceso -->
      <NuxtLink to="/aulas" class="absolute right-6 top-1/2 transform -translate-y-1/2">
        <button
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2 border border-slate-600"
        >
          <i class="fas fa-arrow-left"></i>
          <span>Volver a Aulas</span>
        </button>
      </NuxtLink>
      <div class="max-w-7xl mx-auto flex flex-col items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Mapes
        </h1>
        <p class="text-teal-200 font-medium">
          Institut Pedralbes • Visualització de totes les plantes
        </p>
      </div>
    </div>

    <div class="w-full max-w-7xl mx-auto px-4 py-6 flex-grow">
      <!-- Botones de plantas -->
      <div class="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          v-for="planta in plantas"
          :key="planta"
          @click="seleccionarPlanta(planta)"
          class="px-6 py-3 text-lg font-semibold bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-teal-500"
        >
          {{ planta }}
        </button>
      </div>

      <!-- Botones para gestionar pop-ups -->
      <div class="mb-6 flex flex-wrap gap-4 justify-center">
        <button
          @click="togglePopupMode"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border',
            isAddingPopup
              ? 'bg-red-600 hover:bg-red-700 border-red-700 text-white'
              : 'bg-teal-600 hover:bg-teal-700 border-teal-700 text-white',
          ]"
        >
          <div class="flex items-center space-x-2">
            <i :class="isAddingPopup ? 'fas fa-times' : 'fas fa-microchip'"></i>
            <span>{{ isAddingPopup ? "Cancelar" : "Agregar Sensor" }}</span>
          </div>
        </button>
        <button
          v-if="customPopups.length > 0"
          @click="toggleDeleteMode"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border',
            isDeletingPopup
              ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 border-amber-700 text-white',
          ]"
        >
          <div class="flex items-center space-x-2">
            <i :class="isDeletingPopup ? 'fas fa-check' : 'fas fa-trash'"></i>
            <span>{{ isDeletingPopup ? "Terminar Borrado" : "Borrar Sensor" }}</span>
          </div>
        </button>
      </div>

      <!-- Componente Mapa -->
      <ComponentMapa v-model:sensorType="selectedSensorType" />

      <!-- Contenedor del mapa - MODIFICADO -->
      <div
        class="bg-slate-800 p-2 rounded-2xl shadow-2xl border-2 border-slate-700 flex items-center justify-center map-container"
        style="
          height: 55vh;
          min-height: 600px;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
        "
      >
        <!-- Contenedor interno del mapa que será el área clickeable -->
        <div
          class="map-content relative w-full h-full"
          @click="handleMapClick"
          style="cursor: crosshair"
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
                getPopupPosition(popup).class
              ]"
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
                <div class="flex items-center justify-between p-2">
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
              class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors border border-emerald-700"
            >
              <i class="fas fa-check mr-2"></i>Confirmar
            </button>
            <button
              @click="cancelNewPopup"
              class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-colors border border-red-700"
            >
              <i class="fas fa-times mr-2"></i>Cancelar
            </button>
          </div>
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
const selectedSensorType = ref("temperature"); // Tipo de sensor seleccionado por defecto

// Estado para los pop-ups personalizados
const customPopups = ref([]);
const isAddingPopup = ref(false);
const isDeletingPopup = ref(false);
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
  return customPopups.value.filter((popup) => popup.planta === plantaSeleccionada.value);
});

// Funciones para gestionar pop-ups
const showingPopupId = ref(null);

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

  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  tempPopupPosition.value = { x, y };
  showPopupForm.value = true;
};

const confirmNewPopup = () => {
  if (newPopupText.value.trim() && tempPopupPosition.value) {
    const randomData = {
      humidity: Math.floor(Math.random() * 30) + 40,
      temperature: Math.floor(Math.random() * 10) + 20,
      volume: Math.floor(Math.random() * 50) + 50,
    };

    customPopups.value.push({
      id: Date.now(),
      text: newPopupText.value,
      x: tempPopupPosition.value.x,
      y: tempPopupPosition.value.y,
      planta: plantaSeleccionada.value,
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      co2: Math.floor(Math.random() * 1600) + 400, // 400-2000 ppm
      volume: Math.floor(Math.random() * 50) + 35, // 35-85 dB
    });

    cancelNewPopup();
    isAddingPopup.value = false;
  }
};

const cancelNewPopup = () => {
  showPopupForm.value = false;
  newPopupText.value = "";
  tempPopupPosition.value = null;
};

const deletePopup = (id) => {
  customPopups.value = customPopups.value.filter((popup) => popup.id !== id);
};

// Ahora los popups solo se muestran al hacer clic en el marcador
// y solo uno puede estar abierto a la vez
const getMarkerColor = (popup) => {
  const value = getSensorValueNumber(popup);
  const { min, max } = getSensorRange();
  const norm = (value - min) / (max - min);

  // Usar la misma escala de colores que getSensorStatusColor
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

  const colorIndex = Math.min(Math.floor(norm * 10), 9);
  return colors[Math.max(0, colorIndex)];
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
      return { min: 15, max: 30 };
    case "co2":
      return { min: 400, max: 2000 };
    case "volume":
      return { min: 35, max: 85 };
    default:
      return { min: 0, max: 100 };
  }
};

const getSensorValueNumber = (popup) => {
  switch (selectedSensorType.value) {
    case "temperature":
      return popup.temperature;
    case "co2":
      return popup.co2;
    case "volume":
      return popup.volume;
    default:
      return 0;
  }
};

const getSensorValue = (popup) => {
  const value = getSensorValueNumber(popup);
  switch (selectedSensorType.value) {
    case "temperature":
      return `${value}°C`;
    case "co2":
      return `${value}ppm`;
    case "volume":
      return `${value}dB`;
    default:
      return value;
  }
};

const getSensorStatusColorByType = (popup) => {
  const value = getSensorValueNumber(popup);
  const { min, max } = getSensorRange();
  return getSensorStatusColor(value, min, max);
};

const getAlertLevel = (value, normal, warning, critical) => {
  if (value >= critical) return 3; // Crítico
  if (value >= warning) return 2; // Alto
  if (value >= normal) return 1; // Moderado
  return 0; // Normal
};

const getSensorStatusColor = (value, min, max) => {
  // Crear una escala de colores desde azul (frío/bajo) hasta rojo (caliente/alto)
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

  // Normalizar el valor entre 0 y 1
  const normalized = (value - min) / (max - min);
  // Obtener el índice del color (0-9)
  const colorIndex = Math.min(Math.floor(normalized * 10), 9);
  // Retornar el color correspondiente
  return colors[Math.max(0, colorIndex)];
};

const getPopupPosition = (popup) => {
  const mapContainer = document.querySelector('.map-content');
  if (!mapContainer) return { class: '' };

  const mapRect = mapContainer.getBoundingClientRect();
  const centerX = mapRect.width / 2;
  const centerY = mapRect.height / 2;

  // Determinar en qué cuadrante está el popup respecto al centro
  const isLeft = popup.x < centerX;
  const isTop = popup.y < centerY;

  // Retornar la clase correspondiente para la orientación
  return {
    class: `popup-${isTop ? 'bottom' : 'top'}-${isLeft ? 'right' : 'left'}`
  };
};

const handlePopupClick = (popup) => {
  if (isDeletingPopup.value) {
    deletePopup(popup.id);
  } else {
    showingPopupId.value = popup.id;
  }
};

// Obtener los datos de la base de datos
const fetchData = async () => {
  try {
    const bodyRequest = {
      aules: [8, 10, 12, 9, 11, 13, 42, 49, 43, 54, 44, 45, 46],
      data: "2025-02-10",
      tipus: "volum",
    };

    const response = await getMapa(bodyRequest);
    aulaData.value = response;

    fetchDataText.value = response
      .map((aula) => {
        return `Aula: ${aula.idAula}, Volumen: ${aula.average}`;
      })
      .join("\n");

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

<style>
.map-container {
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #0f172a 70%, #134e4a 100%);
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.45);
}

.map-content {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: none;
  user-select: none;
}

/* Prevenir zoom con atajos en la página (solo para desktop) */
html,
body {
  background: #0f172a;
  overflow-x: hidden;
}

/* Ajustes para los pop-ups */
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

.popup-content {
  animation: none;
  opacity: 1;
}

.marker-point {
  transition: transform 0.2s, box-shadow 0.2s;
}

.delete-btn {
  transition: all 0.2s ease;
  font-size: 1.5rem;
}

.delete-btn:hover {
  transform: scale(1.1);
}

/* Contenedor de los pop-ups */
.custom-popup {
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 20;
}

.custom-popup:hover {
  transform: translateY(-3px);
}

.popup-content {
  animation: fadeIn 0.3s;
  z-index: 30;
  display: block;
  position: relative;
}

.popup-content:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.marker-point {
  z-index: 5;
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
</style>

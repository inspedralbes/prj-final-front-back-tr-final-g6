<template>
  <div class="min-h-screen flex flex-col animated-bg">
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6 relative">
      <!-- Logo Acoubox -->
      <div class="absolute left-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
        <img src="/logo.jpg" alt="Acoubox Logo" class="h-10 w-10" />
        <span class="text-white text-xl font-semibold">Acoubox</span>
      </div>
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

      <!-- Contenedor del mapa -->
      <div
        class="bg-slate-800 p-2 rounded-2xl shadow-2xl border-2 border-slate-700 flex items-center justify-center map-container"
        style="
          height: 55vh;
          min-height: 600px;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
          cursor: crosshair; /* Indicador de que se puede hacer clic */
        "
        @click="handleMapClick"
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
            class="popup-content bg-slate-700 border-2 border-teal-500 rounded-2xl p-6 shadow-2xl min-w-[300px] relative animate-fadeIn"
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
            <div class="text-gray-300 space-y-3">
              <!-- Temperatura -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      getSensorStatusColor(popup.temperature, 15, 30),
                    ]"
                  ></div>
                  <span>Temperatura:</span>
                </div>
                <span
                  :class="[
                    getSensorStatusColor(popup.temperature, 15, 30).replace(
                      'bg-',
                      'text-'
                    ),
                  ]"
                  >{{ popup.temperature }}°C</span
                >
              </div>

              <!-- CO2 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      getSensorStatusColor(popup.co2, 400, 2000),
                    ]"
                  ></div>
                  <span>CO2:</span>
                </div>
                <span
                  :class="[
                    getSensorStatusColor(popup.co2, 400, 2000).replace('bg-', 'text-'),
                  ]"
                  >{{ popup.co2 }}ppm</span
                >
              </div>

              <!-- Volumen -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      getSensorStatusColor(popup.volume, 35, 85),
                    ]"
                  ></div>
                  <span>Volumen:</span>
                </div>
                <span
                  :class="[
                    getSensorStatusColor(popup.volume, 35, 85).replace('bg-', 'text-'),
                  ]"
                  >{{ popup.volume }}dB</span
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
  // Normalizar cada valor en una escala de 0 a 1
  const tempNorm = (popup.temperature - 15) / (30 - 15);
  const co2Norm = (popup.co2 - 400) / (2000 - 400);
  const volumeNorm = (popup.volume - 35) / (85 - 35);

  // Obtener el valor normalizado más alto
  const maxNorm = Math.max(tempNorm, co2Norm, volumeNorm);

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

  const colorIndex = Math.min(Math.floor(maxNorm * 10), 9);
  return colors[Math.max(0, colorIndex)];
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

const handlePopupClick = (popup) => {
  if (isDeletingPopup.value) {
    deletePopup(popup.id);
  } else {
    showingPopupId.value = popup.id;
  }
};

// Eliminar popups hardcodeados: asegurarse de que solo se usan los dinámicos
// (No hay popups hardcodeados, solo los del array customPopups)

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
.animated-bg {
  position: relative;
  min-height: 100vh;
  /* Animated gradient background */
  background: linear-gradient(270deg, #0f172a, #134e4a, #1e293b, #0e7490, #0f172a);
  background-size: 400% 400%;
  animation: gradientBG 18s ease infinite;
}
@keyframes gradientBG {
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

.map-container {
  overflow: hidden;
  position: relative;
  touch-action: none;
  user-select: none;
  background: linear-gradient(135deg, #0f172a 70%, #134e4a 100%);
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.45);
}

/* Prevenir zoom con atajos en la página (solo para desktop) */
html,
body {
  background: #0f172a;
  overflow-x: hidden;
}

/* Contenedor del mapa y área clickeable */
.map-container {
  cursor: crosshair;
  /* El área clickeable solo será el contenedor del mapa */
  pointer-events: all;
}

/* Asegurar que los pop-ups no interfieran con los clicks en el mapa */
.custom-popup {
  pointer-events: none; /* Por defecto, ignorar clicks */
  z-index: 20;
}

/* Pero permitir clicks en los elementos interactivos dentro del pop-up */
.custom-popup .marker-point,
.custom-popup .popup-content,
.custom-popup .delete-btn {
  pointer-events: auto;
}

/* Ajustar el tamaño y posición del contenido del pop-up */
.popup-content {
  transform: translateY(1rem); /* Mover un poco hacia abajo para no tapar el marcador */
  max-width: 300px; /* Limitar el ancho máximo */
  z-index: 30;
}

.popup-content {
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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
  z-index: 20; /* Aseguramos que los pop-ups estén por encima de otros elementos */
}

.custom-popup:hover {
  transform: translateY(-3px);
}

/* Cambiar el estilo para los pop-ups */
.popup-content {
  animation: fadeIn 0.3s;
  z-index: 30; /* Aseguramos que el contenido del popup esté encima de otros elementos */
  display: block; /* Asegura que los pop-ups sean visibles */
  position: relative; /* Cambiar a relative si es necesario */
}

/* Evitar que los pop-ups invisibles interrumpan las interacciones */
.custom-popup {
  pointer-events: auto; /* Asegura que los pop-ups sean interactivos */
}

/* Añadir reglas para el fondo animado */
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

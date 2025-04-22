<template>
  <div class="min-h-screen bg-slate-900 flex flex-col">
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
            <i :class="isAddingPopup ? 'fas fa-times' : 'fas fa-plus'"></i>
            <span>{{ isAddingPopup ? "Cancelar" : "Agregar Pop-up" }}</span>
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
            <span>{{ isDeletingPopup ? "Terminar Borrado" : "Borrar Pop-ups" }}</span>
          </div>
        </button>
      </div>

      <!-- Contenedor del mapa - AHORA MÁS GRANDE -->
      <div
        class="map-container bg-slate-800 p-2 rounded-2xl shadow-2xl border-2 border-slate-700 flex items-center justify-center mx-auto"
        style="height: 80vh; min-height: 600px; width: 95vw; max-width: 1600px;"
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
            class="marker-point w-6 h-6 bg-red-500 rounded-full absolute -top-3 -left-3 border-4 border-white cursor-pointer flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform duration-200"
            @click.stop="isDeletingPopup ? deletePopup(popup.id) : showingPopupId = popup.id"
          >
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <!-- Contenido del popup -->
          <div v-if="showingPopupId === popup.id"
            class="popup-content bg-slate-700 border-2 border-teal-500 rounded-2xl p-6 shadow-2xl min-w-[220px] relative animate-fadeIn"
          >
            <button @click="showingPopupId = null" class="delete-btn absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:bg-red-700 transition-all">
              <i class="fas fa-times"></i>
            </button>
            <div class="popup-header font-bold text-white mb-2">{{ popup.text }}</div>
            <div class="popup-data space-y-1">
              <div class="data-item flex justify-between">
                <span class="label text-slate-300">Humedad:</span>
                <span class="value text-teal-400">{{ popup.humidity }}%</span>
              </div>
              <div class="data-item flex justify-between">
                <span class="label text-slate-300">Temperatura:</span>
                <span class="value text-teal-400">{{ popup.temperature }}°C</span>
              </div>
              <div class="data-item flex justify-between">
                <span class="label text-slate-300">Volumen:</span>
                <span class="value text-teal-400">{{ popup.volume }}</span>
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
          <div class="form-header text-xl font-bold text-white mb-4">Nuevo Pop-up</div>
          <input
            v-model="newPopupText"
            placeholder="Texto del pop-up"
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
      humidity: randomData.humidity,
      temperature: randomData.temperature,
      volume: randomData.volume,
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

<style scoped>
.map-container {
  overflow: hidden;
  position: relative;
  touch-action: none;
  user-select: none;
  background: linear-gradient(135deg, #0f172a 70%, #134e4a 100%);
  box-shadow: 0 10px 40px 0 rgba(0,0,0,0.45);
}

/* Prevenir zoom con atajos en la página (solo para desktop) */
html, body {
  overscroll-behavior: none;
  touch-action: none;
  user-select: none;
  background: #0f172a;
}

.popup-content {
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
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


.custom-popup {
  cursor: pointer;
  transition: transform 0.2s;
}

.custom-popup:hover {
  transform: translateY(-3px);
}

.popup-content {
  transition: all 0.3s ease;
}

.popup-content:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.marker-point {
  z-index: 10;
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

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
          <button v-for="planta in plantas" :key="planta" @click="seleccionarPlanta(planta)" :class="[
            'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02]',
            plantaSeleccionada === planta
              ? 'bg-teal-600 border-teal-600 text-white'
              : 'bg-slate-700 border-slate-600 text-white',
          ]">
            {{ planta }}
          </button>
        </div>
      </div>

      <div v-if="userStore.user?.admin === 1" class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Botones a la izquierda -->
          <div class="flex flex-wrap gap-3 w-full md:w-auto">
            <button @click="togglePopupMode" :class="[
              'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 shadow-md hover:shadow-teal-500/20',
              isAddingPopup
                ? 'bg-red-600 border-red-600 text-white hover:shadow-red-500/20'
                : 'bg-teal-600 border-teal-600 text-white',
            ]">
              <i :class="isAddingPopup ? 'fas fa-times' : 'fas fa-microchip'"></i>
              <span>{{ isAddingPopup ? "Cancel·lar" : "Afegir Sensor" }}</span>
            </button>
            <button v-if="customPopups.length > 0" @click="toggleDeleteMode" :class="[
              'px-5 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 shadow-md hover:shadow-amber-500/20',
              isDeletingPopup
                ? 'bg-emerald-600 border-emerald-600 text-white hover:shadow-emerald-500/20'
                : 'bg-amber-600 border-amber-600 text-white',
            ]">
              <i :class="isDeletingPopup ? 'fas fa-check' : 'fas fa-trash'"></i>
              <span>{{ isDeletingPopup ? "Finalitzar Esborrat" : "Esborrar Sensor" }}</span>
            </button>
          </div>

          <div class="flex items-center gap-4 rounded-lg px-5 py-3 w-full md:w-auto">
            <label for="dataType" class="text-white whitespace-nowrap text-base font-semibold">Tipus de dada:</label>
            <select id="dataType" v-model="selectedSensorType"
              class="bg-slate-800 border-2 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base hover:border-slate-500 transition-colors">
              <option value="temperatura">Temperatura</option>
              <option value="humitat">Humitat</option>
              <option value="volum">Volum</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="bg-slate-800 rounded-lg p-2 shadow-lg mb-6">
        <div class="relative w-full h-[65vh] min-h-[600px] rounded-xl overflow-hidden border-2 border-slate-700"
          @click="handleMapClick" :style="{ cursor: isAddingPopup ? 'crosshair' : 'default' }">
          <Mapaplanta1 v-if="plantaSeleccionada === 'PLANTA 1'" :aulaData="aulaData" imageUrl="/planos/planta1.png" />
          <Mapaplanta2 v-if="plantaSeleccionada === 'PLANTA 2'" :aulaData="aulaData" imageUrl="/planos/planta2.png" />
          <Mapaplanta3 v-if="plantaSeleccionada === 'PLANTA 3'" :aulaData="aulaData" imageUrl="/planos/planta3.png" />
          <MapaPlantaBaixa v-if="plantaSeleccionada === 'PLANTA BAJA'" :aulaData="aulaData"
            imageUrl="/planos/plantabaja.png" />
          <MapaPlantaSubterranea v-if="plantaSeleccionada === 'PLANTA SUBTERRANEA'" :aulaData="aulaData"
            imageUrl="/planos/plantasubterranea.png" />

          <!-- Pop-ups personalitzats -->
          <div v-for="popup in filteredPopups" :key="popup.id" :style="{ left: popup.x + 'px', top: popup.y + 'px' }"
            class="custom-popup absolute">
            <!-- Punt indicador -->
            <div :class="[
              'marker-point w-8 h-8 rounded-full absolute -top-4 -left-4 border-4 border-white cursor-pointer flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform duration-200 bg-gradient-to-r',
              getMarkerColor(popup),
            ]" @click.stop="
              isDeletingPopup ? deletePopup(popup.id) : handlePopupClick(popup)
              ">
              <i class="fas fa-map-marker-alt text-white"></i>
            </div>
            <!-- Contingut del popup -->
            <div v-if="showingPopupId === popup.id"
              class="popup-content bg-slate-700/90 border-2 border-teal-500 rounded-xl p-8 shadow-2xl min-w-[400px] relative animate-fadeIn overflow-hidden">
              <button @click="showingPopupId = null"
                class="delete-btn absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg hover:bg-red-700 transition-all">
                <i class="fas fa-times"></i>
              </button>
              <div class="text-white text-lg font-semibold mb-2 flex items-center justify-between">
                <span>{{ popup.text || popup.nombre }}</span>
                <span class="text-sm text-gray-400">ID: {{ popup.id || popup.idSensor }}</span>
              </div>

              <div v-if="lastSensorValues[popup.idAula || popup.idSensor]">
                <div v-if="!lastSensorValues[popup.idAula || popup.idSensor].error" class="mt-4 space-y-3">
                  <!-- Temperatura -->
                  <div class="flex items-center justify-between p-4 bg-slate-800/70 rounded-lg">
                    <span class="text-sm text-white flex items-center">
                      <i class="fas fa-temperature-high mr-2"></i>Temperatura
                    </span>
                    <span class="text-2xl font-bold text-white">
                      {{ getSensorValue(lastSensorValues[popup.idAula || popup.idSensor], 'temperatura') }}
                    </span>
                  </div>
                  
                  <!-- Humitat -->
                  <div class="flex items-center justify-between p-4 bg-slate-800/70 rounded-lg">
                    <span class="text-sm text-white flex items-center">
                      <i class="fas fa-tint mr-2"></i>Humitat
                    </span>
                    <span class="text-2xl font-bold text-white">
                      {{ getSensorValue(lastSensorValues[popup.idAula || popup.idSensor], 'humitat') }}
                    </span>
                  </div>
                  
                  <!-- Volum -->
                  <div class="flex items-center justify-between p-4 bg-slate-800/70 rounded-lg">
                    <span class="text-sm text-white flex items-center">
                      <i class="fas fa-volume-up mr-2"></i>Volum
                    </span>
                    <span class="text-2xl font-bold text-white">
                      {{ getSensorValue(lastSensorValues[popup.idAula || popup.idSensor], 'volum') }}
                    </span>
                  </div>
                  
                  <!-- Última actualización -->
                  <div class="text-xs text-gray-400 text-center mt-2">
                    Última act: {{ formatDate(lastSensorValues[popup.idAula || popup.idSensor].temperatura?.dataIni) }}
                  </div>
                </div>
                <div v-else class="mt-4 p-4 bg-red-900/30 rounded-lg text-center">
                  <i class="fas fa-exclamation-triangle mr-1 text-red-400"></i>
                  <span class="text-red-300">Error en carregar les dades</span>
                </div>
              </div>
              <div v-else class="mt-4 p-4 bg-slate-800/70 rounded-lg flex justify-center">
                <div class="loader"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Listado de todos los sensores -->
      <div v-if="isAddingPopup && availableSensors.length > 0" class="bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
        <h2 class="text-xl font-semibold text-white mb-4">Tots els sensors disponibles</h2>
        <div class="space-y-2 max-h-[400px] overflow-y-auto">
          <div v-for="sensor in availableSensors" :key="sensor.idSensor" @click="selectSensor(sensor)"
            class="p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
            <div class="flex justify-between items-center text-white">
              <div>
                <div class="font-semibold">{{ sensor.nombre }}</div>
                <div class="text-sm text-gray-400">MAC: {{ sensor.mac }}</div>
                <div class="text-sm text-gray-400">Ubicació: {{ sensor.ubicacion }}</div>
                <div class="text-sm text-gray-400">ID: {{ sensor.idSensor }}</div>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Botó per cancel·lar -->
        <div class="flex justify-end mt-4">
          <button @click="cancelNewPopup"
            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-colors border border-red-700 hover:scale-[1.02]">
            <i class="fas fa-times mr-2"></i>Cancel·lar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "~/stores/userStore";
import { getUltimsSensorsAula } from "~/utils/communicationManager";
import { getBaseUrl } from "~/utils/communicationManager";
import Header from "../components/header.vue";
import Mapaplanta1 from "~/components/Plantes/MapaPlanta-1.vue";
import Mapaplanta2 from "~/components/Plantes/MapaPlanta-2.vue";
import Mapaplanta3 from "~/components/Plantes/MapaPlanta-3.vue";
import MapaPlantaBaixa from "~/components/Plantes/MapaPlantaBaixa.vue";
import MapaPlantaSubterranea from "~/components/Plantes/MapaPlantaSubterranea.vue";

const plantas = ["PLANTA BAJA", "PLANTA 1", "PLANTA 2", "PLANTA 3", "PLANTA SUBTERRANEA"];
const plantaSeleccionada = ref("PLANTA 1");
const aulaData = ref([]);
const selectedSensorType = ref("temperatura");

// Datos de sensores
const availableSensors = ref([]);
const activeSensors = ref([]);
const lastSensorValues = ref({});
const customPopups = ref([]);
const showingPopupId = ref(null);
const isAddingPopup = ref(false);
const isDeletingPopup = ref(false);
const tempPopupPosition = ref(null);

// Helper functions
const getSensorLabel = () => {
  switch (selectedSensorType.value) {
    case 'temperatura': return 'Temperatura';
    case 'humitat': return 'Humitat';
    case 'volum': return 'Volum';
    default: return '';
  }
};
const getSensorValue = (sensorData, tipo) => {
  if (!sensorData || !sensorData[tipo]) return 'N/D';
  
  const value = sensorData[tipo]?.average;
  if (value === undefined) return 'N/D';

  const formattedValue = Number(value).toFixed(1);
  switch (tipo) {
    case 'temperatura': return `${formattedValue}°C`;
    case 'humitat': return `${formattedValue}ppm`;
    case 'volum': return `${formattedValue}dB`;
    default: return formattedValue;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/D';
  const date = new Date(dateString);
  return date.toLocaleString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Cargar sensores al montar el componente
onMounted(async () => {
  await fetchData();
  
  const savedSensors = localStorage.getItem("activeSensors");
  if (savedSensors) {
    try {
      activeSensors.value = JSON.parse(savedSensors);
    } catch (e) {
      activeSensors.value = [];
    }
  }
  
  const savedPopups = localStorage.getItem("customMapPopups");
  if (savedPopups) {
    customPopups.value = JSON.parse(savedPopups);
  }
});

// Cargar todos los sensores disponibles
const loadAvailableSensors = async () => {
  try {
    const data = await getAllSensors();
    availableSensors.value = data;
    console.log("Sensores cargados:", data);
  } catch (error) {
    console.error("Error al cargar sensores:", error);
    availableSensors.value = [];
  }
};

// Manejo de popups
const togglePopupMode = async () => {
  isAddingPopup.value = !isAddingPopup.value;
  isDeletingPopup.value = false;
  
  if (isAddingPopup.value) {
    await loadAvailableSensors();
  }
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
};

// Modificar la función selectSensor para guardar la posición en la base de datos
const selectSensor = async (sensor) => {
  if (!tempPopupPosition.value) return;

  try {
    // Actualizar el sensor en la base de datos con las coordenadas y planta
    await updateSensorById(sensor.idSensor, {
      nombre: sensor.nombre,
      ubicacion: sensor.ubicacion,
      x: tempPopupPosition.value.x,
      y: tempPopupPosition.value.y,
      idAula: sensor.idAula,
      planta: plantaSeleccionada.value
    });

    // Añadimos el sensor a la lista activa con su nueva posición
    const newSensor = {
      ...sensor,
      x: tempPopupPosition.value.x,
      y: tempPopupPosition.value.y,
      planta: plantaSeleccionada.value
    };

    activeSensors.value.push(newSensor);
    cancelNewPopup();
    
    // Opcional: mostrar mensaje de éxito
    alert("Sensor añadido correctamente y guardado en la base de datos");
  } catch (error) {
    console.error("Error al guardar la posición del sensor:", error);
    alert("Error al guardar la posición del sensor");
  }
};

const cancelNewPopup = () => {
  isAddingPopup.value = false;
  tempPopupPosition.value = null;
};

const deletePopup = async (id) => {
  try {
    // Verificar si es un sensor de la base de datos
    const sensorToDelete = activeSensors.value.find(
      sensor => sensor.id === id || sensor.idSensor === id
    );
    
    if (sensorToDelete && sensorToDelete.idSensor) {
      // Es un sensor de la base de datos, actualizamos para resetear coordenadas
      await updateSensorById(sensorToDelete.idSensor, {
        x: 0,
        y: 0,
        planta: ""
      });
    }
    
    // Eliminar de la lista local
    activeSensors.value = activeSensors.value.filter(
      (sensor) => sensor.id !== id && sensor.idSensor !== id
    );
    customPopups.value = customPopups.value.filter((popup) => popup.id !== id);
    
    // Cerrar el popup si está abierto
    if (showingPopupId.value === id) {
      showingPopupId.value = null;
    }
    
  } catch (error) {
    console.error("Error al eliminar el sensor:", error);
  }
};

const filteredPopups = computed(() => {
  return activeSensors.value.filter((sensor) => {
    // Verificar que el sensor tiene planta definida
    if (!sensor.planta) return false;
    
    // Normalizar el formato de la planta para comparación
    const sensorPlanta = sensor.planta.toUpperCase().trim();
    const selectedPlanta = plantaSeleccionada.value.toUpperCase().trim();
    
    return sensorPlanta === selectedPlanta ||
           sensorPlanta.includes(selectedPlanta) ||
           selectedPlanta.includes(sensorPlanta);
  });
});

const getMarkerColor = (popup) => {
  if (!lastSensorValues.value[popup.idAula || popup.idSensor]) {
    return "bg-gray-500";
  }
  const sensorData = lastSensorValues.value[popup.idAula || popup.idSensor];
  if (sensorData.error) {
    return "bg-gray-500";
  }
  const value = sensorData[selectedSensorType.value]?.average;
  if (value === undefined) {
    return "bg-gray-500";
  }
  switch (selectedSensorType.value) {
    case 'temperatura':
      if (value > 25) return "bg-red-500";
      if (value > 20) return "bg-yellow-500";
      return "bg-green-500";
    case 'humitat':
      if (value > 800) return "bg-red-500";
      if (value > 600) return "bg-yellow-500";
      return "bg-green-500";
    case 'volum':
      if (value > 80) return "bg-red-500";
      if (value > 60) return "bg-yellow-500";
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const handlePopupClick = async (popup) => {
  if (isDeletingPopup.value) {
    deletePopup(popup.id);
  } else {
    showingPopupId.value = popup.id || popup.idSensor;
    
    // Limpiar datos antiguos para mostrar indicador de carga
    if (lastSensorValues.value[popup.idAula || popup.idSensor]) {
      delete lastSensorValues.value[popup.idAula || popup.idSensor];
    }
    
    try {
      // Obtener los datos más recientes del sensor
      const data = await getUltimsSensorsAula(popup.idAula || popup.idSensor);
      lastSensorValues.value[popup.idAula || popup.idSensor] = data;
      console.log("Datos recientes obtenidos:", data);
    } catch (e) {
      console.error("Error al cargar datos recientes:", e);
      lastSensorValues.value[popup.idAula || popup.idSensor] = { error: true };
    }
  }
};

const fetchData = async () => {
  try {
    // Cargar datos del mapa
    const bodyRequest = {
      aules: [8, 10, 12, 9, 11, 13, 42, 49, 43, 54, 44, 45, 46],
      data: "2025-02-10",
      tipus: "volum",
    };
    const response = await getMapa(bodyRequest);
    aulaData.value = response;
    
    // Cargar sensores desde la base de datos
    const sensoresFromDB = await getAllSensors();
    
    // Establecer los sensores activos desde la base de datos
    activeSensors.value = sensoresFromDB.map(sensor => ({
      id: sensor.idSensor,
      idSensor: sensor.idSensor,
      x: sensor.x,
      y: sensor.y,
      planta: sensor.ubicacion.includes("PLANTA") ? sensor.ubicacion : plantaSeleccionada.value,
      nombre: sensor.nombre,
      idAula: sensor.idAula,
      mac: sensor.mac
    }));
    
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

const seleccionarPlanta = (planta) => {
  plantaSeleccionada.value = planta;
};

// Persistencia
watch(activeSensors, (newSensors) => {
  localStorage.setItem("activeSensors", JSON.stringify(newSensors));
}, { deep: true });

const router = useRouter();
const userStore = useUserStore();
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
  background: linear-gradient(45deg, rgba(0, 255, 0, 0.1), rgba(255, 0, 0, 0.1));
  opacity: 0.6;
  z-index: 0;
  filter: blur(20px);
  animation: temperatureGradient 5s infinite;
}

@keyframes temperatureGradient {
  0% {
    background: linear-gradient(45deg, rgba(0, 255, 0, 0.2), rgba(255, 255, 0, 0.2));
    transform: scale(1);
  }

  50% {
    background: linear-gradient(45deg, rgba(255, 255, 0, 0.2), rgba(255, 0, 0, 0.2));
    transform: scale(1.05);
  }

  100% {
    background: linear-gradient(45deg, rgba(0, 255, 0, 0.2), rgba(255, 255, 0, 0.2));
    transform: scale(1);
  }
}

.popup-content>* {
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
  animation: markerGradientHot 4s infinite linear;
}

.bg-yellow-500 {
  background: linear-gradient(45deg, #eab308, #f59e0b);
  animation: markerGradientWarm 4s infinite linear;
}

.bg-green-500 {
  background: linear-gradient(45deg, #22c55e, #15803d);
  animation: markerGradientCool 4s infinite linear;
}

@keyframes markerGradientHot {
  0% {
    background: linear-gradient(0deg, #ef4444, #dc2626);
  }

  10% {
    background: linear-gradient(36deg, #ef4444, #b91c1c);
  }

  20% {
    background: linear-gradient(72deg, #dc2626, #ef4444);
  }

  30% {
    background: linear-gradient(108deg, #b91c1c, #dc2626);
  }

  40% {
    background: linear-gradient(144deg, #ef4444, #b91c1c);
  }

  50% {
    background: linear-gradient(180deg, #dc2626, #ef4444);
  }

  60% {
    background: linear-gradient(216deg, #b91c1c, #dc2626);
  }

  70% {
    background: linear-gradient(252deg, #ef4444, #b91c1c);
  }

  80% {
    background: linear-gradient(288deg, #dc2626, #ef4444);
  }

  90% {
    background: linear-gradient(324deg, #b91c1c, #dc2626);
  }

  100% {
    background: linear-gradient(360deg, #ef4444, #dc2626);
  }
}

@keyframes markerGradientWarm {
  0% {
    background: linear-gradient(0deg, #eab308, #f59e0b);
  }

  10% {
    background: linear-gradient(36deg, #f59e0b, #d97706);
  }

  20% {
    background: linear-gradient(72deg, #d97706, #eab308);
  }

  30% {
    background: linear-gradient(108deg, #eab308, #f59e0b);
  }

  40% {
    background: linear-gradient(144deg, #f59e0b, #d97706);
  }

  50% {
    background: linear-gradient(180deg, #d97706, #eab308);
  }

  60% {
    background: linear-gradient(216deg, #eab308, #f59e0b);
  }

  70% {
    background: linear-gradient(252deg, #f59e0b, #d97706);
  }

  80% {
    background: linear-gradient(288deg, #d97706, #eab308);
  }

  90% {
    background: linear-gradient(324deg, #eab308, #f59e0b);
  }

  100% {
    background: linear-gradient(360deg, #f59e0b, #d97706);
  }
}

@keyframes markerGradientCool {
  0% {
    background: linear-gradient(0deg, #22c55e, #15803d);
  }

  10% {
    background: linear-gradient(36deg, #15803d, #16a34a);
  }

  20% {
    background: linear-gradient(72deg, #16a34a, #22c55e);
  }

  30% {
    background: linear-gradient(108deg, #22c55e, #15803d);
  }

  40% {
    background: linear-gradient(144deg, #15803d, #16a34a);
  }

  50% {
    background: linear-gradient(180deg, #16a34a, #22c55e);
  }

  60% {
    background: linear-gradient(216deg, #22c55e, #15803d);
  }

  70% {
    background: linear-gradient(252deg, #15803d, #16a34a);
  }

  80% {
    background: linear-gradient(288deg, #16a34a, #22c55e);
  }

  90% {
    background: linear-gradient(324deg, #22c55e, #15803d);
  }

  100% {
    background: linear-gradient(360deg, #15803d, #16a34a);
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
  background: radial-gradient(circle at center, rgba(255, 0, 0, 0.4), transparent 70%);
}

.bg-yellow-500::before {
  background: radial-gradient(circle at center, rgba(255, 200, 0, 0.4), transparent 70%);
}

.bg-green-500::before {
  background: radial-gradient(circle at center, rgba(0, 255, 0, 0.4), transparent 70%);
}

.marker-point::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3), transparent 70%);
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

.loader {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #10b981;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

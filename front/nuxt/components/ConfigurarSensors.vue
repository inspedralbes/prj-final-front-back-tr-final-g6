<template>
  <div class="min-h-screen bg-slate-800 flex flex-col">
    <!-- Contingut Principal -->
    <div class="flex-grow w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div class="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-white mb-6">Configuració del Sensor</h2>

          <form @submit.prevent="saveSensorConfigHandler" class="space-y-6">

            <!-- Configuració bàsica -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Lluminositat inicial (startglow)</label>
                <input v-model.number="sensorConfig.startglow" type="number" min="0" max="255"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Llindar LDR</label>
                <input v-model.number="sensorConfig.ldrThreshold" type="number" min="0"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Rotació Display</label>
                <select v-model.number="sensorConfig.displayRotation"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  <option :value="0">0° (Normal)</option>
                  <option :value="90">90°</option>
                  <option :value="180">180°</option>
                  <option :value="270">270°</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Retard Fractal (ms)</label>
                <input v-model.number="sensorConfig.fractalDelay" type="number" min="0"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Retard Logo (ms)</label>
                <input v-model.number="sensorConfig.logoDelay" type="number" min="0"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Vref So (vref_sound)</label>
                <input v-model.number="sensorConfig.vref_sound" type="number" step="0.01" min="0"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Màxim de mostres (maxSamples / 2 = segons)</label>
                <input v-model.number="sensorConfig.maxSamples" type="number" min="1"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>
            </div>

            <!-- Nivells de so -->
            <div class="border-t border-slate-700 pt-6">
              <h3 class="text-lg font-semibold text-white mb-4">Llindars de So (dB)</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Bons valors (db_good)</label>
                  <input v-model.number="sensorConfig.db_good" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Valors normals (db_normal)</label>
                  <input v-model.number="sensorConfig.db_normal" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Valors alts (db_angry)</label>
                  <input v-model.number="sensorConfig.db_angry" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Valors molt alts (db_very_angry)</label>
                  <input v-model.number="sensorConfig.db_very_angry" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
              </div>
            </div>

            <div class="border-t border-slate-700 pt-6">
              <h3 class="text-lg font-semibold text-white mb-4">Llindars de Temperatura (°C)</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Bona (temperature_good)</label>
                  <input v-model.number="sensorConfig.temperature_good" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Normal (temperature_normal)</label>
                  <input v-model.number="sensorConfig.temperature_normal" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Alta (temperature_angry)</label>
                  <input v-model.number="sensorConfig.temperature_angry" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
              </div>
            </div>

            <!-- Llindars d'Humitat -->
            <div class="border-t border-slate-700 pt-6">
              <h3 class="text-lg font-semibold text-white mb-4">Llindars d'Humitat (%)</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Bona (humidity_good)</label>
                  <input v-model.number="sensorConfig.humidity_good" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Normal (humidity_normal)</label>
                  <input v-model.number="sensorConfig.humidity_normal" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">Alta (humidity_angry)</label>
                  <input v-model.number="sensorConfig.humidity_angry" type="number" min="0"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
              </div>
            </div>

            <!-- Nivells de brillo -->
            <div class="border-t border-slate-700 pt-6">
              <h3 class="text-lg font-semibold text-white mb-4">Nivells de Brillantor (glowlevels)</h3>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div v-for="(level, index) in sensorConfig.glowlevels" :key="index">
                  <label class="block text-sm font-medium text-slate-400 mb-1">Nivell {{ index }}</label>
                  <input v-model.number="sensorConfig.glowlevels[index]" type="number" min="0" max="255"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
              </div>
            </div>

            <!-- URLs -->
            <div class="border-t border-slate-700 pt-6">
              <h3 class="text-lg font-semibold text-white mb-4">URLs de Connexió</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">URL per a nous sensors</label>
                  <input v-model="sensorConfig.url_newsensor" type="url"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-400 mb-1">URL per enviar dades</label>
                  <input v-model="sensorConfig.url_sensor" type="url"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
              </div>
            </div>

            <!-- Imatges -->
            <div class="border-t border-slate-700 pt-6">
              <h3 class="text-lg font-semibold text-white mb-4">Imatges del Sensor</h3>
              <div class="space-y-4">
                <div v-for="(image, index) in imageTypes" :key="index" class="bg-slate-700 p-4 rounded-lg">
                  <label class="block text-sm font-medium text-slate-400 mb-2">{{ image.label }}</label>
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0">
                      <img :src="sensorConfig.images[index]" :alt="image.label"
                        class="h-16 w-16 object-cover rounded-lg border border-slate-600">
                    </div>
                    <div class="flex-grow">
                      <input v-model="sensorConfig.images[index]" type="url" readonly
                        class="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white cursor-not-allowed">
                    </div>
                    <div>
                      <button type="button" @click="openImageUpload(index)"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all">
                        Canvia
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-slate-400 mt-2">Nom requerit: {{ image.requiredName }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 border-t border-slate-700">
              <button type="submit"
                class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all">
                Desa Configuració
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal per pujar imatges -->
    <div v-if="showImageUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-white mb-4">Puja Nova Imatge</h2>
          <p class="text-slate-400 mb-2">Tipus: {{ imageTypes[currentImageIndex].label }}</p>
          <p class="text-slate-400 mb-4">Nom requerit: {{ imageTypes[currentImageIndex].requiredName }}</p>
          <p class="text-slate-400 mb-4">La mida ha de ser de 64x64px</p>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-400 mb-2">Selecciona una imatge</label>
            <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange"
              class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700">
          </div>

          <div class="flex justify-end gap-3">
            <button @click="showImageUploadModal = false"
              class="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all">
              Cancel·la
            </button>
            <button @click="uploadImage" :disabled="!selectedFile"
              class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all disabled:opacity-50">
              Puja Imatge
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getSensorConfig, saveSensorConfig, uploadSensorImage } from '~/utils/communicationManager';

const sensorConfig = ref({ images: [] });
const tempImages = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getSensorConfig();
    sensorConfig.value = { ...data };
    tempImages.value = [...(data.images || [])];
  } catch (error) {
    alert('Error en carregar la configuració: ' + error.message);
  } finally {
    loading.value = false;
  }
});

const imageTypes = ref([
  { label: "Imatge Logo", requiredName: "logo.jpg" },
  { label: "Imatge Normal", requiredName: "normal.jpg" },
  { label: "Imatge Bona", requiredName: "good.jpg" },
  { label: "Imatge Enfadada", requiredName: "angry.jpg" },
  { label: "Imatge Connectat", requiredName: "connected.jpg" },
  { label: "Imatge Desconnectat", requiredName: "disconnected.jpg" },
  { label: "Imatge Punt d'Accés", requiredName: "accesspoint.jpg" }
]);

const showImageUploadModal = ref(false);
const currentImageIndex = ref(0);
const selectedFile = ref(null);
const fileInput = ref(null);

const openImageUpload = (index) => {
  currentImageIndex.value = index;
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  showImageUploadModal.value = true;
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipus d'arxiu
  if (!file.type.match('image/jpeg') && !file.type.match('image/jpg')) {
    alert('El fitxer ha de ser una imatge JPG');
    event.target.value = '';
    return;
  }

  // Validar dimensions
  const img = new Image();
  img.onload = () => {
    if (img.width !== 64 || img.height !== 64) {
      alert('La imatge ha de tenir exactament 64x64 píxels');
      event.target.value = '';
    } else {
      selectedFile.value = file;
    }
  };
  img.src = URL.createObjectURL(file);
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  try {
    // Crear un nou Blob amb el nom requerit
    const requiredName = imageTypes.value[currentImageIndex.value].requiredName;
    const renamedFile = new File([selectedFile.value], requiredName, {
      type: 'image/jpeg',
      lastModified: selectedFile.value.lastModified
    });

    const response = await uploadSensorImage(renamedFile);
    const imageUrl = response.url || `https://dev.acubox.cat/back/api/fileSensor/images/${requiredName}`;

    tempImages.value[currentImageIndex.value] = imageUrl;
    showImageUploadModal.value = false;

    // Eliminat l'alerta de confirmació aquí
  } catch (error) {
    console.error('Error en pujar la imatge:', error);
    alert('Error en pujar la imatge: ' + error.message);
  }
};

const saveSensorConfigHandler = async () => {
  try {
    sensorConfig.value.images = [...tempImages.value];
    await saveSensorConfig(sensorConfig.value);
    alert('Configuració desada correctament');
    window.location.reload();
  } catch (error) {
    console.error('Error en desar la configuració:', error);
    alert('Error en desar la configuració: ' + error.message);
  }
};
</script>

<style scoped>
/* Estil personalitzat aquí */
</style>
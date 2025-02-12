<script setup>
import { onMounted, ref, defineProps } from "vue";
import Konva from "konva";
import axios from "axios";

// Recibe la URL de la imagen como prop
const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
});

const stageRef = ref(null);
const showPopup = ref(false);
const popupInfo = ref("");
const popupPosition = ref({ x: 0, y: 0 });

const aulaData = ref([]);

// Función para obtener los datos reales del backend
const fetchData = async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/getMapa", {
      aules: ["2N ESO A", "2N ESO C", "2N ESO E", "2N ESO B", "2N ESO D", "2N ESO F", "1R SMIX B1", "PFI 2", "1R SMIX A1", "1R DAM", "1R SMIX A2", "1 SMIX", "1SMX A3"],
      tipus: "sonido",  // Ajusta según lo que almacenes en la BD
      data: "2025-02-12" // Sustituye por la fecha real
    });
    
    aulaData.value = response.data;
    console.log("Datos recibidos:", aulaData.value);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

const closePopup = () => {
  showPopup.value = false;
};

const getInterpolatedColor = (value, min, max) => {
  const ratio = (value - min) / (max - min);
  const red = Math.round(255 * ratio);
  const blue = Math.round(255 * (1 - ratio));
  return `rgb(${red}, 0, ${blue})`;
};

onMounted(async () => {
  await fetchData(); // Obtener datos antes de renderizar el mapa

  const image = './PLANTA 1.png';
  const imageObj = new Image();

  imageObj.onload = function() {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 10;

    const stage = new Konva.Stage({
      container: stageRef.value,
      width: canvasWidth,
      height: canvasHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const konvaImage = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: scaledWidth,
      height: scaledHeight,
    });

    layer.add(konvaImage);

    const points = [
      { x: 179, y: 164, idAula: "2N ESO A", popupX: 175, popupY: 350 },
      { x: 268, y: 156, idAula: "2N ESO C", popupX: 320, popupY: 350 },
      { x: 494, y: 135, idAula: "2N ESO E", popupX: 599, popupY: 350 },
      { x: 189, y: 288, idAula: "2N ESO B", popupX: 180, popupY: 550 },
      { x: 279, y: 280, idAula: "2N ESO D", popupX: 299, popupY: 540 },
      { x: 458, y: 265, idAula: "2N ESO F", popupX: 540, popupY: 530 },
      { x: 735, y: 260, idAula: "1R SMIX B1", popupX: 920, popupY: 490 },
      { x: 824, y: 268, idAula: "PFI 2", popupX: 1100, popupY: 500 },
      { x: 915, y: 274, idAula: "1R SMIX A1", popupX: 1190, popupY: 490 },
      { x: 1003, y: 283, idAula: "1R DAM", popupX: 1290, popupY: 490 },
      { x: 1016, y: 160, idAula: "1R SMIX A2", popupX: 1300, popupY: 350 },
      { x: 1103, y: 168, idAula: "1 SMIX", popupX: 1440, popupY: 360 },
      { x: 1095, y: 294, idAula: "1SMX A3", popupX: 1430, popupY: 530 },
    ].map(point => {
      const aula = aulaData.value.find(a => a.idAula === point.idAula);
      return {
        ...point,
        enabled: aula !== undefined,
        volumen: aula ? aula.average : 0
      };
    });

    const minVolumen = Math.min(...points.map(p => p.volumen));
    const maxVolumen = Math.max(...points.map(p => p.volumen));

    points.forEach(point => {
      const color = point.enabled
        ? getInterpolatedColor(point.volumen, minVolumen, maxVolumen)
        : "gray";

      const circle = new Konva.Circle({
        x: x + point.x * scaleFactor,
        y: y + point.y * scaleFactor,
        radius: 10,
        fill: color,
        stroke: "black",
        strokeWidth: 2,
        draggable: false,
      });

      circle.on('click', () => {
        if (!point.enabled) return;
        popupInfo.value = `${point.idAula} - Volumen: ${point.volumen.toFixed(2)}`;
        showPopup.value = true;
        popupPosition.value = { x: point.popupX, y: point.popupY };
      });

      layer.add(circle);
    });

    layer.batchDraw();
  };

  imageObj.src = image; // Cambiar a la ruta correcta de la imagen en tu proyecto
});
</script>

<template>
  <div ref="stageRef" class="canvas-container"></div>

  <div v-if="showPopup" class="popup" :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }">
    <p>{{ popupInfo }}</p>
    <button @click="closePopup" class="close-btn">X</button>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.popup {
  position: absolute;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
  max-width: 300px;
  z-index: 10;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.close-btn:hover {
  color: red;
}
</style>

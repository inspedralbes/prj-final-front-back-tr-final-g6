<script setup>
import { onMounted, ref, defineProps } from "vue";
import Konva from "konva";
import { getMapa } from "@/utils/CommunicationManager";


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

const closePopup = () => {
  showPopup.value = false;
};

const getInterpolatedColor = (value, min, max) => {
  const ratio = (value - min) / (max - min);
  const red = Math.round(255 * ratio);
  const blue = Math.round(255 * (1 - ratio));
  return `rgb(${red}, 0, ${blue})`;
};

onMounted(() => {
const image = './PLANTA 2.png';
  const imageObj = new Image();

  imageObj.onload = function() {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;
const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight) * 1.3;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 3.3;

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
      { x: 333, y: 280, info: "3 ESO A", popupX: 175, popupY: 350 },
      { x: 412, y: 275, info: "3R ESO C", popupX: 320, popupY: 350 },
      { x: 344, y: 385, info: "3R ESO B", popupX: 599, popupY: 350 },
      { x: 420, y: 376, info: "3R ESO D", popupX: 180, popupY: 550 },
      { x: 488, y: 266, info: "2N ESO E", popupX: 299, popupY: 540 },
      { x: 638, y: 253, info: "3R ESO F", popupX: 540, popupY: 530 },
      
      { x: 816, y: 250, info: "1R BTX A", popupX: 920, popupY: 490 },
      { x: 964, y: 264, info: "1R BTX B", popupX: 1100, popupY: 500 },
      { x: 1118, y: 280, info: "2N SMX A3 / ASIX-B1", popupX: 1190, popupY: 490 },
      { x: 1111, y: 386, info: "1R BTX E", popupX: 1290, popupY: 490 },
      { x: 1034, y: 377, info: "1R BTX D", popupX: 1300, popupY: 350 },

    ].map(point => ({
      ...point,
      enabled: Math.random() > 0.5,
      volumen: Math.random() * 100
    }));

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
        popupInfo.value = `${point.info} - Volumen: ${point.volumen.toFixed(2)}`;
        showPopup.value = true;
        popupPosition.value = { x: point.popupX, y: point.popupY };
      });

      layer.add(circle);
    });

    layer.batchDraw();
  };

  imageObj.src = image // Cambiar a la ruta correcta de la imagen en tu proyecto
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

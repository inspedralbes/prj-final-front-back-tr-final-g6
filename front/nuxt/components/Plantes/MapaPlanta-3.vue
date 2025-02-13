<script setup>
import { onMounted, ref, defineProps } from "vue";
import Konva from "konva";
import { getMapa } from "@/utils/communicationManager";

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
const image = './PLANTA 3.png';
  const imageObj = new Image();

  imageObj.onload = function() {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)* 1.3;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 1.5;

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
      { x: 342, y: 315, info: "2N BTX A", popupX: 175, popupY: 350 },
      { x: 418, y: 307, info: "2N BTX B", popupX: 320, popupY: 350 },
      { x: 495, y: 301, info: "2N BTX C", popupX: 599, popupY: 350 },
      { x: 569, y: 294, info: "2N BTX E", popupX: 180, popupY: 550 },
      { x: 645, y: 287, info: "1 BTX IB", popupX: 299, popupY: 540 },
      { x: 487, y: 408, info: "2N BTX D", popupX: 540, popupY: 530 },
      { x: 570, y: 400, info: "2N BTX IB", popupX: 920, popupY: 490 },

      { x: 811, y: 392, info: "2 DAW / 2DAM-VI", popupX: 1100, popupY: 500 },
      { x: 886, y: 398, info: "2SMX-A2 / 2 ASX-B2", popupX: 1190, popupY: 490 },
      { x: 840, y: 288, info: "2SMX-A1 / 2ASX-B1", popupX: 1290, popupY: 490 },
      { x: 1046, y: 305, info: "1DAW / 1ASX-B2", popupX: 1300, popupY: 350 },
      { x: 1122, y: 310, info: "2DAM / CERV", popupX: 1440, popupY: 360 },

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

  imageObj.src = image
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

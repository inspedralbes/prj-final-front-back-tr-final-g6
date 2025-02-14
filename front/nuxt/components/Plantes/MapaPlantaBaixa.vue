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
const image = './PB.png';
  const imageObj = new Image();

  imageObj.onload = function() {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)* 0.9;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;
    const x = (canvasWidth - scaledWidth) / 2.5;
    const y = (canvasHeight - scaledHeight) / 1.7;

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
      { x: 212, y: 225, info: "1R ESO A", popupX: 175, popupY: 350 },
      { x: 299, y: 215, info: "1R ESO C", popupX: 320, popupY: 350 },
      { x: 386, y: 208, info: "1R ESO E", popupX: 599, popupY: 350 },

      { x: 222, y: 366, info: "1R ESO B", popupX: 180, popupY: 550 },
      { x: 309, y: 355, info: "1R ESO D", popupX: 299, popupY: 540 },
      { x: 437, y: 342, info: "1R ESO F", popupX: 540, popupY: 530 },

      { x: 1028, y: 215, info: "4R ESO A", popupX: 920, popupY: 490 },
      { x: 1115, y: 224, info: "4R ESO B", popupX: 1100, popupY: 500 },
      { x: 1107, y: 366, info: "4R ESO C", popupX: 1190, popupY: 490 },

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

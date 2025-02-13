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
      { x: 179, y: 164, info: "2N ESO A", popupX: 175, popupY: 350 },
      { x: 268, y: 156, info: "2N ESO C", popupX: 320, popupY: 350 },
      { x: 494, y: 135, info: "2N ESO E", popupX: 599, popupY: 350 },
      { x: 189, y: 288, info: "2N ESO B", popupX: 180, popupY: 550 },
      { x: 279, y: 280, info: "2N ESO D", popupX: 299, popupY: 540 },
      { x: 458, y: 265, info: "2N ESO F", popupX: 540, popupY: 530 },
      { x: 735, y: 260, info: "1R SMIX B1", popupX: 920, popupY: 490 },
      { x: 824, y: 268, info: "PFI 2", popupX: 1100, popupY: 500 },
      { x: 915, y: 274, info: "1R SMIX A1", popupX: 1190, popupY: 490 },
      { x: 1003, y: 283, info: "1R DAM", popupX: 1290, popupY: 490 },
      { x: 1016, y: 160, info: "1R SMIX A2", popupX: 1300, popupY: 350 },
      { x: 1103, y: 168, info: "1 SMIX", popupX: 1440, popupY: 360 },
      { x: 1095, y: 294, info: "1SMX A3", popupX: 1430, popupY: 530 },
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
  <div>
    <div ref="stageRef" class="canvas-container"></div>

    <div v-if="showPopup" class="popup" :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }">
      <p>{{ popupInfo }}</p>
      <button @click="closePopup" class="close-btn">X</button>
    </div>
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

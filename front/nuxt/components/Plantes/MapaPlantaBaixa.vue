<script setup>
import { onMounted, ref, defineProps, nextTick } from "vue";
import Konva from "konva";
import { getMapa } from "@/utils/communicationManager";

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
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

onMounted(async () => {
  await nextTick();

  const image = "./PB.png";
  const imageObj = new Image();

  imageObj.onload = function () {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;

    // Reducir el zoom (factor 1.0)
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight) * 1.0;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 2 - 200; // ← Imagen más arriba

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

    const minVolumen = Math.min(...points.map((p) => p.volumen));
    const maxVolumen = Math.max(...points.map((p) => p.volumen));

    points.forEach((point) => {
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

      circle.on("click", () => {
        if (!point.enabled) return;
        popupInfo.value = `${point.info} - Volumen: ${point.volumen.toFixed(2)}`;
        showPopup.value = true;
        popupPosition.value = { x: point.popupX, y: point.popupY };
      });

      layer.add(circle);
    });

    layer.batchDraw();
  };

  imageObj.src = image;
});
</script>

<template>
  <div ref="stageRef" class="canvas-container"></div>

  <div
    v-if="showPopup"
    class="popup"
    :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }"
  >
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

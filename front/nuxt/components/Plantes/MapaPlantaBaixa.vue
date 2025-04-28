<script setup>
import { onMounted, ref, defineProps } from "vue";
import Konva from "konva";
import { getMapa } from "@/utils/communicationManager";

// Recibe la URL de la imagen como prop
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
const scale = ref(1);
const stage = ref(null);
const layer = ref(null);

const closePopup = () => {
  showPopup.value = false;
};

const getInterpolatedColor = (value, min, max) => {
  const ratio = (value - min) / (max - min);
  const red = Math.round(255 * ratio);
  const blue = Math.round(255 * (1 - ratio));
  return `rgb(${red}, 0, ${blue})`;
};

const handleWheel = (e) => {
  e.evt.preventDefault();

  const scaleBy = 1.1;
  const oldScale = stage.value.scaleX();

  const pointer = stage.value.getPointerPosition();
  const mousePointTo = {
    x: (pointer.x - stage.value.x()) / oldScale,
    y: (pointer.y - stage.value.y()) / oldScale,
  };

  const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

  stage.value.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.value.position(newPos);
  stage.value.batchDraw();
};

onMounted(() => {
  const image = "./PB.png";
  const imageObj = new Image();

  imageObj.onload = function () {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight) * 0.9;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;
    const x = (canvasWidth - scaledWidth) / 2.5;
    const y = (canvasHeight - scaledHeight) / 1.7;

    stage.value = new Konva.Stage({
      container: stageRef.value,
      width: canvasWidth,
      height: canvasHeight,
    });

    layer.value = new Konva.Layer();
    stage.value.add(layer.value);
    stage.value.on('wheel', handleWheel);

    const konvaImage = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: scaledWidth,
      height: scaledHeight,
    });

    layer.value.add(konvaImage);

    // Hacer la imagen draggable
    konvaImage.draggable(true);
    
    // Añadir límites al arrastre
    konvaImage.on('dragmove', () => {
      const pos = konvaImage.position();
      const stage = konvaImage.getStage();
      const scale = konvaImage.scaleX();
      
      // Ajustar los límites según el tamaño escalado
      const minX = -konvaImage.width() * scale;
      const maxX = stage.width();
      const minY = -konvaImage.height() * scale;
      const maxY = stage.height();
      
      konvaImage.position({
        x: Math.min(Math.max(pos.x, minX), maxX),
        y: Math.min(Math.max(pos.y, minY), maxY)
      });
    });

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

      layer.value.add(circle);
    });

    layer.value.batchDraw();
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

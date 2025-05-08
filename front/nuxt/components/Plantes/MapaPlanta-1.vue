<script setup>
import { onMounted, ref, defineProps, nextTick } from "vue";
import Konva from "konva";
import { getMapa } from "@/utils/communicationManager";
import InfoCard from "../InfoCard.vue";

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
});

const stageRef = ref(null);
const aulaData = ref([]);
const popups = ref([]);
const fetchDataText = ref("");

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
        return `Aula: ${aula.Curs}, Volumen: ${aula.average}`;
      })
      .join("\n");

    console.log("Datos recibidos:", aulaData.value);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

const closePopup = (index) => {
  popups.value.splice(index, 1);
};

const getInterpolatedColor = (value, min, max) => {
  const ratio = (value - min) / (max - min);
  const red = Math.round(255 * ratio);
  const blue = Math.round(255 * (1 - ratio));
  return `rgb(${red}, 0, ${blue})`;
};

onMounted(async () => {
  await fetchData();
  await nextTick();

  if (!stageRef.value) {
    console.error("stageRef is null");
    return;
  }

  const image = "./PLANTA 1.png";
  const imageObj = new Image();

  imageObj.onload = function () {
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
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

    const points = aulaData.value.map((aula) => ({
      x: aula.x,
      y: aula.y,
      popupX: aula.popupX,
      popupY: aula.popupY,
      idAula: aula.idAula,
      volumen: aula.average,
      enabled: true,
    }));

    console.log("Puntos procesados:", points);

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

        popups.value.push({
          idAula: point.idAula,
          Curs: aulaData.value.find((a) => a.idAula == point.idAula)?.Curs || "",
          volumen: point.volumen.toFixed(2),
          position: { x: point.popupX, y: point.popupY },
        });
      });

      layer.add(circle);
    });

    layer.batchDraw();
  };

  imageObj.src = image;
});
</script>

<template>
  <div ref="stageRef" class="canvas-container">
    <InfoCard
      v-for="(popup, index) in popups"
      :key="index"
      :info="`Aula: ${popup.Curs} - Volum: ${popup.volumen}`"
      :position="popup.position"
      @close="closePopup(index)"
    />

    <div class="info-text">
      <h3>Información de Aulas</h3>
      <pre>{{ fetchDataText }}</pre>
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

.info-text {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  max-width: 100%;
  white-space: pre-wrap;
  z-index: 10;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>

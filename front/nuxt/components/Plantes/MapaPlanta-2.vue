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

// Funció per obtenir les dades de les aules
const fetchData = async () => {
  try {
    const bodyRequest = {
      aules: [8, 9, 10, 11, 12, 13, 14], // Canvia aquí les aules que corresponen a la Planta 1
      data: "2025-02-10",
      tipus: "volum",
    };

    const response = await getMapa(bodyRequest);
    aulaData.value = response;

    fetchDataText.value = response
      .map((aula) => {
        return `Aula: ${aula.Curs}, Volum: ${aula.average}`;
      })
      .join("\n");

    console.log("Dades rebudes:", aulaData.value);
  } catch (error) {
    console.error("Error en obtenir les dades:", error);
  }
};

// Tancar un popup
const closePopup = (index) => {
  popups.value.splice(index, 1);
};

// Funció per obtenir el color interpolat en funció del volum
const getInterpolatedColor = (value, min, max) => {
  const ratio = (value - min) / (max - min);
  const red = Math.round(255 * ratio);
  const blue = Math.round(255 * (1 - ratio));
  return `rgb(${red}, 0, ${blue})`;
};

// Es crida al muntar el component
onMounted(async () => {
  await fetchData();
  await nextTick();

  if (!stageRef.value) {
    console.error("stageRef és null");
    return;
  }

  const image = "./PLANTA 2.png"; // Ruta de la imatge de la planta 1
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
    const y = (canvasHeight - scaledHeight) / 2 - 200; // ← Imatge més amunt
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

    console.log("Punts processats:", points);

    // Assegura't que `points` estigui correctament definit per aquesta planta
    const minVolum = Math.min(...points.map((p) => p.volumen));
    const maxVolum = Math.max(...points.map((p) => p.volumen));

    points.forEach((point) => {
      const color = point.enabled
        ? getInterpolatedColor(point.volumen, minVolum, maxVolum)
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
      <h3>Informació d’Aules</h3>
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

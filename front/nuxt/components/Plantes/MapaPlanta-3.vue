<script setup>
import { onMounted, ref, defineProps, nextTick } from "vue";
import Konva from "konva";
import { getMapa } from "@/utils/communicationManager";
import InfoCard from "../InfoCard.vue"; // Opcional: utilitza el mateix InfoCard si vols.

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
});

const stageRef = ref(null);
const mostrarPopup = ref(false);
const infoPopup = ref("");
const posicioPopup = ref({ x: 0, y: 0 });

const tancarPopup = () => {
  mostrarPopup.value = false;
};

const obtenirColorInterpolat = (valor, min, max) => {
  const proporcio = (valor - min) / (max - min);
  const vermell = Math.round(255 * proporcio);
  const blau = Math.round(255 * (1 - proporcio));
  return `rgb(${vermell}, 0, ${blau})`;
};

onMounted(async () => {
  await nextTick(); // Assegura't que tot estigui muntat

  const imatge = "./PLANTA 3.png";
  const imatgeObj = new Image();

  imatgeObj.onload = function () {
    const ampladaImg = imatgeObj.width;
    const alcadaImg = imatgeObj.height;

    const ampladaCanvas = stageRef.value.offsetWidth;
    const alcadaCanvas = stageRef.value.offsetHeight;
    const factorEscala = Math.min(ampladaCanvas / ampladaImg, alcadaCanvas / alcadaImg);
    const ampladaEscalada = ampladaImg * factorEscala;
    const alcadaEscalada = alcadaImg * factorEscala;
    const x = (ampladaCanvas - ampladaEscalada) / 2;
    const y = (alcadaCanvas - alcadaEscalada) / 2 - 200; // ← Imatge més amunt

    const escenari = new Konva.Stage({
      container: stageRef.value,
      width: ampladaCanvas,
      height: alcadaCanvas,
    });

    const capa = new Konva.Layer();
    escenari.add(capa);

    const konvaImage = new Konva.Image({
      x: x,
      y: y,
      image: imatgeObj,
      width: ampladaEscalada,
      height: alcadaEscalada,
    });

    capa.add(konvaImage);

    const volumMinim = Math.min(...punts.map((p) => p.volumen));
    const volumMaxim = Math.max(...punts.map((p) => p.volumen));

    punts.forEach((punt) => {
      const color = punt.enabled
        ? obtenirColorInterpolat(punt.volumen, volumMinim, volumMaxim)
        : "gray";

      const cercle = new Konva.Circle({
        x: x + punt.x * factorEscala,
        y: y + punt.y * factorEscala,
        radius: 10,
        fill: color,
        stroke: "black",
        strokeWidth: 2,
        draggable: false,
      });

      cercle.on("click", () => {
        if (!punt.enabled) return;
        infoPopup.value = `${punt.info} - Volum: ${punt.volumen.toFixed(2)}`;
        mostrarPopup.value = true;
        posicioPopup.value = { x: punt.popupX, y: punt.popupY };
      });

      capa.add(cercle);
    });

    capa.batchDraw();
  };

  imatgeObj.src = imatge;
});
</script>

<template>
  <div ref="stageRef" class="canvas-container"></div>
  
  <InfoCard
    v-if="mostrarPopup"
    :info="infoPopup"
    :position="posicioPopup"
    :title="puntActual ? puntActual.info : 'Sensor'"
    :sensorData="{
      temperatura: puntActual ? puntActual.temperatura : null,
      humitat: puntActual ? puntActual.humitat : null,
      volum: puntActual ? puntActual.volumen : null
    }"
    @close="tancarPopup"
  />
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

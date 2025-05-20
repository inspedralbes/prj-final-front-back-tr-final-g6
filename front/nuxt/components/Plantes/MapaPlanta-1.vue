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
const dadesAules = ref([]);
const finestres = ref([]);
const textDades = ref("");

const obtenirDades = async () => {
  try {
    const cosPeticio = {
      aules: [8, 10, 12, 9, 11, 13, 42, 49, 43, 54, 44, 45, 46],
      data: "2025-02-10",
      tipus: "volum",
    };

    const resposta = await getMapa(cosPeticio);
    dadesAules.value = resposta;

    textDades.value = resposta
      .map((aula) => {
        return `Aula: ${aula.Curs}, Volum: ${aula.average}`;
      })
      .join("\n");

    console.log("Dades rebudes:", dadesAules.value);
  } catch (error) {
    console.error("Error en obtenir les dades:", error);
  }
};

const tancarFinestra = (index) => {
  finestres.value.splice(index, 1);
};

const obtenirColorInterpolat = (valor, min, max) => {
  const proporcio = (valor - min) / (max - min);
  const vermell = Math.round(255 * proporcio);
  const blau = Math.round(255 * (1 - proporcio));
  return `rgb(${vermell}, 0, ${blau})`;
};

onMounted(async () => {
  await obtenirDades();
  await nextTick();

  if (!stageRef.value) {
    console.error("stageRef és nul");
    return;
  }

  const imatge = "./PLANTA 1.png";
  const objecteImatge = new Image();

  objecteImatge.onload = function () {
    const ampleImg = objecteImatge.width;
    const altImg = objecteImatge.height;

    const ampleCanvas = stageRef.value.offsetWidth;
    const altCanvas = stageRef.value.offsetHeight;
    const factorEscala = Math.min(ampleCanvas / ampleImg, altCanvas / altImg);
    const ampleEscalat = ampleImg * factorEscala;
    const altEscalat = altImg * factorEscala;
    const x = (ampleCanvas - ampleEscalat) / 2;
    const y = (altCanvas - altEscalat) / 2 - 200; // ← Imatge més amunt

    const stage = new Konva.Stage({
      container: stageRef.value,
      width: ampleCanvas,
      height: altCanvas,
    });

    const capa = new Konva.Layer();
    stage.add(capa);

    const konvaImage = new Konva.Image({
      x: x,
      y: y,
      image: objecteImatge,
      width: ampleEscalat,
      height: altEscalat,
    });

    capa.add(konvaImage);

    const punts = dadesAules.value.map((aula) => ({
      x: aula.x,
      y: aula.y,
      popupX: aula.popupX,
      popupY: aula.popupY,
      idAula: aula.idAula,
      volum: aula.average,
      activat: true,
    }));

    console.log("Punts processats:", punts);

    const volumMin = Math.min(...punts.map((p) => p.volum));
    const volumMax = Math.max(...punts.map((p) => p.volum));

    punts.forEach((punt) => {
      const color = punt.activat
        ? obtenirColorInterpolat(punt.volum, volumMin, volumMax)
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
        if (!punt.activat) return;

        finestres.value.push({
          idAula: punt.idAula,
          Curs: dadesAules.value.find((a) => a.idAula == punt.idAula)?.Curs || "",
          volum: punt.volum.toFixed(2),
          position: { x: punt.popupX, y: punt.popupY },
        });
      });

      capa.add(cercle);
    });

    capa.batchDraw();
  };

  objecteImatge.src = imatge;
});
</script>

<template>
  <div ref="stageRef" class="canvas-container">
    <InfoCard
      v-for="(finestra, index) in finestres"
      :key="index"
      :info="`Aula: ${finestra.Curs} - Volum: ${finestra.volum}`"
      :position="finestra.position"
      @close="tancarFinestra(index)"
    />

    <div class="info-text">
      <h3>Informació de les Aules</h3>
      <pre>{{ textDades }}</pre>
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

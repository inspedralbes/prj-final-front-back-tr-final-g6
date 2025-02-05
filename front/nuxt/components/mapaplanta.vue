<script setup>
import { onMounted, ref } from "vue";
import Konva from "konva";

const stageRef = ref(null);
const showPopup = ref(false);  // Para controlar la visibilidad del contenedor de información
const popupInfo = ref("");     // Contenedor de información

onMounted(() => {
  const imageUrl = '/Planta 1.png'; // Ruta de la imagen en la carpeta public
  const imageObj = new Image();

  imageObj.onload = function() {
    // Obtener las dimensiones de la imagen
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    // Ajustar el tamaño del canvas
    const canvasWidth = stageRef.value.offsetWidth;
    const canvasHeight = stageRef.value.offsetHeight;

    // Calcular la escala para ajustar la imagen dentro del canvas
    const scaleFactor = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);

    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    // Calcular la posición para centrar la imagen en el canvas
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 2;

    // Crear el stage y la capa en Konva
    const stage = new Konva.Stage({
      container: stageRef.value, // Contenedor del canvas
      width: canvasWidth,
      height: canvasHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Crear la imagen en Konva
    const konvaImage = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: scaledWidth,
      height: scaledHeight,
    });

    layer.add(konvaImage);

    // Puntos interactivos (13 puntos)
const points = [
  { x: 129 * scaleFactor, y: 119 * scaleFactor, info: "Zona 1: Información futura." },
  { x: 192 * scaleFactor, y: 112 * scaleFactor, info: "Zona 2: Información futura." },
  { x: 136 * scaleFactor, y: 208 * scaleFactor, info: "Zona 3: Información futura." },
  { x: 200 * scaleFactor, y: 202 * scaleFactor, info: "Zona 4: Información futura." },
  { x: 355 * scaleFactor, y: 100 * scaleFactor, info: "Zona 5: Información futura." },
  { x: 330 * scaleFactor, y: 192 * scaleFactor, info: "Zona 6: Información futura." },
  { x: 730 * scaleFactor, y: 115 * scaleFactor, info: "Zona 7: Información futura." },
  { x: 794 * scaleFactor, y: 122 * scaleFactor, info: "Zona 8: Información futura." },
  { x: 530 * scaleFactor, y: 190 * scaleFactor, info: "Zona 9: Información futura." },

  { x: 200 * scaleFactor, y: 50 * scaleFactor, info: "Zona 10: Información futura." },

  { x: 200 * scaleFactor, y: 50 * scaleFactor, info: "Zona 11: Información futura." },

  { x: 200 * scaleFactor, y: 50 * scaleFactor, info: "Zona 12: Información futura." },

  { x: 200 * scaleFactor, y: 50 * scaleFactor, info: "Zona 13: Información futura." },

];


    points.forEach(point => {
      const circle = new Konva.Circle({
        x: x + point.x * scaleFactor,  // Ajustar la posición según la escala
        y: y + point.y * scaleFactor,
        radius: 10,
        fill: "gray",
        stroke: "black",
        strokeWidth: 2,
        draggable: true,  // Hacer que el círculo sea arrastrable
      });

      // Mostrar un contenedor de información al hacer clic en el punto
      circle.on('click', () => {
        popupInfo.value = point.info;  // Mostrar la información asociada al punto
        showPopup.value = true;  // Hacer visible el contenedor de información
      });

      layer.add(circle);
    });

    layer.batchDraw();
  };

  imageObj.src = imageUrl;
});
</script>

<template>
  <div ref="stageRef" class="canvas-container">
    <!-- Contenedor de información (popup) -->
    <div v-if="showPopup" class="popup">
      <p>{{ popupInfo }}</p>
      <button @click="showPopup = false">Cerrar</button>
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
  background-color: transparent;
}

.popup {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
  max-width: 300px;
}

.popup button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

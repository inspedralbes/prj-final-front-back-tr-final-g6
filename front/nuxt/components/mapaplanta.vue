<script setup>
import { onMounted, ref } from "vue";
import Konva from "konva";

const stageRef = ref(null);
const showPopup = ref(false);  // Para controlar la visibilidad del contenedor de información
const popupInfo = ref("");     // Contenedor de información
const popupPosition = ref({ x: 0, y: 0 });  // Posición dinámica del popup

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

    // Puntos interactivos (13 puntos) con posiciones manuales para los popups
    const points = [
      { x: 179, y: 164, info: "2N ESO A: Información futura.", popupX: 175, popupY: 350 },
      { x: 268, y: 156, info: "2N ESO C: Información futura.", popupX: 320, popupY: 350 },
      { x: 494, y: 135, info: "2N ESO E: Información futura.", popupX: 599, popupY: 350 },

      { x: 189, y: 288, info: "2N ESO B: Información futura.", popupX: 180, popupY: 550 },
      { x: 279, y: 280, info: "2N ESO D: Información futura.", popupX: 299, popupY: 540 },
      { x: 458, y: 265, info: "2N ESO F: Información futura.", popupX: 540, popupY: 530 },

      { x: 735, y: 260, info: "1R SMIX / SMIX-B1: Información futura.", popupX: 920, popupY: 490 },
      { x: 824, y: 268, info: "PFI 2: Información futura.", popupX: 1100, popupY: 500 },
      
      { x: 915, y: 274, info: "1R SMIX-A1 / 1R SMIX-B2: Información futura.", popupX: 1190, popupY: 490 },
      { x: 1003, y: 283, info: "1R DAM / 1 A 3D: Información futura.", popupX: 1290, popupY: 490 },
      { x: 1016, y: 160, info: "1R SMIX-A2 / DAM-VI: Información futura.", popupX: 1300, popupY: 350 },

      { x: 1103, y: 168, info: "1 SMIX / 2N A43D: Información futura.", popupX: 1440, popupY: 360 },
      { x: 1095, y: 294, info: "1SMX-A3 / 2SMX-B: Información futura.", popupX: 1430, popupY: 530 },
    ];

    points.forEach(point => {
      const circle = new Konva.Circle({
        x: x + point.x * scaleFactor,  // Ajustar la posición según la escala
        y: y + point.y * scaleFactor,
        radius: 10,
        fill: "red",
        stroke: "black",
        strokeWidth: 2,
        draggable: false,  // Hacer que el círculo sea arrastrable
      });

      // Mostrar un contenedor de información al hacer clic en el punto
      circle.on('click', (e) => {
        popupInfo.value = point.info;  // Mostrar la información asociada al punto
        showPopup.value = true;  // Hacer visible el contenedor de información

        // Usar las posiciones manuales del popup
        popupPosition.value = {
          x: point.popupX, // Usar el valor de la posición X predefinida
          y: point.popupY, // Usar el valor de la posición Y predefinida
        };
      });

      layer.add(circle);
    });

    layer.batchDraw();
  };

  imageObj.src = imageUrl;
});
</script>

<template>
  <!-- Contenedor del canvas de Konva -->
  <div ref="stageRef" class="canvas-container"></div>

  <!-- Contenedor de información (popup) -->
  <div v-if="showPopup" class="popup" :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }">
    <p>{{ popupInfo }}</p>
  </div>
</template>

<style scoped>
/* Asegurarse de que el contenedor de Konva ocupa todo el espacio */
.canvas-container {
  width: 100%;
  height: 100vh;  /* Usar toda la altura de la ventana */
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: transparent;
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
</style>

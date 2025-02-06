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

    // Puntos interactivos (13 puntos)
    const points = [
      { x: 179, y: 164, info: "2N ESO A: Información futura." },
      { x: 268, y: 156, info: "2N ESO C: Información futura." },
      { x: 494, y: 135, info: "2N ESO E: Información futura." },
      { x: 189, y: 288, info: "2N ESO B: Información futura." },
      { x: 355, y: 100, info: "Zona 5: Información futura." },
      { x: 330, y: 192, info: "Zona 6: Información futura." },
      { x: 730, y: 115, info: "Zona 7: Información futura." },
      { x: 794, y: 122, info: "Zona 8: Información futura." },
      { x: 530, y: 190, info: "Zona 9: Información futura." },
      { x: 591, y: 194, info: "Zona 10: Información futura." },
      { x: 657, y: 199, info: "Zona 11: Información futura." },
      { x: 722, y: 205, info: "Zona 12: Información futura." },
      { x: 788, y: 211, info: "Zona 13: Información futura." },
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

        // Posicionar el popup sobre el punto seleccionado
        const stageBox = stageRef.value.getBoundingClientRect();
        const scale = stage.scaleX();  // Escala aplicada al stage

        // Ajustamos la posición del popup en base a la posición de la zona
        popupPosition.value = {
          x: stageBox.left + e.evt.clientX / scale, // Convertir a coordenadas reales
          y: stageBox.top + e.evt.clientY / scale,
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

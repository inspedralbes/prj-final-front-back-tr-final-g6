<script setup>
import { onMounted, ref } from "vue";
import Konva from "konva";

const stageRef = ref(null);

onMounted(() => {
  const imageUrl = '/Planta 1.png'; // Ruta de la imagen en la carpeta public
  const imageObj = new Image();

  imageObj.onload = function() {
    // Obtener las dimensiones de la imagen
    const imgWidth = imageObj.width;
    const imgHeight = imageObj.height;

    // Fijar las dimensiones del canvas de forma rectangular (más ancho que alto)
    const canvasWidth = 1500;  // Tamaño fijo para el contenedor del canvas (ancho)
    const canvasHeight = 600;  // Tamaño fijo para el contenedor del canvas (alto)

    // Fijar un pequeño margen (por ejemplo, 50px de margen alrededor de la imagen)
    const margin = 50;  // Margen pequeño alrededor de la imagen

    // Ajustar el tamaño del canvas para dejar el margen
    const usableWidth = canvasWidth - 2 * margin;
    const usableHeight = canvasHeight - 2 * margin;

    // Crear el stage con el tamaño rectangular
    const stage = new Konva.Stage({
      container: stageRef.value,  // referencia al contenedor del canvas
      width: canvasWidth,  // Establecer un ancho fijo para el canvas
      height: canvasHeight,  // Establecer un alto fijo para el canvas
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Calcular la escala para que la imagen ocupe todo el ancho disponible dentro del canvas (sin deformar)
    const scaleFactor = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);

    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    // Calcular la posición para centrar la imagen en el canvas (deja margen en los lados)
    const x = (canvasWidth - scaledWidth) / 2; // Posición centrada en el eje X con margen
    const y = (canvasHeight - scaledHeight) / 2; // Posición centrada en el eje Y con margen

    // Crear la imagen en Konva
    const konvaImage = new Konva.Image({
      x: x, // Posición centrada en el eje X
      y: y, // Posición centrada en el eje Y
      image: imageObj,
      width: scaledWidth,  // Ancho escalado de la imagen
      height: scaledHeight,  // Alto escalado de la imagen
    });

    layer.add(konvaImage);
    layer.batchDraw();
  };

  imageObj.src = imageUrl;  // Cargar la imagen
});
</script>

<template>
  <div ref="stageRef" class="canvas-container"></div>
</template>

<style scoped>
.canvas-container {
  width: 100%;   /* El canvas ocupará el 100% del ancho del contenedor */
  height: 100%;  /* El canvas ocupará el 100% del alto del contenedor */
  padding: 0;    /* Eliminar cualquier padding por defecto */
  margin: 0;     /* Eliminar cualquier margen por defecto */
  overflow: hidden; /* Evitar que haya barras de desplazamiento */
  background-color: transparent; /* Fondo transparente */
}
</style>

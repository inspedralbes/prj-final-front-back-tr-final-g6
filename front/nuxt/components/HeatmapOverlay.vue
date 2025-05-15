<template>
    <div ref="heatmapContainer" class="heatmap-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import h337 from 'heatmap.js'

const props = defineProps({
    dataPoints: {
        type: Array,
        default: () => []
    },
    max: {
        type: Number,
        default: 100
    },
    min: {
        type: Number,
        default: 0
    },
    radius: {
        type: Number,
        default: 25
    },
    blur: {
        type: Number,
        default: 0.85
    },
    gradient: {
        type: Object,
        default: () => ({
            '0.1': 'blue',
            '0.5': 'yellow',
            '0.95': 'red'
        })
    }
})

const heatmapContainer = ref(null)
let heatmapInstance = null

const createHeatmap = () => {
  if (heatmapInstance) {
    heatmapInstance.setData({ max: 0, min: 0, data: [] })
    heatmapInstance._renderer.setDimensions(0, 0)
    heatmapInstance = null
  }
  if (heatmapContainer.value) {
    while (heatmapContainer.value.firstChild) {
      heatmapContainer.value.removeChild(heatmapContainer.value.firstChild)
    }
    heatmapInstance = h337.create({
      container: heatmapContainer.value,
      radius: props.radius,
      blur: props.blur,
      maxOpacity: 0.8,
      minOpacity: 0.2,
      gradient: props.gradient,
      backgroundColor: 'rgba(0,0,0,0)',
      useGPUTransform: true
    })
    // Forzar willReadFrequently en el canvas
    const canvas = heatmapContainer.value.querySelector('canvas')
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      // Opcional: reasigna el contexto si la librería lo permite
    }
  }
}

const updateHeatmap = async () => {
    await nextTick()
    if (!heatmapContainer.value) return
    if (!heatmapInstance) createHeatmap()
    if (!heatmapInstance) return

    // Ajusta el tamaño del contenedor si es necesario
    const parent = heatmapContainer.value.parentElement
    if (parent) {
        heatmapContainer.value.style.width = parent.offsetWidth + 'px'
        heatmapContainer.value.style.height = parent.offsetHeight + 'px'
    }

    // Filtra puntos válidos
    const validPoints = props.dataPoints.filter(point =>
        !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.value)
    )

    let max = props.max
    let min = props.min

    // Previene el bug de heatmap.js: max == min o solo un punto
    let patchedPoints = [...validPoints]
    if (validPoints.length === 1 || max === min) {
        // Añade un punto invisible fuera del área visible
        patchedPoints.push({
            x: -9999,
            y: -9999,
            value: max === min ? max + 1 : max + 0.0001
        })
        max = max + 0.0001
        min = min - 0.0001
    }

    const heatmapData = {
        max,
        min,
        data: patchedPoints
    }

    try {
        heatmapInstance.setData(heatmapData)
    } catch (e) {
        // Reintenta recreando la instancia si hay error
        createHeatmap()
        try {
            heatmapInstance.setData(heatmapData)
        } catch (err) {
            // Loguea y evita romper Vue
            console.error('Heatmap.js error:', err)
        }
    }
}

onMounted(() => {
    createHeatmap()
    updateHeatmap()
})

onBeforeUnmount(() => {
    if (heatmapInstance) {
        heatmapInstance.setData({ max: 0, min: 0, data: [] })
        heatmapInstance._renderer.setDimensions(0, 0)
        heatmapInstance = null
    }
})

// Watchers
watch(() => props.dataPoints, updateHeatmap, { deep: true })
watch(() => props.max, updateHeatmap)
watch(() => props.min, updateHeatmap)
watch(() => props.radius, () => {
    createHeatmap()
    updateHeatmap()
})
watch(() => props.gradient, () => {
    createHeatmap()
    updateHeatmap()
})
</script>

<style>
.heatmap-container {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 15;
}
</style>
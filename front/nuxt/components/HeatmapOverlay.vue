<template>
    <div ref="heatmapContainer" class="heatmap-container"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import h337 from 'heatmap.js'

const props = defineProps({
    dataPoints: Array,
    max: Number,
    min: Number,
    radius: {
        type: Number,
        default: 25
    },
    blur: {
        type: Number,
        default: 0.85
    }
})

const heatmapContainer = ref(null)
let heatmapInstance = null

onMounted(() => {
    if (heatmapContainer.value) {
        heatmapInstance = h337.create({
            container: heatmapContainer.value,
            radius: props.radius,
            blur: props.blur,
            maxOpacity: 0.6,
            minOpacity: 0.1,
            gradient: {
                '0.1': 'blue',
                '0.5': 'yellow',
                '0.95': 'red'
            }
        })
        updateHeatmap()
    }
})

const updateHeatmap = () => {
    if (!heatmapInstance) return

    const heatmapData = {
        max: props.max,
        min: props.min,
        data: props.dataPoints.map(point => ({
            x: point.x,
            y: point.y,
            value: point.value
        }))
    }

    heatmapInstance.setData(heatmapData)
}

watch(() => props.dataPoints, updateHeatmap)
watch(() => props.max, updateHeatmap)
watch(() => props.min, updateHeatmap)
</script>

<style scoped>
.heatmap-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
}
</style>
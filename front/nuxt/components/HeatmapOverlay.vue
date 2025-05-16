<template>
    <div ref="heatmapContainer" class="heatmap-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import h337 from 'heatmap.js'

const props = defineProps({
    dataPoints: {
        type: Array,
        default: () => [],
        validator: (value) => {
            return Array.isArray(value) && value.every(point =>
                point &&
                typeof point.x === 'number' &&
                typeof point.y === 'number' &&
                typeof point.value === 'number'
            )
        }
    },
    max: {
        type: Number,
        default: null,
        validator: (value) => value === null || !isNaN(value)
    },
    min: {
        type: Number,
        default: null,
        validator: (value) => value === null || !isNaN(value)
    },
    radius: {
        type: Number,
        default: 25,
        validator: (value) => value > 0
    },
    blur: {
        type: Number,
        default: 0.85,
        validator: (value) => value >= 0 && value <= 1
    },
    gradient: {
        type: Object,
        default: () => ({
            '0.1': '#60a5fa', // blue-400
            '0.5': '#fbbf24', // amber-400
            '0.9': '#ef4444'  // red-500
        }),
        validator: (value) => {
            return value && Object.keys(value).every(key => {
                const num = parseFloat(key)
                return !isNaN(num) && num >= 0 && num <= 1
            })
        }
    }
})

const heatmapContainer = ref(null)
let heatmapInstance = null
let resizeObserver = null
const isInitialized = ref(false)

const initHeatmap = () => {
    if (!heatmapContainer.value) {
        console.warn("Heatmap container not available");
        return false;
    }

    // Make sure the container has proper dimensions before initializing
    const width = heatmapContainer.value.parentElement?.offsetWidth || 100;
    const height = heatmapContainer.value.parentElement?.offsetHeight || 100;
    heatmapContainer.value.style.width = `${width}px`;
    heatmapContainer.value.style.height = `${height}px`;

    // Clean up previous instance if exists
    if (heatmapInstance) {
        try {
            heatmapInstance._renderer?.canvas?.remove();
            heatmapInstance = null;
        } catch (e) {
            console.warn("Error cleaning previous heatmap", e);
        }
    }

    try {
        // Create new heatmap with safer configuration
        const config = {
            container: heatmapContainer.value,
            radius: props.radius,
            blur: props.blur,
            maxOpacity: 0.8,
            minOpacity: 0.3,
            gradient: props.gradient,
            backgroundColor: 'rgba(0,0,0,0)',
        };

        heatmapInstance = h337.create(config);
        
        // Only patch the renderer if it exists and has a _colorize method
        if (heatmapInstance._renderer && typeof heatmapInstance._renderer._colorize === 'function') {
            const originalColorize = heatmapInstance._renderer._colorize;
            heatmapInstance._renderer._colorize = function (imageData) {
                try {
                    // Add safety checks for imageData
                    if (!imageData || typeof imageData.width === 'undefined') {
                        console.warn('Invalid imageData in _colorize', imageData);
                        return false;
                    }
                    
                    // Rest of your patched _colorize method...
                    const canvas = document.createElement('canvas');
                    canvas.width = imageData.width;
                    canvas.height = imageData.height;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    
                    ctx.putImageData(imageData, 0, 0);
                    const newImgData = ctx.getImageData(0, 0, imageData.width, imageData.height);
                    
                    const result = originalColorize.call(this, newImgData);
                    
                    if (result !== false) {
                        ctx.putImageData(newImgData, 0, 0);
                        this.ctx.drawImage(canvas, 0, 0);
                        return true;
                    }
                    return false;
                } catch (e) {
                    console.error("Error in patched _colorize", e);
                    return false;
                }
            };
        }

        isInitialized.value = true;
        return true;
    } catch (e) {
        console.error("Failed to initialize heatmap", e);
        isInitialized.value = false;
        return false;
    }
};

const updateHeatmap = () => {
    if (!heatmapInstance || !isInitialized.value) {
        if (!initHeatmap()) return;
    }

    try {
        const validPoints = props.dataPoints.filter(point => {
            return (
                typeof point.x === 'number' &&
                typeof point.y === 'number' &&
                typeof point.value === 'number' &&
                !isNaN(point.value)
            );
        });

        if (validPoints.length === 0) {
            console.log("No valid heatmap points to display");
            return;
        }

        const { min, max } = calculateMinMax(validPoints);

        const data = {
            max: props.max !== null ? props.max : max,
            min: props.min !== null ? props.min : min,
            data: validPoints
        };

        console.log("Setting heatmap data:", data);
        heatmapInstance.setData(data);
    } catch (e) {
        console.error("Error updating heatmap data:", e);
        // Attempt recovery with delay
        setTimeout(() => {
            initHeatmap();
            updateHeatmap();
        }, 500);
    }
};

const calculateMinMax = (points) => {
    if (points.length === 0) return { min: 0, max: 1 }

    const values = points.map(p => p.value).filter(v => !isNaN(v))
    if (values.length === 0) return { min: 0, max: 1 }

    let min = Math.min(...values)
    let max = Math.max(...values)

    // Ensure there's always a visible range
    if (min === max) {
        min = Math.max(0, min - 5)
        max = max + 5
    }

    return { min, max }
}

const handleResize = () => {
    if (!heatmapContainer.value?.parentElement) return

    const width = Math.max(1, heatmapContainer.value.parentElement.offsetWidth)
    const height = Math.max(1, heatmapContainer.value.parentElement.offsetHeight)

    heatmapContainer.value.style.width = `${width}px`
    heatmapContainer.value.style.height = `${height}px`

    if (heatmapInstance?._renderer) {
        heatmapInstance._renderer.setDimensions(width, height)
        updateHeatmap()
    }
}

onMounted(() => {
    // Wait for the next DOM update cycle
    nextTick(() => {
        // Initialize and set dimensions
        handleResize();
        initHeatmap();
        
        // Set up resize observer
        if (window.ResizeObserver && heatmapContainer.value?.parentElement) {
            resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(heatmapContainer.value.parentElement);
        }
        
        // Initial update with a small delay to ensure DOM is ready
        if (props.dataPoints.length > 0) {
            setTimeout(updateHeatmap, 100);
        }
    });
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect()

    if (heatmapInstance) {
        try {
            heatmapInstance._renderer.canvas.remove()
        } catch (e) {
            console.warn("Error cleaning heatmap", e)
        }
        heatmapInstance = null
    }
})

// Watchers
watch(() => props.dataPoints, (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        updateHeatmap()
    }
}, { deep: true })

watch(() => [props.max, props.min, props.blur], () => {
    updateHeatmap()
})

watch(() => [props.radius, props.gradient], () => {
    initHeatmap()
    updateHeatmap()
})
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
    /* Asegurarse que está por encima del mapa pero debajo de los popups */
    contain: strict;
}
</style>
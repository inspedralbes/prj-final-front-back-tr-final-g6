<template>
    <div class="info-card" :style="{ top: position.y + 'px', left: position.x + 'px' }">
        <p>{{ info }}</p>
        <button @click="$emit('close')" class="close-btn">X</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    info: {
        type: String,
        required: true,
        default: 'Informació no disponible'
    },
    position: {
        type: Object,
        required: true,
        default: () => ({ x: 0, y: 0 })
    }
});
</script>

<style scoped>
.info-card {
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
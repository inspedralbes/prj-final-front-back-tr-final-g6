<template>
    <div class="info-card" :style="{ top: position.y + 'px', left: position.x + 'px', transform: 'translate(-50%, -100%)' }">
        <div class="info-content">
            <div v-for="(item, index) in parsedInfo" :key="index" class="info-item">
                <i v-if="item.icon" :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </div>
        </div>
        <button @click="$emit('close')" class="close-btn">X</button>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

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

const parsedInfo = computed(() => {
    const parts = props.info.split(' - ');
    return parts.map(part => {
        if (part.includes('Temperatura')) {
            return { text: part, icon: 'fas fa-thermometer-half' };
        } else if (part.includes('Humitat')) {
            return { text: part, icon: 'fas fa-tint' };
        } else if (part.includes('Volum')) {
            return { text: part, icon: 'fas fa-volume-up' };
        }
        return { text: part };
    });
});
</script>

<style scoped>
.info-card {
    position: absolute;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 8px;
    min-width: 200px;
    max-width: 300px;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-item i {
    width: 20px;
    text-align: center;
}

.close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
}

.close-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ff4444;
}
</style>
<template>
    <div 
      class="info-card" 
      :style="{ top: position.y + 'px', left: position.x + 'px' }"
    >
      <div class="info-card-content">
        <div class="info-card-header">
          <h3 class="info-card-title">{{ title || 'Informació del Sensor' }}</h3>
          <button @click="$emit('close')" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="info-card-body">
          <p>{{ info }}</p>
          
          <div v-if="sensorData" class="sensor-stats">
            <div class="sensor-stat">
              <span class="stat-label">Temperatura:</span>
              <span class="stat-value">{{ formatValue(sensorData.temperatura, 'temperatura') }}</span>
            </div>
            <div class="sensor-stat">
              <span class="stat-label">Humitat:</span>
              <span class="stat-value">{{ formatValue(sensorData.humitat, 'humitat') }}</span>
            </div>
            <div class="sensor-stat">
              <span class="stat-label">Volum:</span>
              <span class="stat-value">{{ formatValue(sensorData.volum, 'volum') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    info: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      required: true,
      default: () => ({ x: 0, y: 0 })
    },
    title: {
      type: String,
      default: ''
    },
    sensorData: {
      type: Object,
      default: null
    }
  });
  
  defineEmits(['close']);
  
  const formatValue = (value, type) => {
    if (value === undefined || value === null) return 'N/D';
    
    const formattedValue = Number(value).toFixed(2);
    
    switch (type) {
      case 'temperatura':
        return `${formattedValue}°C`;
      case 'humitat':
        return `${formattedValue}ppm`;
      case 'volum':
        return `${formattedValue}dB`;
      default:
        return formattedValue;
    }
  };
  </script>
  
  <style scoped>
  .info-card {
    position: absolute;
    z-index: 10;
    pointer-events: all;
  }
  
  .info-card-content {
    min-width: 300px;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(20, 184, 166, 0.5);
    color: white;
    backdrop-filter: blur(10px);
  }
  
  .info-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .info-card-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: rgb(94, 234, 212);
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background-color: rgba(239, 68, 68, 0.2);
    color: rgb(239, 68, 68);
  }
  
  .info-card-body {
    font-size: 0.95rem;
  }
  
  .sensor-stats {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: rgba(51, 65, 85, 0.5);
    padding: 12px;
    border-radius: 6px;
  }
  
  .sensor-stat {
    display: flex;
    justify-content: space-between;
  }
  
  .stat-label {
    color: rgb(148, 163, 184);
    font-weight: 500;
  }
  
  .stat-value {
    font-weight: 600;
  }
  </style>
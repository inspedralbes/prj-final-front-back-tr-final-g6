<template>
  <div class="bg-slate-800 rounded-lg p-4 shadow-lg">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="item in items"
          :key="item.label"
          :label="item.label"
          :icon="item.icon"
          @click="updateSensorType(item.value)"
          :class="{
            'bg-teal-600 border-teal-600': selectedSensorType === item.value,
            'bg-slate-700 border-slate-600': selectedSensorType !== item.value
          }"
          class="text-white font-medium py-2 px-4 rounded-lg border transition-all duration-300 flex items-center gap-2"
        >
          <i :class="item.icon" class="mr-2"></i>
          {{ item.label }}
        </Button>
      </div>

      <Dropdown
        v-model="selectedRange"
        :options="ranges"
        optionLabel="label"
        optionValue="value"
        class="w-48 [&>div]:bg-slate-700 [&>div]:border-slate-600 [&>div]:text-white relative z-[1000]"
        panelClass="bg-slate-700 border border-slate-600 text-white absolute z-[1000]"
        placeholder="Selecciona el rang"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

const selectedRange = ref('');
const selectedSensorType = ref('temperature'); // Valor per defecte

const items = [
  { label: 'Temperatura', value: 'temperature', icon: 'fas fa-temperature-high' },
  { label: 'Humitat', value: 'humetat', icon: 'fas fa-droplet' },
  { label: 'Volum', value: 'volume', icon: 'fas fa-volume-high' }
];

const ranges = [
  { label: 'Última hora', value: '1h' },
  { label: 'Últim dia', value: '24h' },
  { label: 'Última setmana', value: '7d' },
  { label: 'Últim mes', value: '30d' }
];

const emit = defineEmits(['update:sensorType']);

const updateSensorType = (type) => {
  selectedSensorType.value = type;
  emit('update:sensorType', type);
};
</script>
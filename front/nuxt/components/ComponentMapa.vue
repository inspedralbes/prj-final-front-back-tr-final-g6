<template>
  <!-- Chart Controls -->
  <div class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="item in items"
          :key="item.label"
          :label="item.label"
          :icon="item.icon"
          @click="selectedChart = item.label"
          :class="{
            'bg-teal-600 border-teal-600': selectedChart === item.label,
            'bg-slate-700 border-slate-600': selectedChart !== item.label,
          }"
          class="text-white font-medium py-2 px-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]"
        />
      </div>

      <Dropdown
        v-model="selectedRange"
        :options="ranges"
        optionLabel="label"
        optionValue="value"
        class="w-48 [&>div]:bg-slate-700 [&>div]:border-slate-600 [&>div]:text-white"
        panelClass="bg-slate-700 border border-slate-600 text-white"
        placeholder="Selecciona el Rango"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

const selectedChart = ref('');
const selectedRange = ref('');

const items = [
  { label: 'Temperatura', icon: 'pi pi-chart-line' },
  { label: 'CO2', icon: 'pi pi-chart-bar' },
  { label: 'Volumen', icon: 'pi pi-chart-pie' }
];

const ranges = [
  { label: 'Última hora', value: '1h' },
  { label: 'Último día', value: '24h' },
  { label: 'Última semana', value: '7d' },
  { label: 'Último mes', value: '30d' }
];
</script>

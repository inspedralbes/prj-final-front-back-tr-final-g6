<template>
  <div class="min-h-screen bg-slate-900 flex flex-col">
    <!-- Gradient Header Section -->
    <div class="w-full bg-gradient-to-r from-teal-800 to-blue-900 p-6">
      <div class="max-w-7xl mx-auto flex flex-col items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Detalls de l'Aula
        </h1>
        <p class="text-teal-200 font-medium">
          Institut Pedralbes • Monitorització en temps real
        </p>
      </div>
    </div>

    <!-- Aula Info Section -->
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <div v-if="aula" class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="p-4 bg-slate-700/50 rounded-lg">
            <p class="text-sm text-teal-400 font-medium">Classe</p>
            <p class="text-lg font-semibold text-white">
              {{ aula.Classe || "Sense classe" }}
            </p>
          </div>
          <div class="p-4 bg-slate-700/50 rounded-lg">
            <p class="text-sm text-teal-400 font-medium">Etapa</p>
            <p class="text-lg font-semibold text-white">{{ aula.Etapa }}</p>
          </div>
          <div class="p-4 bg-slate-700/50 rounded-lg">
            <p class="text-sm text-teal-400 font-medium">Planta</p>
            <p class="text-lg font-semibold text-white">{{ aula.Planta }}</p>
          </div>
          <div class="p-4 bg-slate-700/50 rounded-lg">
            <p class="text-sm text-teal-400 font-medium">Aula</p>
            <p class="text-lg font-semibold text-white">{{ aula.Aula }}</p>
          </div>
        </div>
      </div>

      <!-- Chart Controls -->
      <div class="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex flex-wrap gap-2">
            <Button v-for="item in items" :key="item.label" :label="item.label" :icon="item.icon"
              @click="selectedChart = item.label" :class="{
                'bg-teal-600 border-teal-600': selectedChart === item.label,
                'bg-slate-700 border-slate-600': selectedChart !== item.label,
              }"
              class="text-white font-medium py-2 px-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]" />
          </div>

          <Dropdown v-model="selectedRange" :options="ranges" optionLabel="label" optionValue="value"
            class="w-48 [&>div]:bg-slate-700 [&>div]:border-slate-600 [&>div]:text-white"
            panelClass="bg-slate-700 border border-slate-600 text-white" placeholder="Selecciona el Rango" />
        </div>
      </div>

      <div class="h-[500px]">
        <component :is="currentChart" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

import TemperatureActual from './charts/temperatura/TemperatureActual.vue';
import TemperatureMinuteChart from "./charts/temperatura/TemperatureMinuteChart.vue";
import TemperatureHourChart from "./charts/temperatura/TemperatureHourChart.vue";
import TemperatureDayChart from "./charts/temperatura/TemperatureDayChart.vue";
import TemperatureWeekChart from "./charts/temperatura/TemperatureWeekChart.vue";
import TemperatureMonthChart from "./charts/temperatura/TemperatureMonthChart.vue";
import TemperatureCourseChart from "./charts/temperatura/TemperatureCourseChart.vue";

import HumitatActual from './charts/humitat/HumitatActual.vue';
import HumitatMinuteChart from './charts/humitat/HumitatMinuteChart.vue';
import HumitatHourChart from './charts/humitat/HumitatHourChart.vue';
import HumitatDayChart from './charts/humitat/HumitatDayChart.vue';
import HumitatWeekChart from './charts/humitat/HumitatWeekChart.vue';
import HumitatMonthChart from './charts/humitat/HumitatMonthChart.vue';
import HumitatCourseChart from './charts/humitat/HumitatCourseChart.vue';

import VolumeActual from './charts/volume/VolumeActual.vue';
import VolumeMinuteChart from './charts/volume/VolumeMinuteChart.vue';
import VolumeHourChart from './charts/volume/VolumeHourChart.vue';
import VolumeDayChart from './charts/volume/VolumeDayChart.vue';
import VolumeWeekChart from './charts/volume/VolumeWeekChart.vue';
import VolumeMonthChart from './charts/volume/VolumeMonthChart.vue';
import VolumeCourseChart from './charts/volume/VolumeCourseChart.vue';

const route = useRoute();
const aulaId = route.params.id;
const aula = ref({
  Classe: "A1",
  Etapa: "ESO",
  Planta: "Primera",
  Aula: "1",
});

const chartComponents = {
  Temperatura: {
    actual: TemperatureActual,
    minuts: TemperatureMinuteChart,
    hours: TemperatureHourChart,
    daily: TemperatureDayChart,
    weekly: TemperatureWeekChart,
    monthly: TemperatureMonthChart,
    course: TemperatureCourseChart,
  },
  Humitat: {
    actual: HumitatActual,
    minuts: HumitatMinuteChart,
    hours: HumitatHourChart,
    daily: HumitatDayChart,
    weekly: HumitatWeekChart,
    monthly: HumitatMonthChart,
    course: HumitatCourseChart,
  },
  Volum: {
    actual: VolumeActual,
    minuts: VolumeMinuteChart,
    hours: VolumeHourChart,
    daily: VolumeDayChart,
    weekly: VolumeWeekChart,
    monthly: VolumeMonthChart,
    course: VolumeCourseChart,
  },
};

const items = [
  { label: 'Temperatura', icon: 'pi pi-sun' },
  { label: 'Humitat', icon: 'pi pi-cloud' },
  { label: 'Volum', icon: 'pi pi-volume-up' },
];

const ranges = [
  { label: 'Actual', value: 'actual' },
  { label: "Minuts", value: "minuts" },
  { label: "Hores", value: "hours" },
  { label: "Diari", value: "daily" },
  { label: "Setmanal", value: "weekly" },
  { label: "Mensual", value: "monthly" },
  { label: "Curs", value: "course" },
];

const selectedChart = ref("Temperatura");
const selectedRange = ref("actual");

// Computed para determinar el componente actual basado en el tipo de gráfico y el rango
const currentChart = computed(() => {
  const chartType = chartComponents[selectedChart.value];
  return chartType ? chartType[selectedRange.value] : null;
});
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button {
  transition: all 0.3s ease;
}

/* Dropdown styling */
:deep(.p-dropdown) {
  background: rgb(51, 65, 85);
  border: 1px solid rgb(71, 85, 105);
  transition: all 0.3s ease;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
  border-color: rgb(45, 212, 191);
}

:deep(.p-dropdown .p-dropdown-label) {
  color: white;
  padding: 0.5rem;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  color: rgb(148, 163, 184);
  width: 2.5rem;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  color: white;
  padding: 0.75rem 1rem;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
  background: rgba(45, 212, 191, 0.1);
  color: rgb(45, 212, 191);
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
  background: rgb(51, 65, 85);
  color: white;
}
</style>

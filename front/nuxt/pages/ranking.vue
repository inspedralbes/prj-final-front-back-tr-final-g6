<template>
  <div class="p-6">
    <v-container>
      <v-card class="mb-6">
        <v-card-title class="text-h4 font-weight-bold py-4 bg-slate-800 text-white">
          Ranking d'Aules
        </v-card-title>
        
        <v-card-text class="pt-4">
          <v-tabs v-model="activeTab" color="primary" grow>
            <v-tab value="temperatura">Temperatura</v-tab>
            <v-tab value="humitat">Humitat</v-tab>
            <v-tab value="volum">Volum</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4">
            <v-window-item value="temperatura">
              <v-list lines="two">
                <v-list-item
                  v-for="(aula, index) in rankingTemperatura"
                  :key="aula.id"
                  :title="aula.nom"
                  :subtitle="`Temperatura: ${aula.temperatura}°C`"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :color="getPositionColor(index)"
                      size="32"
                      class="white--text font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>

            <v-window-item value="humitat">
              <v-list lines="two">
                <v-list-item
                  v-for="(aula, index) in rankingHumitat"
                  :key="aula.id"
                  :title="aula.nom"
                  :subtitle="`Humitat: ${aula.humitat}%`"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :color="getPositionColor(index)"
                      size="32"
                      class="white--text font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>

            <v-window-item value="volum">
              <v-list lines="two">
                <v-list-item
                  v-for="(aula, index) in rankingVolum"
                  :key="aula.id"
                  :title="aula.nom"
                  :subtitle="`Volum: ${aula.volum} dB`"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :color="getPositionColor(index)"
                      size="32"
                      class="white--text font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeTab = ref('temperatura');

// Ejemplo de datos - Reemplazar con datos reales de tu API
const rankingTemperatura = ref([]);
const rankingHumitat = ref([]);
const rankingVolum = ref([]);

const getPositionColor = (index) => {
  const colors = {
    0: 'amber-darken-2', // Oro
    1: 'grey-lighten-1',  // Plata
    2: 'brown-lighten-1', // Bronce
  };
  return colors[index] || 'grey-darken-1';
};

onMounted(async () => {
  try {
    // Aquí deberías hacer las llamadas a tu API para obtener los datos reales
    // Por ahora usaremos datos de ejemplo
    rankingTemperatura.value = [
      { id: 1, nom: 'Aula 101', temperatura: 22.5 },
      { id: 2, nom: 'Aula 102', temperatura: 21.8 },
      { id: 3, nom: 'Aula 103', temperatura: 21.5 },
      { id: 4, nom: 'Aula 104', temperatura: 21.2 },
      { id: 5, nom: 'Aula 105', temperatura: 20.9 },
    ];

    rankingHumitat.value = [
      { id: 1, nom: 'Aula 103', humitat: 65 },
      { id: 2, nom: 'Aula 101', humitat: 62 },
      { id: 3, nom: 'Aula 105', humitat: 60 },
      { id: 4, nom: 'Aula 102', humitat: 58 },
      { id: 5, nom: 'Aula 104', humitat: 55 },
    ];

    rankingVolum.value = [
      { id: 1, nom: 'Aula 102', volum: 45 },
      { id: 2, nom: 'Aula 104', volum: 42 },
      { id: 3, nom: 'Aula 101', volum: 40 },
      { id: 4, nom: 'Aula 105', volum: 38 },
      { id: 5, nom: 'Aula 103', volum: 35 },
    ];
  } catch (error) {
    console.error('Error al cargar los datos del ranking:', error);
  }
});
</script>

<style scoped>
.v-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>

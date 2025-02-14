<template>
    <div>
      <Header />
  
      <div class="min-h-screen flex flex-col items-center p-8 animated-bg bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1]">
        <h1 class="text-5xl font-bold text-white mb-10 animate__animated animate__fadeIn">Mapes</h1>
        <div class="buttons mb-8 flex space-x-6">
          <button v-for="planta in plantas" :key="planta" @click="seleccionarPlanta(planta)" class="px-8 py-4 text-lg font-semibold bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            {{ planta }}
          </button>
        </div>
        <div class="map-container w-full max-w-full lg:max-w-full bg-white p-8 pt-4 rounded-xl shadow-2xl text-center flex justify-center items-center">
          <Mapaplanta1 v-if="plantaSeleccionada === 'PLANTA 1'" :aulaData="aulaData" />
          <Mapaplanta2 v-if="plantaSeleccionada === 'PLANTA 2'" :aulaData="aulaData" />
          <Mapaplanta3 v-if="plantaSeleccionada === 'PLANTA 3'" :aulaData="aulaData" />
          <MapaPlantaBaixa v-if="plantaSeleccionada === 'PLANTA BAJA'" :aulaData="aulaData" />
          <MapaPlantaSubterranea v-if="plantaSeleccionada === 'PLANTA SUBTERRANEA'" :aulaData="aulaData" />
        </div>
  
        <!-- Aquí mostramos los datos debajo del mapa -->
        <div class="info-text">
          <h3>Información de Aulas</h3>
          <pre>{{ fetchDataText }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '~/stores/userStore';
  
  import Mapaplanta1 from '~/components/Plantes/MapaPlanta-1.vue';
  import Mapaplanta2 from '~/components/Plantes/MapaPlanta-2.vue';
  import Mapaplanta3 from '~/components/Plantes/MapaPlanta-3.vue';
  import MapaPlantaBaixa from '~/components/Plantes/MapaPlantaBaixa.vue';
  import MapaPlantaSubterranea from '~/components/Plantes/MapaPlantaSubterranea.vue';
  
  const plantas = ['PLANTA BAJA', 'PLANTA 1', 'PLANTA 2', 'PLANTA 3', 'PLANTA SUBTERRANEA'];
  const plantaSeleccionada = ref('PLANTA 1');
  const aulaData = ref([]);  // Variable que contiene los datos de las aulas
  const fetchDataText = ref("");  // Información a mostrar debajo del mapa
  
  // Obtener los datos de la base de datos
  const fetchData = async () => {
    try {
      const bodyRequest = {
        "aules": [
          8, 10, 12, 9, 11, 13,
          42, 49, 43, 54, 44, 45,
          46
        ],
        "data": "2025-02-10",
        "tipus": "volum"
      };
  
      const response = await getMapa(bodyRequest);
      aulaData.value = response;
  
      // Crear la cadena con la información para mostrar debajo del mapa
      fetchDataText.value = response.map(aula => {
        return `Aula: ${aula.idAula}, Volumen: ${aula.average}`;
      }).join("\n");
  
      console.log("Datos recibidos:", aulaData.value);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };
  
  // Cambiar la planta seleccionada
  const seleccionarPlanta = (planta) => {
    console.log(`Seleccionaste: ${planta}`);
    plantaSeleccionada.value = planta;
  };
  
  const router = useRouter();
  const isMenuVisible = ref(false);
  const userStore = useUserStore();
  
  const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
  };
  
  const logout = () => {
    userStore.logout();
    router.push('/login');
  };
  
  const isAdmin = computed(() => userStore.user?.admin === 1);
  
  // Obtener los datos al montar el componente
  onMounted(async () => {
    await fetchData();
  });
  </script>
  
  <style scoped>
  .animated-bg {
    background-size: 200% 200%;
    animation: move-bg 6s ease infinite;
  }
  
  @keyframes move-bg {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  h1 {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
    animation: fadeInTitle 2s ease-in-out;
  }
  
  @keyframes fadeInTitle {
    0% {
      opacity: 0;
      transform: translateY(-40px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  button {
    transition: all 0.3s ease-in-out;
  }
  
  button:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
  
  button:active {
    transform: scale(1);
  }
  
  button:focus {
    outline: none;
  }
  
  button:focus-visible {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  .map-container {
    height: 500px;
    overflow: hidden;
  }
  
  .map-container img {
    width: 100%;
    object-fit: cover;
  }
  
  .info-text {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    max-width: 100%;
    white-space: pre-wrap; /* Esto asegura que el texto se ajuste correctamente */
    z-index: 10;
  }
  
  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  </style>
  
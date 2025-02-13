<template>
    <header class="bg-gray-900 p-4 shadow-lg text-white">
        <div class="max-w-10xl flex items-center justify-between">
            <router-link to="/aulas" class="flex items-center hover:opacity-80 transition-opacity">
                <img src="../public/logo.jpg" alt="Logo" class="w-14 h-14 rounded-full mr-3" />
            </router-link>

            <div class="relative">
                <button @click="toggleMenu"
                    class="flex items-center text-white px-4 py-2 rounded-md shadow-md transition-colors">
                    <i class="pi pi-bars mr-2 text-xl"></i> Menú
                </button>

                <div v-if="isMenuVisible"
                    class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md w-48 z-50 overflow-hidden border border-blue-500">
                    <ul>
                        <li class="px-4 py-3 hover:bg-gray-100 transition-colors">
                            <router-link to="/aulas" class="block text-sm font-medium text-gray-700">
                                Ir a Aulas
                            </router-link>
                        </li>
                        <li class="px-4 py-3 hover:bg-gray-100 transition-colors">
                            <router-link to="/configuracion" class="block text-sm font-medium text-gray-700">
                                Configuración
                            </router-link>
                        </li>
                        <li v-if="isAdmin" class="px-4 py-3 hover:bg-gray-100 transition-colors">
                            <router-link to="/admin" class="block text-sm font-medium text-gray-700">
                                Admin
                            </router-link>
                        </li>
                        <li class="px-4 py-3 hover:bg-gray-100 transition-colors">
                            <button @click="logout" class="block text-sm font-medium text-gray-700">
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>

    <div class="min-h-screen flex flex-col items-center p-8 animated-bg bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1]">
        <h1 class="text-5xl font-bold text-white mb-10 animate__animated animate__fadeIn">Mapes</h1>
        <div class="buttons mb-8 flex space-x-6">
            <button v-for="planta in plantas" :key="planta" @click="seleccionarPlanta(planta)" class="px-8 py-4 text-lg font-semibold bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {{ planta }}
            </button>
        </div>
        <div class="map-container w-full max-w-full lg:max-w-full bg-white p-8 pt-4 rounded-xl shadow-2xl text-center flex justify-center items-center">
            <Mapaplanta1 v-if="plantaSeleccionada === 'PLANTA 1'" />
            <Mapaplanta2 v-if="plantaSeleccionada === 'PLANTA 2'" />
            <Mapaplanta3 v-if="plantaSeleccionada === 'PLANTA 3'" />
            <MapaPlantaBaixa v-if="plantaSeleccionada === 'PLANTA BAJA'" />
            <MapaPlantaSubterranea v-if="plantaSeleccionada === 'PLANTA SUBTERRANEA'" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/userStore';

import Mapaplanta1 from '~/components/plantes/MapaPlanta-1.vue';
import Mapaplanta2 from '~/components/plantes/MapaPlanta-2.vue';
import Mapaplanta3 from '~/components/plantes/MapaPlanta-3.vue';
import MapaPlantaBaixa from '~/components/plantes/MapaPlantaBaixa.vue';
import MapaPlantaSubterranea from '~/components/plantes/MapaPlantaSubterranea.vue';

const plantas = ['PLANTA BAJA', 'PLANTA 1', 'PLANTA 2', 'PLANTA 3', 'PLANTA SUBTERRANEA'];
const plantaSeleccionada = ref('PLANTA 1'); // Valor predeterminado para mostrar "PLANTA 1" al inicio

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

/* Estilos para recortar la imagen */
.map-container {
    height: 500px; /* Ajusta la altura según lo necesario */
    overflow: hidden; /* Oculta el contenido que se desborda */
}

.map-container img {
    width: 100%;
    object-fit: cover; /* Asegura que la imagen se recorte y ajuste proporcionalmente */
}
</style>

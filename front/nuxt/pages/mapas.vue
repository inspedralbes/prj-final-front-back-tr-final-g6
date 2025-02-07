<template>
    <div class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center p-8 animated-bg">
        <h1 class="text-4xl font-bold text-white mb-6">Mapes</h1>
        <div class="buttons mb-4 flex space-x-4">
            <button v-for="planta in plantas" :key="planta" @click="seleccionarPlanta(planta)" class="px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-gray-200">
                {{ planta }}
            </button>
        </div>
        <div class="w-full max-w-full lg:max-w-full bg-white p-6 pt-2 rounded-lg shadow-lg text-center flex justify-center items-center">
            <div class="w-full h-[80vh] max-w-[98vw] flex justify-center items-center ml-[-93px] mr-[-93px]">
                <Mapaplanta />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Mapaplanta from '~/components/mapaplanta.vue';

const router = useRouter();
const plantas = ['PLANTA BAJA', 'PLANTA 1', 'PLANTA 2', 'PLANTA 3', 'PLANTA SUBTERRANEA'];

const seleccionarPlanta = (planta) => {
    console.log(`Seleccionaste: ${planta}`);
};
</script>

<style scoped>
.animated-bg {
    background-size: 400% 400%;
    animation: move-bg 15s ease infinite;
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
</style>

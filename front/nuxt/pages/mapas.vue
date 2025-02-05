<template>
    <div class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex flex-col items-center p-8 animated-bg">
        <h1 class="text-4xl font-bold text-white mb-6">Mapes</h1>
        <div class="w-full max-w-full lg:max-w-full bg-white p-6 pt-2 rounded-lg shadow-lg text-center flex justify-center items-center">
            <div class="w-full h-[80vh] max-w-[98vw] flex justify-center items-center ml-[-93px] mr-[-93px]">
                <!-- Llamamos al componente mapaplanta -->
                <mapaplanta />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// Importar el componente mapaplanta
import Mapaplanta from '~/components/mapaplanta.vue';

const router = useRouter();
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

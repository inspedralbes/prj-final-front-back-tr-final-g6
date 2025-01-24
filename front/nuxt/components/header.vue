<template>
    <header class="bg-gray-900 p-4 shadow-lg text-white">
        <div class="max-w-10xl flex items-center justify-between">
            <div class="text-2xl font-bold">
                <router-link to="/aulas" class="hover:text-gray-300 transition-colors">
                    <img src="../public/logo.jpg" alt="Logo" class="inline-block w-14 h-14 mr-2" />
                </router-link>
            </div>

            <div class="flex items-center ml-auto">
                <div class="relative">
                    <button @click="toggleMenu"
                        class="flex items-center text-white hover:text-gray-300 transition-colors">
                        <i class="pi pi-server mr-2"></i> Menú
                    </button>

                    <div v-if="isMenuVisible"
                        class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md w-48 z-50">
                        <ul>
                            <li class="px-4 py-2 hover:bg-gray-200">
                                <router-link to="/aulas" class="block">Ir a Aulas</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuVisible = ref(false);

const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
};
</script>

<style scoped>
</style>
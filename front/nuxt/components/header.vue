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
                            <router-link to="/mapas" class="block text-sm font-medium text-gray-700">
                                Mapas
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/userStore';

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
</style>

<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex items-center justify-center animated-bg px-4">
        <div
            class="w-full max-w-md bg-white/90 rounded-2xl shadow-lg dark:bg-gray-800 backdrop-filter backdrop-blur-md">
            <div class="p-8 space-y-6 rounded border border-transparent">
                <h1 class="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white text-center">
                    Iniciar Sesión
                </h1>
                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correo Electrónico
                        </label>
                        <input v-model="email" type="email" id="email"
                            class="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="correo@dominio.com" required />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contraseña
                        </label>
                        <input v-model="password" type="password" id="password"
                            class="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••" required />
                    </div>
                    <div class="flex justify-center">
                        <button type="submit"
                            class="w-[40%] bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform duration-300 transform hover:scale-105">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '~/utils/communicationManager';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
    try {
        const response = await login(email.value, password.value);
        console.log('Login exitoso:', response);
        router.push('/aulas');
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
    }
};
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
</style>

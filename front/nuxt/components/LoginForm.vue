<template>
    <div
        class="min-h-screen bg-gradient-to-r from-[#07C8F9] via-[#0A85ED] to-[#0D41E1] flex items-center justify-center animated-bg">
        <div
            class="w-full max-w-md bg-white rounded shadow dark:border dark:bg-gray-800 dark:border-gray-700 backdrop-filter backdrop-blur-sm">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8 rounded border border-black">
                <h1 class="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
                    Iniciar Sesión
                </h1>
                <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Correo Electrónico
                        </label>
                        <input v-model="email" type="email" name="email" id="email"
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="correo@dominio.com" required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Contraseña
                        </label>
                        <input v-model="password" type="password" name="password" id="password" placeholder="••••••••"
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required />
                    </div>
                    <div class="flex justify-center">
                        <button type="submit"
                            class="w-[40%] text-white bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-black">
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

<template>
    <div class="w-full max-w-4xl bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <!-- Hero Section with Gradient Background -->
        <div class="bg-gradient-to-r from-teal-800 to-blue-900 p-8 md:p-12 text-center">
            <div class="flex flex-col items-center mb-6">
                <div class="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    ACOUBOX
                </h1>
                <p class="mt-2 text-teal-200 font-medium">
                    Institut Pedralbes • Monitorització d'Aules
                </p>
            </div>
        </div>

        <!-- Login Form Section -->
        <div class="p-8 md:p-12">
            <div class="max-w-md mx-auto">
                <h1 class="text-3xl font-bold text-white text-center mb-8">
                    Iniciar Sessió
                </h1>
                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
                            Correu Electrònic
                        </label>
                        <input v-model="email" type="email" id="email"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-colors"
                            placeholder="correu@domini.com" required />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
                            Contrasenya
                        </label>
                        <input v-model="password" type="password" id="password"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-colors"
                            placeholder="••••••••" required />
                    </div>
                    <div class="flex justify-center pt-4">
                        <button type="submit"
                            class="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800">
                            Inicia Sessió
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '~/stores/userStore';
import { login } from '~/utils/communicationManager';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
    try {
        const response = await login(email.value, password.value);
        console.log('Respuesta del servidor:', response);

        if (response && response.user) {
            console.log('Login exitoso, datos del usuario:', response.user);

            userStore.setUser(response.user);

            router.push('/aulas');
        } else {
            console.error('Respuesta incorrecta:', response);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
    }
};
</script>

<style scoped>
/* Gradient animation for the header */
.bg-gradient-to-r {
    background-size: 200% 200%;
    animation: gradient-shift 10s ease infinite;
}

@keyframes gradient-shift {
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
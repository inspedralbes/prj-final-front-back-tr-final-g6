import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';

export const useUserStore = defineStore('user', () => {
    const user = ref(null);

    // Al montar el store, recuperamos el usuario del localStorage si está disponible
    onMounted(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        }
    });

    // Guardar el usuario en el store y en localStorage
    const setUser = (userData) => {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(userData)); // Guardamos el usuario completo
    };

    // Eliminar el usuario y borrar localStorage
    const logout = () => {
        user.value = null;
        localStorage.removeItem('user'); // Elimina el usuario del localStorage
    };

    // Computado para obtener el id del usuario
    const userId = computed(() => user.value?.id);

    // Computado para verificar si el usuario es administrador
    const isAdmin = computed(() => user.value?.admin === 1);

    return {
        user,
        setUser,
        logout,
        userId,  // Exponemos el id del usuario
        isAdmin, // Exponemos si el usuario es administrador
    };
});
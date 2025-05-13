<template>
  <header class="bg-slate-900 border-b border-slate-700 p-4 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo/Link Section -->
      <router-link
        to="/aulas"
        class="flex items-center group transition-opacity hover:opacity-90"
      >
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-blue-800 flex items-center justify-center mr-3 overflow-hidden"
        >
          <img
            src="../public/logo.jpg"
            alt="Logo Institut Pedralbes"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-xl font-semibold text-white hidden md:inline"></span>
      </router-link>

      <!-- Contenedor derecho: Login + Menú -->
      <div class="flex items-center space-x-2">
        <!-- Login Button -->
        <router-link
          v-if="!userStore.isLoggedIn"
          to="/login"
          class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-blue-500 shadow-sm"
        >
          <i class="pi pi-sign-in text-lg"></i>
          <span class="hidden sm:inline">Iniciar Sessió</span>
        </router-link>

        <!-- Menu Dropdown -->
        <div class="relative">
          <button
            @click="toggleMenu"
            class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600 shadow-sm"
          >
            <i class="pi pi-user text-lg"></i>
            <span class="hidden sm:inline">Menú</span>
            <i
              class="pi pi-chevron-down text-xs transition-transform duration-200"
              :class="{ 'rotate-180': isMenuVisible }"
            ></i>
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isMenuVisible"
              class="absolute right-0 mt-2 w-56 origin-top-right bg-slate-800 rounded-lg shadow-lg ring-1 ring-slate-700 focus:outline-none z-50"
              @click.stop
            >
              <div class="py-1">
                <router-link
                  to="/aulas"
                  class="flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors"
                  @click="isMenuVisible = false"
                >
                  <i class="pi pi-home mr-3"></i>
                  <span>Aules</span>
                </router-link>

                <router-link
                  to="/mapas"
                  class="flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors"
                  @click="isMenuVisible = false"
                >
                  <i class="pi pi-map mr-3"></i>
                  <span>Mapes</span>
                </router-link>

                <router-link
                  to="/ranking"
                  class="flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors"
                  @click="isMenuVisible = false"
                >
                  <i class="pi pi-chart-bar mr-3"></i>
                  <span>Ranking</span>
                </router-link>

                <router-link
                  v-if="isAdmin"
                  to="/admin"
                  class="flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors"
                  @click="isMenuVisible = false"
                >
                  <i class="pi pi-cog mr-3"></i>
                  <span>Administració</span>
                </router-link>

                <button
                  @click="logout"
                  class="w-full flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors text-left"
                >
                  <i class="pi pi-sign-out mr-3"></i>
                  <span>Tancar Sessió</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/userStore";

const router = useRouter();
const isMenuVisible = ref(false);
const userStore = useUserStore();

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const logout = () => {
  userStore.logout();
  router.push("/login");
  isMenuVisible.value = false;
};

const isAdmin = computed(() => userStore.user?.admin === 1);
</script>

<style scoped></style>

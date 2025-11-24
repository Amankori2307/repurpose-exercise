<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar for authenticated users -->
    <Sidebar 
      v-if="isLoggedIn" 
      :sidebar-open="sidebarOpen" 
      @toggle-sidebar="toggleSidebar" 
    />
    
    <!-- Mobile/Tablet header with hamburger -->
    <div v-if="isLoggedIn" class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 class="text-lg font-light text-gray-900">Blog</h1>
      <button 
        @click="toggleSidebar"
        class="p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
    
    <!-- Main content -->
    <div class="transition-all duration-300"
         :class="{ 
           'lg:ml-64': isLoggedIn,
           'pt-16 lg:pt-0': isLoggedIn
         }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import Sidebar from './Sidebar.vue'

const { isLoggedIn } = useAuth()
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>
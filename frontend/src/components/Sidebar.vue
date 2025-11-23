<template>
  <div class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out"
       :class="{ '-translate-x-full md:translate-x-0': !sidebarOpen, 'translate-x-0': sidebarOpen }">
    
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-lg font-light text-gray-900">Blog</h2>
      <p class="text-xs text-gray-500 mt-1">{{ user?.username || 'Welcome' }}</p>
    </div>
    
    <!-- Navigation -->
    <nav class="p-4 space-y-1">
      <router-link 
        to="/dashboard"
        class="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        :class="{ 'bg-gray-100 text-gray-900 font-medium': $route.path === '/dashboard' }"
      >
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        Dashboard
      </router-link>
      
      <router-link 
        to="/add-post"
        class="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        :class="{ 'bg-gray-100 text-gray-900 font-medium': $route.path === '/add-post' }"
      >
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Create Post
      </router-link>
      
      <router-link 
        to="/my-posts"
        class="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        :class="{ 'bg-gray-100 text-gray-900 font-medium': $route.path === '/my-posts' }"
      >
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        My Posts
      </router-link>
      
      <router-link 
        to="/all-posts"
        class="flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        :class="{ 'bg-gray-100 text-gray-900 font-medium': $route.path === '/all-posts' }"
      >
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
        All Posts
      </router-link>
    </nav>
    
    <!-- Bottom section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      <button 
        @click="handleLogout"
        class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
      >
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Logout
      </button>
    </div>
  </div>

  <!-- Overlay for mobile -->
  <div 
    v-if="sidebarOpen" 
    class="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
    @click="toggleSidebar"
  ></div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

interface Props {
  sidebarOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleSidebar: []
}>()

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}

const toggleSidebar = () => {
  emit('toggleSidebar')
}
</script>
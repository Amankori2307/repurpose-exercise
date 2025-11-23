<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-light text-gray-900 mb-2">Welcome</h1>
          <p class="text-sm text-gray-500">You are logged in</p>
        </div>
        
        <div v-if="user" class="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
          <div class="space-y-2 text-sm">
            <p class="text-gray-700">
              <span class="text-gray-500">Username:</span> {{ user.username }}
            </p>
            <p class="text-gray-700">
              <span class="text-gray-500">Email:</span> {{ user.email }}
            </p>
            <p class="text-gray-700">
              <span class="text-gray-500">User ID:</span> {{ user.id }}
            </p>
          </div>
        </div>

        <div class="mb-8 p-4 bg-green-50 border border-green-200 rounded">
          <p class="text-sm text-green-700">Authentication successful. Your token has been saved.</p>
        </div>

        <div class="space-y-3">
          <router-link 
            to="/add-post" 
            class="block w-full px-4 py-3 bg-gray-900 text-white text-center rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Create New Post
          </router-link>
          <router-link 
            to="/my-posts" 
            class="block w-full px-4 py-3 bg-white text-gray-700 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            View My Posts
          </router-link>
          <router-link 
            to="/all-posts" 
            class="block w-full px-4 py-3 bg-white text-gray-700 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            View All Posts
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
</script>
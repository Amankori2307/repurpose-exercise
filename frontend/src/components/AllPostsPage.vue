<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-light text-gray-900">All Posts</h1>
          <button 
            @click="() => refetch()" 
            :disabled="loading"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link 
            to="/dashboard" 
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Dashboard
          </router-link>
          <span class="text-gray-300">|</span>
          <router-link 
            to="/add-post" 
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            New Post
          </router-link>
          <span class="text-gray-300">|</span>
          <router-link 
            to="/my-posts" 
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            My Posts
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <p class="text-gray-500">Loading posts...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <p class="text-red-600 mb-4">Error loading posts: {{ error.message }}</p>
        <button 
          @click="() => refetch()" 
          class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="!posts || posts.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <p class="text-gray-500 mb-2">No posts available yet.</p>
        <p class="text-sm text-gray-400">Be the first to create a post.</p>
      </div>

      <div v-else class="space-y-4">
        <PostCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core'
import { useQuery } from '@vue/apollo-composable'
import { computed, onActivated } from 'vue'
import PostCard from './PostCard.vue'

const ALL_POSTS_QUERY = gql`
  query AllPosts {
    allPosts {
      id
      title
      content
      authorId
      authorUsername
      createdAt
      updatedAt
    }
  }
`

const { result, loading, error, refetch } = useQuery(ALL_POSTS_QUERY, null, {
  fetchPolicy: 'cache-and-network',
})

const posts = computed(() => result.value?.allPosts || [])

// Refetch when navigating to this page
onActivated(() => {
  refetch()
})
</script>
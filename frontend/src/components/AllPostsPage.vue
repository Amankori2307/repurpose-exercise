<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-light text-gray-900 mb-6">All Posts</h1>
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
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import PostCard from './PostCard.vue'

const ALL_POSTS_QUERY = gql`
  query AllPosts {
    allPosts {
      id
      title
      content
      authorId
      createdAt
      updatedAt
    }
  }
`

const { result, loading, error, refetch } = useQuery(ALL_POSTS_QUERY)

const posts = computed(() => result.value?.allPosts || [])
</script>
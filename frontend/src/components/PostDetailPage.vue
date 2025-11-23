<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <router-link 
          to="/all-posts" 
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
        >
          ← Back to All Posts
        </router-link>
      </div>

      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <p class="text-gray-500">Loading post...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <p class="text-red-600 mb-4">Error loading post: {{ error.message }}</p>
        <button 
          @click="refetch" 
          class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="!post" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <p class="text-gray-500 mb-2">Post not found</p>
        <router-link 
          to="/all-posts" 
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Go back to All Posts
        </router-link>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-8">
          <div class="mb-6">
            <h1 class="text-3xl font-light text-gray-900 mb-4">{{ post.title }}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span v-if="post.authorUsername" class="flex items-center gap-1">
                <span class="text-gray-400">@</span>
                <span>{{ post.authorUsername }}</span>
              </span>
              <span v-else class="flex items-center gap-1">
                <span>User #{{ post.authorId }}</span>
              </span>
              <span v-if="post.createdAt" class="flex items-center gap-1">
                <span>•</span>
                <span>{{ formatDate(post.createdAt) }}</span>
              </span>
              <span v-if="post.updatedAt && post.updatedAt !== post.createdAt" class="flex items-center gap-1">
                <span>•</span>
                <span>Updated: {{ formatDate(post.updatedAt) }}</span>
              </span>
            </div>
          </div>
          
          <div class="prose max-w-none">
            <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ post.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const route = useRoute()
const postId = computed(() => parseInt(route.params.id as string))

const POST_QUERY = gql`
  query Post($id: Int!) {
    post(id: $id) {
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

const { result, loading, error, refetch } = useQuery(
  POST_QUERY,
  () => ({ id: postId.value }),
  {
    enabled: () => !isNaN(postId.value),
  }
)

const post = computed(() => result.value?.post || null)

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>


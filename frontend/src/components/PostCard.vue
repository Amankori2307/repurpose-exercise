<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div class="p-6">
      <div class="mb-4">
        <h3 class="text-xl font-light text-gray-900 mb-2">{{ post.title }}</h3>
        <div class="flex flex-wrap gap-4 text-xs text-gray-500">
          <span v-if="post.createdAt">
            {{ formatDate(post.createdAt) }}
          </span>
        </div>
      </div>
      
      <div class="text-gray-600 leading-relaxed whitespace-pre-wrap mb-4">
        {{ post.content }}
      </div>

      <div class="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>Author ID: {{ post.authorId }}</span>
        <span v-if="post.updatedAt && post.updatedAt !== post.createdAt">
          Updated: {{ formatDate(post.updatedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt?: string | null
  updatedAt?: string | null
}

defineProps<{
  post: Post
}>()

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>
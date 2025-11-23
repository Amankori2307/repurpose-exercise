<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-light text-gray-900 mb-6">Create New Post</h1>
        <div class="flex flex-wrap gap-3">
          <router-link 
            to="/dashboard" 
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Dashboard
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <form @submit.prevent="handleCreatePost" class="space-y-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                placeholder="Enter post title"
                required
                :disabled="loading"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                v-model="content"
                placeholder="Write your post content..."
                required
                :disabled="loading"
                rows="12"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-50 text-gray-900 resize-none"
              ></textarea>
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {{ error }}
            </div>

            <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              {{ success }}
            </div>

            <div class="flex gap-3">
              <button 
                type="submit" 
                :disabled="loading || !title.trim() || !content.trim()" 
                class="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {{ loading ? 'Creating...' : 'Create Post' }}
              </button>
              
              <button 
                type="button" 
                @click="clearForm" 
                :disabled="loading"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div v-if="title.trim() || content.trim()" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-sm font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">Preview</h3>
          <div class="space-y-4">
            <h4 class="text-xl font-light text-gray-900">{{ title || 'Untitled Post' }}</h4>
            <div class="text-gray-600 whitespace-pre-wrap leading-relaxed">{{ content || 'No content yet...' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useRouter } from 'vue-router'

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      authorId
      createdAt
      updatedAt
    }
  }
`

const router = useRouter()

const title = ref('')
const content = ref('')
const error = ref('')
const success = ref('')

const { mutate: createPost, loading } = useMutation(CREATE_POST_MUTATION)

const clearForm = () => {
  title.value = ''
  content.value = ''
  error.value = ''
  success.value = ''
}

const handleCreatePost = async () => {
  error.value = ''
  success.value = ''

  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Please fill in both title and content'
    return
  }

  try {
    const result = await createPost({
      input: {
        title: title.value.trim(),
        content: content.value.trim()
      }
    })

    if (result?.data?.createPost) {
      const newPost = result.data.createPost
      success.value = `Post "${newPost.title}" created successfully!`
      
      // Clear form after successful creation
      setTimeout(() => {
        clearForm()
        // Redirect to My Posts to see the new post
        router.push('/my-posts')
      }, 2000)
    }
  } catch (err: any) {
    console.error('Create post error:', err)
    if (err.graphQLErrors?.length > 0) {
      error.value = err.graphQLErrors[0].message
    } else if (err.networkError) {
      error.value = 'Network error. Please check your connection.'
    } else {
      error.value = 'Failed to create post. Please try again.'
    }
  }
}
</script>
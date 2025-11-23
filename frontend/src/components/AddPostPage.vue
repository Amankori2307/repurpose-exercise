<template>
  <div class="add-post-container">
    <div class="add-post-header">
      <h1>Create New Post</h1>
      <div class="header-actions">
        <router-link to="/dashboard" class="back-button">
          ← Back to Dashboard
        </router-link>
        <router-link to="/my-posts" class="my-posts-button">
          📝 My Posts
        </router-link>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
    </div>

    <div class="add-post-content">
      <div class="form-card">
        <form @submit.prevent="handleCreatePost" class="post-form">
          <div class="form-group">
            <label for="title">Post Title:</label>
            <input
              id="title"
              v-model="title"
              type="text"
              placeholder="Enter your post title"
              required
              :disabled="loading"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="content">Post Content:</label>
            <textarea
              id="content"
              v-model="content"
              placeholder="Write your post content here..."
              required
              :disabled="loading"
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              :disabled="loading || !title.trim() || !content.trim()" 
              class="submit-button"
            >
              <span v-if="loading">Creating Post...</span>
              <span v-else>✍️ Create Post</span>
            </button>
            
            <button 
              type="button" 
              @click="clearForm" 
              :disabled="loading"
              class="clear-button"
            >
              🗑️ Clear
            </button>
          </div>
        </form>
      </div>

      <div class="preview-card" v-if="title.trim() || content.trim()">
        <h3>Preview:</h3>
        <div class="post-preview">
          <h4 class="preview-title">{{ title || 'Untitled Post' }}</h4>
          <div class="preview-content">{{ content || 'No content yet...' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useAuth } from '../composables/useAuth'
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

const { logout } = useAuth()
const router = useRouter()

const title = ref('')
const content = ref('')
const error = ref('')
const success = ref('')

const { mutate: createPost, loading } = useMutation(CREATE_POST_MUTATION)

const handleLogout = () => {
  logout()
  router.push('/login')
}

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

<style scoped>
.add-post-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.add-post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-post-header h1 {
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.back-button {
  background-color: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #1976D2;
}

.my-posts-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.my-posts-button:hover {
  background-color: #45a049;
}

.logout-button {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.add-post-content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-card, .preview-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input, .form-textarea {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-input:disabled, .form-textarea:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  color: #f44336;
  font-size: 0.9rem;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 5px;
  border-left: 4px solid #f44336;
}

.success-message {
  color: #4CAF50;
  font-size: 0.9rem;
  padding: 1rem;
  background-color: #e8f5e8;
  border-radius: 5px;
  border-left: 4px solid #4CAF50;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.submit-button, .clear-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  flex: 1;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.clear-button {
  background-color: #f5f5f5;
  color: #666;
  border: 2px solid #ddd;
}

.clear-button:hover:not(:disabled) {
  background-color: #eeeeee;
}

.preview-card h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.post-preview {
  margin-top: 1rem;
}

.preview-title {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.preview-content {
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .add-post-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .add-post-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .add-post-container {
    padding: 10px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
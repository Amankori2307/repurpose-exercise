<template>
  <div class="posts-container">
    <div class="posts-header">
      <h1>My Posts</h1>
      <div class="header-actions">
        <router-link to="/dashboard" class="back-button">
          ← Back to Dashboard
        </router-link>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
    </div>

    <div class="posts-content">
      <div v-if="loading" class="loading">
        Loading your posts...
      </div>

      <div v-else-if="error" class="error-message">
        <p>Error loading posts: {{ error.message }}</p>
        <button @click="() => refetch()" class="retry-button">
          Try Again
        </button>
      </div>

      <div v-else-if="!posts || posts.length === 0" class="no-posts">
        <p>📝 You haven't created any posts yet.</p>
        <p>Start writing to see your posts here!</p>
      </div>

      <div v-else class="posts-list">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <h3 class="post-title">{{ post.title }}</h3>
            <div class="post-meta">
              <span class="post-id">ID: {{ post.id }}</span>
              <span class="post-date" v-if="post.createdAt">
                Created: {{ formatDate(post.createdAt) }}
              </span>
            </div>
          </div>
          
          <div class="post-content">
            {{ post.content }}
          </div>

          <div class="post-footer">
            <span class="author-info">Author ID: {{ post.authorId }}</span>
            <span v-if="post.updatedAt" class="updated-date">
              Updated: {{ formatDate(post.updatedAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const MY_POSTS_QUERY = gql`
  query MyPosts {
    myPosts {
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

const { result, loading, error, refetch } = useQuery(MY_POSTS_QUERY)

const posts = computed(() => result.value?.myPosts || [])

const handleLogout = () => {
  logout()
  router.push('/login')
}

const formatDate = (dateString: string) => {
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

<style scoped>
.posts-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.posts-header h1 {
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

.posts-content {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  color: #666;
}

.error-message {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  color: #f44336;
}

.retry-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.no-posts {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  color: #666;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.post-header {
  padding: 1.5rem 1.5rem 0;
}

.post-title {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.post-content {
  padding: 1rem 1.5rem;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.post-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
  border-top: 1px solid #f0f0f0;
  margin-top: 1rem;
  padding-top: 1rem;
}

.author-info {
  font-weight: 500;
}

@media (max-width: 768px) {
  .posts-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .posts-container {
    padding: 10px;
  }
}
</style>
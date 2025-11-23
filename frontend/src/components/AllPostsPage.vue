<template>
  <div class="posts-container">
    <div class="posts-header">
      <h1>All Posts</h1>
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

    <div class="posts-content">
      <div v-if="loading" class="loading">
        Loading all posts...
      </div>

      <div v-else-if="error" class="error-message">
        <p>Error loading posts: {{ error.message }}</p>
        <button @click="() => refetch()" class="retry-button">
          Try Again
        </button>
      </div>

      <div v-else-if="!posts || posts.length === 0" class="no-posts">
        <p>📝 No posts available yet.</p>
        <p>Be the first to create a post!</p>
      </div>

      <div v-else class="posts-list">
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
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
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

const { logout } = useAuth()
const router = useRouter()

const { result, loading, error, refetch } = useQuery(ALL_POSTS_QUERY)

const posts = computed(() => result.value?.allPosts || [])

const handleLogout = () => {
  logout()
  router.push('/login')
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
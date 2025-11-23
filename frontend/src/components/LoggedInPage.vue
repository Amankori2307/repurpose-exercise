<template>
  <div class="logged-in-container">
    <div class="logged-in-card">
      <div class="header">
        <h1>Welcome!</h1>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
      
      <div class="user-info">
        <h2>You are logged in</h2>
        <div v-if="user" class="user-details">
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>User ID:</strong> {{ user.id }}</p>
        </div>
      </div>

      <div class="success-message">
        <p>✅ Authentication successful!</p>
        <p>Your token has been saved and you are now logged in.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.logged-in-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.logged-in-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #333;
  margin: 0;
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

.user-info {
  margin-bottom: 2rem;
}

.user-info h2 {
  color: #4CAF50;
  margin-bottom: 1rem;
}

.user-details {
  text-align: left;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  border-left: 4px solid #4CAF50;
}

.user-details p {
  margin: 0.5rem 0;
  color: #555;
}

.success-message {
  background-color: #e8f5e8;
  padding: 1rem;
  border-radius: 5px;
  color: #2e7d32;
}

.success-message p {
  margin: 0.5rem 0;
}
</style>
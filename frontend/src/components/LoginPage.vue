<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>

        <div class="auth-switch">
          Don't have an account? 
          <router-link to="/register" class="switch-button">
            Register here
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        username
        email
      }
    }
  }
`

const username = ref('')
const password = ref('')
const error = ref('')

const { mutate: loginUser, loading } = useMutation(LOGIN_MUTATION)
const { login } = useAuth()
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    const result = await loginUser({
      input: {
        username: username.value,
        password: password.value
      }
    })

    if (result?.data?.login) {
      const { access_token, user } = result.data.login
      
      // Use auth composable to handle login
      login(access_token, user)
      
      // Clear form
      username.value = ''
      password.value = ''
      
      // Navigate to dashboard
      router.push('/dashboard')
    }
  } catch (err: any) {
    console.error('Login error:', err)
    if (err.graphQLErrors?.length > 0) {
      error.value = err.graphQLErrors[0].message
    } else if (err.networkError) {
      error.value = 'Network error. Please check your connection.'
    } else {
      error.value = 'Login failed. Please try again.'
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group input:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 5px;
}

.login-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background-color: #45a049;
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.switch-button {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.switch-button:hover {
  color: #45a049;
}
</style>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-8">
          <h2 class="text-3xl font-light text-gray-900 text-center mb-2">
            Sign in
          </h2>
          <p class="text-center text-sm text-gray-500">
            Welcome back
          </p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              :disabled="loading"
              placeholder="Enter your username"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-50 text-gray-900"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :disabled="loading"
              placeholder="Enter your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-50 text-gray-900"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {{ error }}
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have an account? 
              <router-link to="/register" class="text-gray-900 hover:underline font-medium">
                Register
              </router-link>
            </p>
          </div>
        </form>
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


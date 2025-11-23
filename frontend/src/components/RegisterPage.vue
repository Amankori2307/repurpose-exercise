<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-8">
          <h2 class="text-3xl font-light text-gray-900 text-center mb-2">
            Create account
          </h2>
          <p class="text-center text-sm text-gray-500">
            Join today
          </p>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
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
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="loading"
              placeholder="Enter your email"
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
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              :disabled="loading"
              placeholder="Confirm your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-50 text-gray-900"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {{ error }}
          </div>

          <div v-if="success" class="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
            {{ success }}
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <router-link to="/login" class="text-gray-900 hover:underline font-medium">
                Sign in
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

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const { mutate: registerUser, loading } = useMutation(REGISTER_MUTATION)
const { login } = useAuth()
const router = useRouter()

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  try {
    const result = await registerUser({
      input: {
        username: username.value,
        email: email.value,
        password: password.value
      }
    })

    if (result?.data?.register) {
      const { access_token, user } = result.data.register
      
      // Use auth composable to handle login
      login(access_token, user)
      
      // Clear form
      username.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      
      // Navigate to dashboard
      router.push('/dashboard')
    }
  } catch (err: any) {
    console.error('Registration error:', err)
    if (err.graphQLErrors?.length > 0) {
      error.value = err.graphQLErrors[0].message
    } else if (err.networkError) {
      error.value = 'Network error. Please check your connection.'
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  }
}
</script>


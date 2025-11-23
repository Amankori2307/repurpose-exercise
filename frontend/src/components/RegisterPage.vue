<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister" class="register-form">
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
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
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

        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading" class="register-button">
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>

        <div class="auth-switch">
          Already have an account? 
          <button type="button" @click="$emit('switch-to-login')" class="switch-button">
            Login here
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

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

defineEmits(['switch-to-login'])

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
      
      // Store the token
      localStorage.setItem('access_token', access_token)
      
      // Clear form
      username.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      
      success.value = `Registration successful! Welcome, ${user.username}!`
      
      console.log('Registration successful!', user)
      
      // You can emit an event or use a router to navigate
      setTimeout(() => {
        alert('Registration successful! You are now logged in.')
      }, 1000)
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

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.register-form {
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

.success-message {
  color: #4CAF50;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background-color: #e8f5e8;
  border-radius: 5px;
}

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #45a049;
}

.register-button:disabled {
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
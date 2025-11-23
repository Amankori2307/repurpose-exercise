<script setup lang="ts">
import { ref } from 'vue'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'

const currentView = ref<'login' | 'register'>('login')

const switchToLogin = () => {
  currentView.value = 'login'
}

const switchToRegister = () => {
  currentView.value = 'register'
}
</script>

<template>
  <div class="app">
    <LoginPage 
      v-if="currentView === 'login'" 
      @switch-to-register="switchToRegister"
    />
    <RegisterPage 
      v-else-if="currentView === 'register'" 
      @switch-to-login="switchToLogin"
    />
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
}
</style>

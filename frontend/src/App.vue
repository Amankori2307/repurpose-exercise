<script setup lang="ts">
import { useNotifications } from './composables/useNotifications'
import { useAuth } from './composables/useAuth'
import NotificationToast from './components/NotificationToast.vue'

const { notifications, dismissNotification } = useNotifications()
const { isLoggedIn } = useAuth()
</script>

<template>
  <div class="app">
    <router-view />
    
    <div v-if="isLoggedIn" class="notifications-container">
      <NotificationToast
        v-for="notification in notifications"
        :key="notification.id"
        :visible="notification.visible"
        :author-id="notification.authorId"
        :post-title="notification.postTitle"
        @dismiss="dismissNotification(notification.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
}

.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
  width: auto;
  max-width: 400px;
}

.notifications-container > * {
  pointer-events: all;
  margin-bottom: 10px;
  position: relative;
}

@media (max-width: 768px) {
  .notifications-container {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
}
</style>

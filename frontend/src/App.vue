<script setup lang="ts">
import { watch } from 'vue'
import Layout from './components/Layout.vue'
import NotificationToast from './components/NotificationToast.vue'
import { useAuth } from './composables/useAuth'
import { useNotifications } from './composables/useNotifications'

const { notifications, dismissNotification } = useNotifications()
const { isLoggedIn } = useAuth()

// Debug logging for UI
watch(notifications, (newNotifications) => {
  console.log('[App] Notifications array changed:', newNotifications)
  console.log('[App] Number of notifications:', newNotifications.length)
  console.log('[App] Is logged in:', isLoggedIn.value)
}, { deep: true })

console.log('[App] Component initialized')
console.log('[App] Initial notifications:', notifications.value)
console.log('[App] Initial login state:', isLoggedIn.value)
</script>

<template>
  <Layout>
    <router-view />
    
    <!-- Notifications -->
    <div v-if="isLoggedIn" class="fixed top-4 right-4 z-50 space-y-3 pointer-events-none max-w-sm w-full px-4 md:px-0">
      <NotificationToast
        v-for="notification in notifications"
        :key="notification.id"
        :visible="notification.visible"
        :author-id="notification.authorId"
        :post-title="notification.postTitle"
        @dismiss="dismissNotification(notification.id)"
      />
    </div>
  </Layout>
</template>

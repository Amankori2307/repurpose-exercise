<script setup lang="ts">
import { useNotifications } from './composables/useNotifications'
import { useAuth } from './composables/useAuth'
import Layout from './components/Layout.vue'
import NotificationToast from './components/NotificationToast.vue'

const { notifications, dismissNotification } = useNotifications()
const { isLoggedIn } = useAuth()
</script>

<template>
  <Layout>
    <router-view />
    
    <!-- Notifications -->
    <div v-if="isLoggedIn" class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
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

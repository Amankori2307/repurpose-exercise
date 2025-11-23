<template>
  <div v-if="visible" class="notification-toast" :class="{ show: showToast }">
    <div class="notification-content">
      <div class="notification-icon">📝</div>
      <div class="notification-text">
        <div class="notification-title">New Post Added!</div>
        <div class="notification-message">{{ message }}</div>
      </div>
      <div class="notification-actions">
        <button @click="viewAllPosts" class="view-button">
          View All Posts
        </button>
        <button @click="dismiss" class="dismiss-button">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  visible: boolean
  authorId: number
  postTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  dismiss: []
}>()

const router = useRouter()
const showToast = ref(false)

const message = computed(() => {
  return `Author #${props.authorId} added "${props.postTitle}"`
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      showToast.value = true
    }, 100)
    
    setTimeout(() => {
      dismiss()
    }, 5000)
  } else {
    showToast.value = false
  }
})

const viewAllPosts = () => {
  router.push('/all-posts')
  dismiss()
}

const dismiss = () => {
  showToast.value = false
  setTimeout(() => {
    emit('dismiss')
  }, 300)
}
</script>

<style scoped>
.notification-toast {
  position: relative;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-left: 4px solid #4CAF50;
  width: 100%;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.notification-toast.show {
  transform: translateX(0);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.notification-message {
  color: #666;
  font-size: 0.8rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.view-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.view-button:hover {
  background-color: #45a049;
}

.dismiss-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.dismiss-button:hover {
  color: #666;
}

@media (max-width: 768px) {
  .notification-toast {
    transform: translateY(-100%);
  }

  .notification-toast.show {
    transform: translateY(0);
  }

  .notification-actions {
    flex-direction: row;
    align-items: center;
  }
}
</style>
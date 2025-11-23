<template>
  <div 
    v-if="visible" 
    class="bg-white rounded-lg shadow-sm border border-gray-200 w-full pointer-events-auto transform transition-all duration-300 ease-out"
    :class="{ 'translate-x-full opacity-0': !showToast, 'translate-x-0 opacity-100': showToast }"
  >
    <div class="p-4">
      <div class="flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">New Post</p>
          <p class="mt-1 text-sm text-gray-600 break-words">{{ postTitle }}</p>
          <div class="mt-3 flex gap-2">
            <button 
              @click="viewPost"
              class="text-xs text-gray-900 hover:text-gray-700 transition-colors font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded"
            >
              View Post →
            </button>
            <button 
              @click="viewAllPosts"
              class="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              All Posts
            </button>
          </div>
        </div>
        <button 
          @click="dismiss"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1"
          aria-label="Close"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  visible: boolean
  postId: number
  authorId: number
  postTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  dismiss: []
}>()

const router = useRouter()
const showToast = ref(false)

onMounted(() => {
  console.log('[NotificationToast] Component mounted with props:', {
    visible: props.visible,
    postId: props.postId,
    authorId: props.authorId,
    postTitle: props.postTitle,
  })
})

watch(() => props.visible, (newVal) => {
  console.log('[NotificationToast] Visible prop changed:', newVal)
  if (newVal) {
    console.log('[NotificationToast] Showing toast after 100ms')
    setTimeout(() => {
      showToast.value = true
      console.log('[NotificationToast] showToast set to true')
    }, 100)
    
    setTimeout(() => {
      console.log('[NotificationToast] Auto-dismissing after 5 seconds')
      dismiss()
    }, 5000)
  } else {
    console.log('[NotificationToast] Hiding toast')
    showToast.value = false
  }
}, { immediate: true })

watch(showToast, (newVal) => {
  console.log('[NotificationToast] showToast state changed:', newVal)
})

const viewPost = () => {
  router.push(`/post/${props.postId}`)
  dismiss()
}

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


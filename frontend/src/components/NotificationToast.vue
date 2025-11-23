<template>
  <div v-if="visible" 
       class="bg-white rounded-lg shadow-md border border-gray-200 max-w-sm w-full pointer-events-auto transform transition-all duration-300 ease-out"
       :class="{ 'translate-x-full opacity-0': !showToast, 'translate-x-0 opacity-100': showToast }">
    <div class="p-4">
      <div class="flex items-start">
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">New Post Added</p>
          <p class="mt-1 text-xs text-gray-500">{{ message }}</p>
          <div class="mt-3">
            <button 
              @click="viewAllPosts"
              class="text-xs text-gray-700 hover:text-gray-900 underline"
            >
              View All Posts
            </button>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button 
            @click="dismiss"
            class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <span class="sr-only">Close</span>
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
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


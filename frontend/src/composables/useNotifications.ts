import { ref } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useAuth } from './useAuth'

const NEW_POST_SUBSCRIPTION = gql`
  subscription NewPost {
    newPost {
      id
      title
      content
      authorId
      createdAt
      updatedAt
    }
  }
`

interface NotificationData {
  id: number
  authorId: number
  postTitle: string
  visible: boolean
}

const notifications = ref<NotificationData[]>([])

export function useNotifications() {
  const { user, isLoggedIn } = useAuth()
  
  const { onResult } = useSubscription(NEW_POST_SUBSCRIPTION, null, {
    enabled: isLoggedIn,
  })

  onResult((result) => {
    if (result.data?.newPost) {
      const newPost = result.data.newPost
      
      if (newPost.authorId !== user.value?.id) {
        const notification: NotificationData = {
          id: Date.now(),
          authorId: newPost.authorId,
          postTitle: newPost.title,
          visible: true,
        }
        
        notifications.value.push(notification)
        
        setTimeout(() => {
          removeNotification(notification.id)
        }, 5000)
      }
    }
  })

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const dismissNotification = (id: number) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.visible = false
      setTimeout(() => {
        removeNotification(id)
      }, 300)
    }
  }

  return {
    notifications,
    dismissNotification,
  }
}
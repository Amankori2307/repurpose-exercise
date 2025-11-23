import { gql } from "@apollo/client/core";
import { useSubscription } from "@vue/apollo-composable";
import { ref, watch } from "vue";
import { useAuth } from "./useAuth";

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
`;

interface NotificationData {
  id: number;
  authorId: number;
  postTitle: string;
  visible: boolean;
}

const notifications = ref<NotificationData[]>([]);

export function useNotifications() {
  const { user, isLoggedIn } = useAuth();

  console.log("[Notifications] Initializing notification system");
  console.log("[Notifications] Initial login state:", isLoggedIn.value);
  console.log("[Notifications] Current user:", user.value);

  // Create subscription that's enabled based on login state
  const { onResult, onError, restart, stop } = useSubscription(
    NEW_POST_SUBSCRIPTION,
    null,
    {
      enabled: isLoggedIn,
    }
  );

  console.log(
    "[Notifications] Subscription created, enabled:",
    isLoggedIn.value
  );

  // Watch login state and manage subscription lifecycle
  watch(
    isLoggedIn,
    (loggedIn) => {
      console.log("[Notifications] Login state changed:", loggedIn);
      if (loggedIn) {
        console.log("[Notifications] User logged in, restarting subscription");
        console.log("[Notifications] Current user ID:", user.value?.id);
        // Restart subscription when user logs in to ensure it's active
        restart();
      } else {
        console.log("[Notifications] User logged out, stopping subscription");
        // Stop subscription when user logs out
        stop();
        // Clear notifications when user logs out
        notifications.value = [];
        console.log("[Notifications] Notifications cleared");
      }
    },
    { immediate: true }
  );

  // Handle subscription results
  onResult((result: any) => {
    console.log("[Notifications] Subscription result received:", result);
    if (result.data?.newPost) {
      const newPost = result.data.newPost;
      console.log("[Notifications] New post received:", {
        id: newPost.id,
        title: newPost.title,
        authorId: newPost.authorId,
        currentUserId: user.value?.id,
      });

      // Only show notification if the post is not from the current user
      if (newPost.authorId !== user.value?.id) {
        console.log(
          "[Notifications] Post is from different user, creating notification"
        );
        const notification: NotificationData = {
          id: Date.now(),
          authorId: newPost.authorId,
          postTitle: newPost.title,
          visible: true,
        };

        notifications.value.push(notification);
        console.log(
          "[Notifications] Notification added. Total notifications:",
          notifications.value.length
        );
        console.log("[Notifications] All notifications:", notifications.value);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          console.log(
            "[Notifications] Auto-dismissing notification:",
            notification.id
          );
          removeNotification(notification.id);
        }, 5000);
      } else {
        console.log(
          "[Notifications] Post is from current user, skipping notification"
        );
      }
    } else {
      console.log("[Notifications] Result data missing or invalid:", result);
    }
  });

  // Handle subscription errors
  onError((error: any) => {
    console.error("[Notifications] Subscription error:", error);
    console.error("[Notifications] Error details:", {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
    });
  });

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
      console.log("[Notifications] Notification removed:", id);
      console.log(
        "[Notifications] Remaining notifications:",
        notifications.value.length
      );
    } else {
      console.log("[Notifications] Notification not found for removal:", id);
    }
  };

  const dismissNotification = (id: number) => {
    console.log("[Notifications] Dismissing notification:", id);
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.visible = false;
      console.log("[Notifications] Notification marked as invisible");
      setTimeout(() => {
        removeNotification(id);
      }, 300);
    } else {
      console.log("[Notifications] Notification not found for dismissal:", id);
    }
  };

  return {
    notifications,
    dismissNotification,
  };
}

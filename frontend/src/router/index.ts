import { createRouter, createWebHistory } from "vue-router";
import AddPostPage from "../components/AddPostPage.vue";
import AllPostsPage from "../components/AllPostsPage.vue";
import LoggedInPage from "../components/LoggedInPage.vue";
import LoginPage from "../components/LoginPage.vue";
import MyPostsPage from "../components/MyPostsPage.vue";
import RegisterPage from "../components/RegisterPage.vue";
import { useAuth } from "../composables/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/login",
      name: "login-alt",
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: LoggedInPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-posts",
      name: "my-posts",
      component: MyPostsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/all-posts",
      name: "all-posts",
      component: AllPostsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-post",
      name: "add-post",
      component: AddPostPage,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard to protect routes
router.beforeEach((to, _from, next) => {
  const { isLoggedIn } = useAuth();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    // Redirect to login if not authenticated
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && isLoggedIn.value) {
    // Redirect to dashboard if already logged in
    next({ name: "dashboard" });
    return;
  }

  // Allow navigation
  next();
});

export default router;

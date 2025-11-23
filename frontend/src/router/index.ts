import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import LoggedInPage from '../components/LoggedInPage.vue'
import MyPostsPage from '../components/MyPostsPage.vue'
import AllPostsPage from '../components/AllPostsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/login',
      name: 'login-alt',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: LoggedInPage
    },
    {
      path: '/my-posts',
      name: 'my-posts',
      component: MyPostsPage
    },
    {
      path: '/all-posts',
      name: 'all-posts',
      component: AllPostsPage
    }
  ]
})

export default router
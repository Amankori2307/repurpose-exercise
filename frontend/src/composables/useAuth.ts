import { ref, computed } from 'vue'

const token = ref<string | null>(localStorage.getItem('access_token'))
const storedUser = localStorage.getItem('user')
const user = ref<any>(storedUser ? JSON.parse(storedUser) : null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  const login = (accessToken: string, userData: any) => {
    token.value = accessToken
    user.value = userData
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  const getToken = () => token.value

  return {
    isLoggedIn,
    user: computed(() => user.value),
    login,
    logout,
    getToken
  }
}
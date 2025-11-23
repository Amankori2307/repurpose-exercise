import { ref, computed } from 'vue'

const token = ref<string | null>(localStorage.getItem('access_token'))
const user = ref<any>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  const login = (accessToken: string, userData: any) => {
    token.value = accessToken
    user.value = userData
    localStorage.setItem('access_token', accessToken)
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
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
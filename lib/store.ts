import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "./types"

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        set({ user, token })
      },
      clearAuth: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        set({ user: null, token: null })
      },
      updateUser: (userData) =>
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null
          // 同步更新 localStorage 中的用户信息
          if (updatedUser) {
            localStorage.setItem("user", JSON.stringify(updatedUser))
          }
          return { user: updatedUser }
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

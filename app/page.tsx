"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"

export default function HomePage() {
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    if (token) {
      router.replace("/courses")
    } else {
      router.replace("/login")
    }
  }, [token, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">加载中...</h1>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authApi, userApi } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.password || !formData.confirmPassword) {
      toast({
        title: "请填写完整信息",
        description: "所有字段都不能为空",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "密码太短",
        description: "密码至少需要6个字符",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "两次输入的密码不一致",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await authApi.register(formData.name, formData.password)

      if (response.data.code === 200) {
        const { userId, token } = response.data.data

        // Fetch user details
        const userResponse = await userApi.getUser(userId)
        if (userResponse.data.code === 200) {
          const user = userResponse.data.data
          setAuth(user, token)
          toast({
            title: "注册成功",
            description: `欢迎加入，${user.name}！`,
          })
          router.push("/courses")
        }
      } else {
        toast({
          title: "注册失败",
          description: response.data.message || "用户名已存在或注册失败",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "注册失败",
        description: error.response?.data?.message || "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">唐社长者学院</CardTitle>
          <CardDescription className="text-lg">创建您的账户，开始学习之旅</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-lg">
                用户名
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="请输入用户名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-14 text-lg"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg">
                密码
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码（至少6个字符）"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-14 pr-12 text-lg"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-lg">
                确认密码
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-14 pr-12 text-lg"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="h-14 w-full text-lg font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  注册中...
                </>
              ) : (
                "注册"
              )}
            </Button>

            <div className="text-center">
              <p className="text-base text-muted-foreground">
                已有账户？{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  立即登录
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

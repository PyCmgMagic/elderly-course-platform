"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"
import { BookOpen, Users, LogOut, GraduationCap, LayoutDashboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  const navItems = [
    { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
    { href: "/admin/courses", label: "课程管理", icon: BookOpen },
    { href: "/admin/users", label: "用户管理", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">管理后台</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} size="lg" className="gap-2 text-base">
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/courses">
            <Button variant="outline" size="lg" className="gap-2 text-base bg-transparent">
              返回前台
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-14 gap-3 px-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="text-lg">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden text-base md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-base">管理员</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="h-12 cursor-pointer text-base text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-5 w-5" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

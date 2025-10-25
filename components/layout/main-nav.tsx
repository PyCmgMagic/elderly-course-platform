"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"
import { BookOpen, User, LogOut, GraduationCap } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  const navItems = [
    { href: "/courses", label: "课程浏览", icon: BookOpen },
    { href: "/my-courses", label: "我的课程", icon: GraduationCap },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/courses" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="长者学院" width={32} height={32} className="text-primary" />
            <span className="text-xl font-bold">您好，欢迎来到长者学院~</span>
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

        <div className="flex items-center ">
          <ThemeSwitcher />
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
            <DropdownMenuLabel className="text-base">我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="h-12 cursor-pointer text-base">
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                个人资料
              </Link>
            </DropdownMenuItem>
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

      {/* Mobile Navigation */}
      <nav className="flex border-t md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button variant={isActive ? "default" : "ghost"} className="h-16 w-full flex-col gap-1 rounded-none">
                <Icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

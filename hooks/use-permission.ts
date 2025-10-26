import { useMemo } from "react"
import { useAuthStore } from "@/lib/store"
import { hasPermission, type UserRole } from "@/lib/auth"

export function usePermission() {
  const { user } = useAuthStore()
  
  const permissions = useMemo(() => {
    const userRole = user?.role
    
    return {
      // 基础权限检查
      canAccess: (requiredRole: UserRole) => hasPermission(userRole, requiredRole),
      
      // 具体功能权限
      canAccessAdmin: hasPermission(userRole, "admin"),
      canManageCourses: hasPermission(userRole, "admin"),
      canManageUsers: hasPermission(userRole, "admin"),
      canViewCourses: hasPermission(userRole, "user"),
      canEnrollCourses: hasPermission(userRole, "user"),
      canViewProfile: hasPermission(userRole, "user"),
      
      // 角色判断
      isAdmin: userRole === "admin",
      isUser: userRole === "user",
      
      // 当前用户角色
      role: userRole,
    }
  }, [user?.role])
  
  return permissions
}

// 权限保护的组件包装器 Hook
export function useAuthGuard(requiredRole?: UserRole) {
  const { user, token } = useAuthStore()
  
  const isAuthenticated = !!token && !!user
  const hasRequiredPermission = requiredRole ? hasPermission(user?.role, requiredRole) : true
  
  return {
    isAuthenticated,
    hasRequiredPermission,
    canAccess: isAuthenticated && hasRequiredPermission,
    user,
    redirectToLogin: () => {
      window.location.href = "/login"
    },
    showAccessDenied: !hasRequiredPermission && isAuthenticated,
  }
}
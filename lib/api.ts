import axios, { type AxiosError } from "axios"
import type {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  User,
  Course,
  CourseListResponse,
  EnrolledCourse,
  EnrollmentUser,
  UserListResponse,
  UploadResponse,
} from "./types"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth APIs
export const authApi = {
  register: (name: string, password: string) =>
    api.post<ApiResponse<RegisterResponse>>("/register", { name, password }),

  login: (username: string, password: string) => api.post<ApiResponse<LoginResponse>>("/login", { username, password }),
}

// User APIs
export const userApi = {
  getUser: (id: number) => api.get<ApiResponse<User>>(`/user/${id}`),

  updateUser: (id: number, data: Partial<User>) => api.put<ApiResponse>(`/user/${id}`, data),
}

// Course APIs
export const courseApi = {
  getCourses: (params?: {
    category?: string
    keyword?: string
    page?: number
    pageSize?: number
  }) => api.get<ApiResponse<CourseListResponse>>("/courses", { params }),

  getCourse: (id: number) => api.get<ApiResponse<Course>>(`/course/${id}`),

  createCourse: (data: Partial<Course>) => api.post<ApiResponse<{ course_id: number }>>("/course", data),

  updateCourse: (id: number, data: Partial<Course>) => api.put<ApiResponse>(`/course/${id}`, data),

  deleteCourse: (id: number) => api.delete<ApiResponse>(`/course/${id}`),
}

// Enrollment APIs
export const enrollmentApi = {
  enroll: (course_id: number) => api.post<ApiResponse>("/enroll", { course_id }),

  cancelEnroll: (id: number) => api.delete<ApiResponse>(`/enroll/${id}`),

  getUserEnrollments: (userId: number) => api.get<ApiResponse<EnrolledCourse[]>>(`/enroll/user/${userId}`),

  getCourseEnrollments: (course_id: number) => api.get<ApiResponse<EnrollmentUser[]>>(`/enroll/course/${course_id}`),
}

// Admin APIs
export const adminApi = {
  getUsers: (params?: { keyword?: string; page?: number; pageSize?: number }) =>
    api.get<ApiResponse<UserListResponse>>("/admin/users", { params }),

  deleteUser: (id: number) => api.delete<ApiResponse>(`/admin/user/${id}`),
}

// Upload API
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.post<ApiResponse<UploadResponse>>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      // 如果上传成功，自动拼接完整的图片URL
      if (response.data.code === 200 && response.data.data.image_url) {
        const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""
        response.data.data.image_url = imageBaseUrl + response.data.data.image_url
      }
      return response
    })
  },
}

export default api
